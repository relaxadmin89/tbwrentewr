import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Resilient offline backup responses in case Gemini API is rate-limited or unavailable
function getOfflineResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase().trim();
  
  if (msg.includes("привет") || msg.includes("здравств") || msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("йоу") || msg.includes("ку") || msg.includes("салам")) {
    return `Привет! Я Помощник Gu. 😊 Рад общению!\n\nВ данный момент удаленный ИИ-сервер Gemini испытывает очень высокую нагрузку или превысил дневные квоты (Google API вернул ошибку 503/429). Поэтому я временно отвечаю вам в супер-быстром офлайн-режиме!\n\nЯ знаю абсолютно всё о Даниле (xgurusx, 24 года, Москва), его навыках, классных проектах и контактах. Что вас интересует?`;
  }
  
  if (msg.includes("навык") || msg.includes("стек") || msg.includes("технолог") || msg.includes("умеешь") || msg.includes("skills") || msg.includes("stack") || msg.includes("tech")) {
    return `Данил (xgurusx, 24 года, Москва) — профессиональный Full Stack разработчик и дизайнер! Вот его основной стек технологий:\n\n• Фронтенд: React, TypeScript, Tailwind CSS, Motion (Framer), Vite\n• Бэкенд & Системы: Node.js, Express, C#, C++, Docker, PostgreSQL, Firestore\n• Подходы: Упор на комфортную типографику, ультра-минималистичную эстетику, быструю загрузку и чистейший код без мусора!\n\nХотите узнать о его проектах? Просто спросите меня!`;
  }
  
  if (msg.includes("проект") || msg.includes("работы") || msg.includes("кейсы") || msg.includes("portfolio") || msg.includes("projects") || msg.includes("works")) {
    return `У Данила есть замечательные проекты, которые показывают его подход к разработке:\n\n1. ◉ Минималистичный интернет-магазин: удобный, летающе-быстрый каталог с плавной анимацией и простой логикой.\n2. ◇ Персональный сайт-портфолио (тот, на котором вы сейчас!): легкий интерфейс с изящным терминалом и адаптивной версткой.\n3. ❖ Органайзер на Каждый День: планировщик задач без лишнего шума, поддерживающий сохранение в офлайн.\n\nВсе выполненные проекты, реальные коммерческие кейсы и примеры кода публикуются в его официальном Telegram-канале:\n📢 t.me/portfolio_nafingexe`;
  }
  
  if (msg.includes("телеграм") || msg.includes("телега") || msg.includes("канал") || msg.includes("telegram") || msg.includes("tg") || msg.includes("t.me")) {
    return `Официальный Telegram-канал Данила — это место, где он делится своими наработками, кодом и процессом создания крутых штук. Загляните, там очень уютно:\n\n📢 t.me/portfolio_nafingexe\n\nЕго личный контакт для связи в Telegram: @xgurusx`;
  }
  
  if (msg.includes("контакт") || msg.includes("написать") || msg.includes("связь") || msg.includes("почта") || msg.includes("contact") || msg.includes("email") || msg.includes("mail")) {
    return `Связаться с Данилом напрямую можно в любое время:\n\n• Telegram: @xgurusx\n• Email: hsosat45@gmail.com\n• VK: vk.ru/xgurusx\n\nОн всегда открыт для интересных предложений, будь то фриланс, долгосрочные проекты или просто профессиональное общение!`;
  }

  if (msg.includes("кто ты") || msg.includes("что ты") || msg.includes("помощник") || msg.includes("assistant") || msg.includes("gu")) {
    return `Я Помощник Gu (Gu Assistant) — виртуальный компаньон Данила (xgurusx, 24 года, Москва). Я живу в его терминале и помогаю гостям сориентироваться, рассказываю о его бэкграунде и поддерживаю беседу.\n\nСейчас я работаю в режиме локального резервного копирования, так как внешние ИИ-сервера Gemini временно перегружены. Но я всё равно готов помочь по любым вопросам о Даниле!`;
  }

  // Default intelligent-looking template that fits the user's questions
  return `Я Помощник Gu. Из-за временной перегрузки серверов Gemini (Google вернул ошибку 429/503), я временно общаюсь с вами в интеллектуальном офлайн-режиме.\n\nЯ с удовольствием расскажу вам про:\n• Навыки и технологии Данила\n• Его ключевые проекты\n• Ссылку на официальный Telegram-канал\n• Способы связи с ним напрямую\n\nПросто спросите меня о навыках, проектах или контактах! Или посетите канал: t.me/portfolio_nafingexe`;
}

let lastGeminiFailureTime = 0;
const GEMINI_COOLDOWN_MS = 35000; // 35 seconds cooldown after any Gemini API failure

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Short-circuit: If Gemini recently failed or rate-limited, serve offline response immediately
    if (Date.now() - lastGeminiFailureTime < GEMINI_COOLDOWN_MS) {
      console.log("[Status] Gemini in cooldown, serving instant offline backup.");
      const offlineText = getOfflineResponse(message);
      return res.json({ text: offlineText });
    }

    let ai;
    try {
      ai = getAiClient();
    } catch (keyErr: any) {
      console.warn("Gemini API Client Error:", keyErr.message);
      return res.json({
        text: `Привет! Я Помощник Gu. К сожалению, API-ключ (GEMINI_API_KEY) не настроен в вашей панели Settings > Secrets. Пожалуйста, добавьте его, чтобы мы могли полноценно общаться через нейросеть!`
      });
    }

    const systemInstruction = "Вы — 'Помощник Gu' (Gu Assistant), интеллектуальный и полезный ИИ-помощник xgurusx (разработчика Данила, 24 года, Москва). Отвечайте дружелюбно, лаконично, в уютном минималистичном стиле на русском или английском в зависимости от языка пользователя. Вы общаетесь в терминале его портфолио. Знайте, что у xgurusx (Данила) есть классные навыки (TypeScript, React, Node.js, C#, C++, Docker и т.д.) и официальный Телеграм-канал t.me/portfolio_nafingexe.";

    // Convert history format to GoogleGenAI format
    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        formattedContents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text || "" }]
        });
      });
    }

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const candidateModels = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let responseText = "";
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        // Enforce a strict 2.5s timeout per model to prevent terminal hang ups
        const timeoutPromise = new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 2500)
        );

        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
          },
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.log(`[Status] Model ${modelName} occupied or timed out, trying fallback...`);
        lastError = err;
      }
    }

    if (!responseText) {
      // Record failure timestamp to trigger short-circuit cooldown
      lastGeminiFailureTime = Date.now();
      console.log("[Status] Utilizing offline smart backup responder.");
      responseText = getOfflineResponse(message);
    }

    res.json({ text: responseText });
  } catch (error: any) {
    // Record failure timestamp to trigger short-circuit cooldown
    lastGeminiFailureTime = Date.now();
    try {
      const fallbackText = getOfflineResponse(req.body.message || "");
      res.json({ text: fallbackText });
    } catch (innerErr) {
      res.status(500).json({ status: "unavailable" });
    }
  }
});

// Vite middleware setup
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false, // Explicitly disable HMR in development to prevent websocket connection attempts
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
