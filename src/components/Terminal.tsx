import React, { useState, useRef, useEffect } from 'react';
import { translations, projectsList, skillsList, servicesList } from '../data';
import { Terminal as TerminalIcon, CornerDownLeft, Play, RefreshCw, Sparkles, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalProps {
  lang: 'en' | 'ru';
  onExecuteCommand?: (cmd: string) => void;
  onReboot: () => void;
  theme: 'light' | 'dark';
}

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  timestamp: string;
}

export default function Terminal({ lang, onExecuteCommand, onReboot, theme }: TerminalProps) {
  const t = translations[lang];
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogLine[]>([
    {
      text: t.console.welcome,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isPending, setIsPending] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed || isPending) return;

    const cmd = trimmed.toLowerCase();
    const timestamp = new Date().toLocaleTimeString();
    
    // Add command to logs
    const newLogs = [...logs, { text: `> ${trimmed}`, type: 'input' as const, timestamp }];
    setLogs(newLogs);
    setHistory([trimmed, ...history.filter(h => h !== trimmed)]);
    setHistoryIndex(-1);
    setInput('');

    let outputText = '';
    let outputType: 'output' | 'success' | 'error' = 'output';

    switch (cmd) {
      case 'help':
        outputText = t.console.helpText;
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'bio':
        outputText = t.bio;
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'contact':
        outputText = lang === 'en' 
          ? 'Email: hsosat45@gmail.com | Telegram: @xgurusx | VK: vk.ru/xgurusx'
          : 'Email: hsosat45@gmail.com | Telegram: @xgurusx | VK: vk.ru/xgurusx';
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'skills':
        outputText = `${lang === 'en' ? 'My skills:' : 'Мои навыки:'} ${skillsList.join(', ')}`;
        outputType = 'success';
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'projects':
        outputText = projectsList(lang)
          .map(p => `${p.title}: ${p.description}`)
          .join('\n\n');
        outputType = 'success';
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'services':
        outputText = servicesList(lang)
          .map(s => `[${s.title}] - ${s.description}`)
          .join('\n\n');
        outputType = 'success';
        setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        break;
      case 'reboot':
        onReboot();
        setChatHistory([]);
        setLogs([
          {
            text: t.console.welcome,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        return;
      default:
        // Try searching tags first as a quick local query. If not matched, query the AI!
        const matchingProjects = projectsList(lang).filter(p => 
          p.tags.some(tag => tag.toLowerCase().includes(cmd)) ||
          p.title.toLowerCase().includes(cmd) ||
          p.description.toLowerCase().includes(cmd)
        );

        if (matchingProjects.length > 0) {
          outputText = (lang === 'en' ? 'Found matching projects:\n\n' : 'Найденные проекты:\n\n') +
            matchingProjects.map(p => `${p.title} (${p.tags.join(', ')}):\n${p.description}`).join('\n\n');
          outputType = 'success';
          setLogs([...newLogs, { text: outputText, type: outputType, timestamp }]);
        } else {
          // Send to Real Gemini AI
          setIsPending(true);
          const loadingText = lang === 'ru' ? 'Помощник Gu печатает...' : 'Gu Assistant is typing...';
          setLogs([...newLogs, { text: loadingText, type: 'system', timestamp }]);

          try {
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: trimmed, history: chatHistory }),
            });
            const data = await res.json();
            const reply = data.text || (lang === 'ru' ? "Извините, не удалось получить ответ." : "Sorry, failed to get a response.");
            
            // Append the real AI reply, replacing the loading message
            setLogs([...newLogs, { text: `Gu: ${reply}`, type: 'output', timestamp }]);
            setChatHistory(prev => [...prev, { role: 'user', text: trimmed }, { role: 'assistant', text: reply }]);
          } catch (err) {
            setLogs([...newLogs, { text: lang === 'ru' ? 'Ошибка связи с Помощником Gu.' : 'Error communicating with Gu Assistant.', type: 'error', timestamp }]);
          } finally {
            setIsPending(false);
          }
        }
        break;
    }
    
    if (onExecuteCommand) {
      onExecuteCommand(cmd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const quickCommands = ['help', 'bio', 'skills', 'projects', 'services', 'contact', 'clear'];

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 font-mono text-sm overflow-hidden flex flex-col h-[400px] shadow-sm ${
        theme === 'dark' 
          ? 'bg-neutral-950 border-neutral-800 text-neutral-300' 
          : 'bg-white border-neutral-200 text-neutral-700'
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Console Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between select-none ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <div className="flex items-center gap-2">
          <TerminalSquare size={16} className={theme === 'dark' ? 'text-white' : 'text-neutral-900'} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            xgurusx@terminal: ~
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
        </div>
      </div>

      {/* Log Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-neutral-800">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`whitespace-pre-wrap leading-relaxed ${
                log.type === 'input' 
                  ? 'text-neutral-900 dark:text-white font-semibold' 
                  : log.type === 'error'
                  ? 'text-red-500 font-medium'
                  : log.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : log.type === 'system'
                  ? 'text-neutral-400 dark:text-neutral-500 italic border-l border-neutral-700 pl-2 py-0.5'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={terminalEndRef} />
      </div>

      {/* Quick click suggestions */}
      <div className={`px-4 py-2 border-t flex flex-wrap gap-1.5 items-center ${
        theme === 'dark' ? 'bg-neutral-950 border-neutral-900' : 'bg-neutral-50 border-neutral-100'
      }`}>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 mr-1 select-none">
          {lang === 'en' ? 'Quick:' : 'Клики:'}
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={(e) => {
              e.stopPropagation();
              handleCommand(cmd);
            }}
            className={`text-xs px-2.5 py-1 rounded-md transition-all font-mono tracking-tight select-none border ${
              theme === 'dark' 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white' 
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className={`p-4 border-t flex items-center gap-2 ${
        theme === 'dark' ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'
      }`}>
        <span className="text-emerald-500 font-bold select-none animate-pulse">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-neutral-100 caret-emerald-500 focus:ring-0 p-0 font-mono"
          placeholder={t.console.placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button
          onClick={() => handleCommand(input)}
          className={`p-1.5 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' 
              : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
          }`}
          title="Run command"
        >
          <CornerDownLeft size={16} />
        </button>
      </div>
    </div>
  );
}
