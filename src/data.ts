import { Translation, Project, Service } from './types';

export const translations: Record<'en' | 'ru', Translation & { telegramChannel: { title: string; desc: string; button: string } }> = {
  en: {
    title: 'xgurusx',
    subtitle: 'Full Stack Developer & Designer',
    bio: 'Hi, I am Danil. I create clean, beautiful websites, robust backend systems, and high-performance apps. I focus on comfortable typography, minimal aesthetics, and reliable, fast-loading code.',
    stats: {
      years: 'Years of Experience',
      projects: 'Projects Completed',
      clients: 'Happy Clients',
      coffee: 'Coffee Infused',
    },
    sections: {
      skills: 'Technical Skills',
      projects: 'My Portfolio',
      services: 'Services I Offer',
      console: 'Terminal Gu Ai',
      quickActions: 'Quick Navigation',
    },
    projects: {
      ecommerce: {
        title: '',
        desc: '',
      },
      portfolio: {
        title: '',
        desc: '',
      },
      taskApp: {
        title: '',
        desc: '',
      },
    },
    telegramChannel: {
      title: 'Official Telegram Channel',
      desc: 'Follow my channel for live updates, behind-the-scenes work, creative ideas, and source code previews.',
      button: 'Visit Portfolio Channel',
    },
    servicesList: {
      webDev: {
        title: 'Web Development',
        desc: 'Building responsive, fast, and SEO-friendly websites using modern tools. Clean code, cozy aesthetics.',
      },
      design: {
        title: 'UI/UX Design',
        desc: 'Designing cozy, beautiful interfaces with high readability, spacious layouts, and comfortable typography.',
      },
      bugFixes: {
        title: 'Bug Fixing & Speed',
        desc: 'Speeding up slow pages, fixing layout errors, debugging code, and optimizing mobile responsiveness.',
      },
      serverSide: {
        title: 'Backend & Databases',
        desc: 'Developing secure, fast APIs, databases, and servers. Robust architecture that you can rely on.',
      },
      appDev: {
        title: 'Mobile & PC Apps',
        desc: 'Creating lightweight applications for Windows, iOS, and Android with native feels and fluid actions.',
      },
      codeProtection: {
        title: 'Code Security',
        desc: 'Adding encryption, custom obfuscation, and protective measures to keep your source code safe.',
      },
      siteProtection: {
        title: 'Site Security',
        desc: 'Protecting websites against security threats, setting up secure firewalls, and carrying out audits.',
      },
    },
    console: {
      placeholder: 'Type a command (try "help" or "projects")...',
      welcome: 'Terminal initialized. I am AI Assistant Gu! Ask me anything about Danil, projects, or just chat. Type "help" for local commands.',
      helpText: 'Available commands: help, clear, bio, contact, skills, projects, services, reboot',
      notFound: 'Command not recognized. Type "help" to view valid parameters.',
      cleared: 'Console cleared.',
    },
    buttons: {
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      email: 'Email Me',
      telegram: 'Telegram Profile',
      vk: 'VKontakte',
      donate: 'Support Me',
      reboot: 'Reboot Experience',
      themeLight: 'Cozy Mode',
      themeDark: 'Dark Mode',
    },
  },
  ru: {
    title: 'xgurusx',
    subtitle: 'Full Stack Разработчик и Дизайнер',
    bio: 'Привет, я Данил! Я создаю простые, красивые и быстрые веб-сайты, надежные серверные решения и производительные приложения. В работе я ценю комфортную типографику, минималистичную эстетику и надежность кода.',
    stats: {
      years: 'Лет Опыта',
      projects: 'Сделано Проектов',
      clients: 'Довольных Клиентов',
      coffee: 'Выпито Кофе (л)',
    },
    sections: {
      skills: 'Профессиональные Навыки',
      projects: 'Моё Портфолио',
      services: 'Что я предлагаю',
      console: 'Terminal Gu Ai',
      quickActions: 'Быстрая Навигация',
    },
    projects: {
      ecommerce: {
        title: '',
        desc: '',
      },
      portfolio: {
        title: '',
        desc: '',
      },
      taskApp: {
        title: '',
        desc: '',
      },
    },
    telegramChannel: {
      title: 'Мой Телеграм-Канал',
      desc: 'Подписывайтесь на мой канал с портфолио, где я регулярно публикую новые работы, исходники, идеи и полезные материалы.',
      button: 'Перейти в канал портфолио',
    },
    servicesList: {
      webDev: {
        title: 'Веб-Разработка',
        desc: 'Создание адаптивных, быстрых и SEO-оптимизированных сайтов. Чистый код, приятная и аккуратная верстка.',
      },
      design: {
        title: 'UI/UX Дизайн',
        desc: 'Проектирование уютных, красивых интерфейсов с отличной читаемостью, просторными отступами и идеальной типографикой.',
      },
      bugFixes: {
        title: 'Исправление Багов и Ускорение',
        desc: 'Оптимизация скорости загрузки, исправление ошибок верстки, отладка скриптов и улучшение мобильной версии.',
      },
      serverSide: {
        title: 'Бэкенд и Базы Данных',
        desc: 'Разработка безопасных и быстрых API, баз данных и серверов. Надежная архитектура для долгой работы.',
      },
      appDev: {
        title: 'Приложения для ПК и Смартфонов',
        desc: 'Создание легких приложений под Windows, iOS и Android с нативным интерфейсом и плавной работой.',
      },
      codeProtection: {
        title: 'Защита и Обфускация Кода',
        desc: 'Шифрование исходного кода, защита от взлома и реверс-инжиниринга ваших программных продуктов.',
      },
      siteProtection: {
        title: 'Защита Сайтов',
        desc: 'Настройка защиты от DDoS-атак, безопасных брандмауэров (WAF) и проведение полного аудита безопасности.',
      },
    },
    console: {
      placeholder: 'Введите команду (например: help, projects)...',
      welcome: 'Терминал запущен. Я ИИ Помощник Gu! Спросите меня о Даниле, проектах или просто поболтайте. Введите "help" для просмотра локальных команд.',
      helpText: 'Доступные команды: help, clear, bio, contact, skills, projects, services, reboot',
      notFound: 'Команда не распознана. Введите "help" для получения списка команд.',
      cleared: 'Консоль очищена.',
    },
    buttons: {
      copyEmail: 'Скопировать Email',
      copied: 'Скопировано!',
      email: 'Написать на Email',
      telegram: 'Профиль Telegram',
      vk: 'ВКонтакте',
      donate: 'Поддержать автора',
      reboot: 'Перезапустить сайт',
      themeLight: 'Уютный светлый стиль',
      themeDark: 'Тёмный стиль',
    },
  },
};

export const skillsList = [
  'JavaScript (ES6+)',
  'TypeScript',
  'React.js',
  'Vue.js',
  'Node.js (Express)',
  'Python',
  'HTML5 / CSS3',
  'Tailwind CSS',
  'C# / .NET',
  'C++ / Native Desktop',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS & VPS Deployment',
  'Code Security & Obfuscation',
];

export const projectsList = (lang: 'en' | 'ru'): Project[] => {
  return [];
};

export const servicesList = (lang: 'en' | 'ru'): Service[] => {
  const t = translations[lang].servicesList;
  return [
    {
      id: 'web-dev',
      title: t.webDev.title,
      description: t.webDev.desc,
      iconName: 'Code',
    },
    {
      id: 'design',
      title: t.design.title,
      description: t.design.desc,
      iconName: 'Palette',
    },
    {
      id: 'bug-fixes',
      title: t.bugFixes.title,
      description: t.bugFixes.desc,
      iconName: 'Bug',
    },
    {
      id: 'server-side',
      title: t.serverSide.title,
      description: t.serverSide.desc,
      iconName: 'Server',
    },
    {
      id: 'app-dev',
      title: t.appDev.title,
      description: t.appDev.desc,
      iconName: 'Smartphone',
    },
    {
      id: 'code-protection',
      title: t.codeProtection.title,
      description: t.codeProtection.desc,
      iconName: 'ShieldAlert',
    },
    {
      id: 'site-protection',
      title: t.siteProtection.title,
      description: t.siteProtection.desc,
      iconName: 'ShieldCheck',
    },
  ];
};

export const statsList = (lang: 'en' | 'ru') => {
  const t = translations[lang].stats;
  return [
    { value: '5+', label: t.years },
    { value: '50+', label: t.projects },
    { value: '30+', label: t.clients },
    { value: '67+', label: t.coffee },
  ];
};
