import React, { useState, useEffect, useRef } from 'react';
import { 
  translations, 
  skillsList, 
  projectsList, 
  servicesList, 
  statsList 
} from './data';
import { 
  Code, 
  Palette, 
  Bug, 
  Server, 
  Smartphone, 
  ShieldAlert, 
  ShieldCheck,
  Languages, 
  Check, 
  Copy, 
  ExternalLink, 
  Clock, 
  RefreshCw,
  Send,
  Sparkles,
  ArrowRight,
  MapPin,
  Gamepad2,
  Terminal as TerminalIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Terminal from './components/Terminal';
import InteractiveGraphics from './components/InteractiveGraphics';
import Starfield from './components/Starfield';
import { GamesModal } from './components/GamesModal';

// Helper component to render Lucide Icons dynamically and safely
function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const iconProps = { className: className || "w-5 h-5", strokeWidth: 1.5 };
  switch (name) {
    case 'Code': return <Code {...iconProps} />;
    case 'Palette': return <Palette {...iconProps} />;
    case 'Bug': return <Bug {...iconProps} />;
    case 'Server': return <Server {...iconProps} />;
    case 'Smartphone': return <Smartphone {...iconProps} />;
    case 'ShieldAlert': return <ShieldAlert {...iconProps} />;
    case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
    default: return <Code {...iconProps} />;
  }
}

export default function App() {
  const [lang, setLang] = useState<'en' | 'ru'>('ru'); // Default to RU as requested
  const theme = 'dark'; // Always dark theme as requested
  const [isCopied, setIsCopied] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  
  // Clean, cozy loading screen
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState('Запуск системы...');
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const bootLogsEndRef = useRef<HTMLDivElement>(null);

  // Load configuration on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('bio_lang');
    if (savedLang === 'ru' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  // Soft progress simulation with option to skip
  useEffect(() => {
    if (!isBooting) return;

    const logMessages = lang === 'ru' ? [
      'Загрузка ядра xgurusx.efi...',
      'Подключение системных библиотек... ОК',
      'Настройка уютного визуального интерфейса...',
      'Загрузка портфолио и списка навыков...',
      'Проверка безопасности исходного кода... ОК',
      'Синхронизация с Telegram-каналом @portfolio_nafingexe...',
      'Система готова к работе.',
    ] : [
      'Loading xgurusx.efi kernel...',
      'Linking system frameworks... OK',
      'Configuring cozy visual interface...',
      'Loading portfolio lists & skills...',
      'Securing source-code components... OK',
      'Synchronizing Telegram feed @portfolio_nafingexe...',
      'System fully ready.',
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsBooting(false), 300);
          return 100;
        }

        const nextProgress = prev + 1;

        // Add log entry on checkpoints
        const step = Math.floor(nextProgress / 14);
        if (step > currentLogIndex && currentLogIndex < logMessages.length) {
          setBootLogs((l) => [...l, logMessages[currentLogIndex]]);
          setBootText(logMessages[currentLogIndex]);
          currentLogIndex++;
        }

        return nextProgress;
      });
    }, 27);

    return () => clearInterval(interval);
  }, [isBooting, lang]);

  useEffect(() => {
    bootLogsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bootLogs]);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ru' : 'en';
    setLang(nextLang);
    localStorage.setItem('bio_lang', nextLang);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hsosat45@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReboot = () => {
    setBootLogs([]);
    setBootProgress(0);
    setIsBooting(true);
  };

  // Helper for smooth scrolling
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const t = translations[lang];

  // Filter projects by tag
  const filteredProjects = activeProjectFilter
    ? projectsList(lang).filter(p => p.tags.includes(activeProjectFilter))
    : projectsList(lang);

  // Collect all available tags
  const allTags = Array.from(
    new Set(projectsList('en').flatMap(p => p.tags))
  );

  return (
    <div className={`min-h-screen relative transition-all duration-300 overflow-x-hidden ${
      theme === 'dark' 
        ? 'bg-[#0E0E10] text-[#E4E4E7] selection:bg-white selection:text-neutral-900' 
        : 'bg-[#FAF9F6] text-[#27272A] selection:bg-neutral-900 selection:text-white'
    }`}>
      {/* Optimized Space Starfield Background */}
      <Starfield theme={theme} />
      
      {/* INTUITIVE BOOT LOADING (Fast skip available for rapid browsing) */}
      <AnimatePresence>
        {isBooting && (
          <motion.div 
            key="boot-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6] dark:bg-[#0E0E10] flex flex-col justify-between p-6 select-none font-mono"
          >
            <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-600">
              <span>xgurusx.net // interface</span>
              <span>2026-06-24 UTC</span>
            </div>

            <div className="max-w-xl mx-auto w-full my-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  xgurusx
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  {lang === 'ru' ? 'Веб-разработка & Дизайн' : 'Web Dev & UI/UX'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-500 dark:text-neutral-400">{bootText}</span>
                  <span className="text-neutral-900 dark:text-white font-bold">{bootProgress}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-neutral-900 dark:bg-white transition-all duration-100"
                    style={{ width: `${bootProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Fast clean logs */}
              <div className="h-32 bg-white dark:bg-neutral-900/60 rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-800/60 overflow-y-auto text-[11px] space-y-1.5 text-neutral-500 dark:text-neutral-400 scrollbar-none">
                {bootLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    <span className="text-neutral-400 dark:text-neutral-600 mr-2">✦</span>
                    {log}
                  </div>
                ))}
                <div ref={bootLogsEndRef} />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4">
              <span className="text-neutral-400 dark:text-neutral-600">v1.2 // clean white style</span>
              <button 
                onClick={() => setIsBooting(false)}
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:opacity-90 transition-opacity rounded-lg tracking-wider text-[11px]"
              >
                {lang === 'en' ? 'Skip to Portfolio' : 'Перейти к портфолио'} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTFOLIO CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
        
        {/* Nav Header */}
        <header className={`sticky top-4 z-40 rounded-2xl border px-4 py-3 flex items-center justify-between backdrop-blur-xl transition-all shadow-sm ${
          theme === 'dark' 
            ? 'bg-[#0E0E10]/90 border-neutral-800/80 shadow-black/20' 
            : 'bg-white/90 border-neutral-200/80 shadow-neutral-100/50'
        }`}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 font-mono text-base font-bold select-none tracking-tight group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-0.5 group-hover:scale-105 group-hover:border-emerald-400 transition-all shadow-sm">
              <img src="/favicon.svg" alt="xgurusx logo" className="w-full h-full rounded-[3px]" />
            </div>
            <span>xgurusx</span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase">
            <button 
              onClick={() => scrollToSection('skills')} 
              className="hover:text-neutral-500 transition-colors"
            >
              {t.sections.skills}
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="hover:text-neutral-500 transition-colors"
            >
              {t.sections.projects}
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="hover:text-neutral-500 transition-colors"
            >
              {t.sections.services}
            </button>
            <button 
              onClick={() => scrollToSection('console')} 
              className="hover:text-neutral-500 transition-colors"
            >
              {t.sections.console}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Lang switch */}
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-xl transition-all border font-mono text-xs font-semibold ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
              title={lang === 'en' ? 'RU version' : 'EN version'}
            >
              <div className="flex items-center gap-1">
                <Languages size={13} />
                <span>{lang === 'en' ? 'RU' : 'EN'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* MAIN SPLIT GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 lg:mt-12 items-start">
          
          {/* Left Column (Sticky Sidebar summary - Beautiful personal card) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              theme === 'dark' 
                ? 'bg-neutral-900/40 border-neutral-800' 
                : 'bg-white border-neutral-200/80 shadow-sm shadow-neutral-100/50'
            }`}>
              
              {/* Dynamic Interactive Avatar & Mobile Graphic */}
              <InteractiveGraphics theme={theme} />

              {/* Textual Identity */}
              <div className="text-center mt-6 space-y-2">
                <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  xgurusx
                </h2>
                <div className="font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                  {t.subtitle}
                </div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-200/60 dark:border-neutral-700/60 my-1">
                  <MapPin size={12} className="text-emerald-500" />
                  <span>{lang === 'ru' ? 'Москва, 24 года' : 'Moscow, 24 y.o.'}</span>
                </div>
                <p className={`text-xs leading-relaxed max-w-sm mx-auto pt-1 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {t.bio}
                </p>
              </div>

              {/* Telegram channel link */}
              <div className="mt-6 p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/80 space-y-2 text-center">
                <span className="inline-block text-[10px] tracking-wider font-mono uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-md">
                  {lang === 'ru' ? 'Канал Портфолио' : 'Portfolio Feed'}
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {lang === 'ru' ? 'Регулярные апдейты и исходный код проектов в моем Telegram:' : 'Regular live updates and source code on Telegram:'}
                </p>
                <a 
                  href="https://t.me/portfolio_nafingexe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 dark:text-white hover:underline pt-1"
                >
                  t.me/portfolio_nafingexe <ExternalLink size={12} />
                </a>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-6 text-xs font-mono font-medium">
                <a 
                  href="https://t.me/xgurusx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-100 hover:bg-white hover:text-neutral-900 hover:border-white' 
                      : 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800 hover:border-neutral-800'
                  }`}
                >
                  <span>{t.buttons.telegram}</span>
                </a>
                
                <a 
                  href="https://vk.ru/xgurusx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850' 
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{t.buttons.vk}</span>
                </a>

                <button 
                  onClick={handleCopyEmail}
                  className={`col-span-2 py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800' 
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{isCopied ? t.buttons.copied : t.buttons.copyEmail}</span>
                </button>
              </div>

              {/* Status footer */}
              <div className="mt-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 uppercase">
                  Active status
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  2026 UTC
                </span>
              </div>

            </div>

            {/* Quick Reboot */}
            <button
              onClick={handleReboot}
              className={`w-full py-3 px-4 rounded-2xl border font-mono text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <RefreshCw size={12} />
              {t.buttons.reboot}
            </button>
          </aside>

          {/* Right Column (Flowing light bento sections) */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* 1. PORTFOLIO SECTION (Beautifully expanded with real work details & telegram channel link) */}
            <section id="projects" className="space-y-6">
              
              {/* Main Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800/40 pb-3">
                <h3 className={`text-base font-bold font-mono tracking-wider uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  // {t.sections.projects}
                </h3>

                {/* Instant tag filters for rapid surfing */}
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setActiveProjectFilter(null)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      activeProjectFilter === null
                        ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:border-white'
                        : 'bg-transparent border-neutral-200 text-neutral-500 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'ru' ? 'Все' : 'All'}
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveProjectFilter(tag)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all border ${
                        activeProjectFilter === tag
                          ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:border-white'
                          : 'bg-transparent border-neutral-200 text-neutral-500 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* DEDICATED TELEGRAM CHANNEL CTA BANNER (Clean Neutral Style) */}
              <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-neutral-900/60 border-neutral-800 shadow-xl' 
                  : 'bg-white border-neutral-200/90 shadow-sm'
              }`}>
                <div className="space-y-2.5 max-w-lg z-10">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
                      theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    }`}>
                      <Send size={11} className="-rotate-45 -translate-y-[0.5px] translate-x-[0.5px]" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border tracking-wider ${
                      theme === 'dark' 
                        ? 'bg-neutral-800/80 text-neutral-300 border-neutral-700' 
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}>
                      TELEGRAM CHANNEL
                    </span>
                  </div>
                  <h4 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                    {t.telegramChannel.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {t.telegramChannel.desc}
                  </p>
                </div>

                <a 
                  href="https://t.me/portfolio_nafingexe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-mono text-xs font-bold select-none transition-all duration-200 flex-shrink-0 z-10 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                    theme === 'dark'
                      ? 'bg-white hover:bg-neutral-100 text-neutral-900 shadow-white/5'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-neutral-900/10'
                  }`}
                >
                  <Send size={13} className="-rotate-45" />
                  <span>{t.telegramChannel.button}</span>
                </a>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        key={project.title}
                        className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                          theme === 'dark' 
                            ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-600' 
                            : 'bg-white border-neutral-200/70 hover:border-neutral-400 shadow-sm'
                        }`}
                      >
                        <div className="space-y-2">
                          <h4 className={`text-sm font-bold font-mono tracking-tight leading-relaxed ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-900'
                          }`}>
                            {project.title}
                          </h4>
                          <p className={`text-xs leading-relaxed ${
                            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                          }`}>
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span 
                              key={tag}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                                theme === 'dark' 
                                  ? 'bg-neutral-800 text-neutral-400' 
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`col-span-1 md:col-span-2 p-8 rounded-2xl border border-dashed text-center space-y-3 ${
                      theme === 'dark' 
                        ? 'border-neutral-800 text-neutral-400 bg-neutral-900/10' 
                        : 'border-neutral-300 text-neutral-600 bg-white/40'
                    }`}>
                      <p className="text-xs leading-relaxed font-mono">
                        {lang === 'ru' 
                          ? 'Все выполненные проекты, реальные кейсы и примеры кода публикуются в моем официальном Telegram-канале:' 
                          : 'All completed projects, real client cases, and code examples are posted in my official Telegram channel:'}
                      </p>
                      <a 
                        href="https://t.me/portfolio_nafingexe" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 dark:text-white hover:underline"
                      >
                        t.me/portfolio_nafingexe <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* 2. STATS */}
            <section id="stats" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statsList(lang).map((stat, i) => (
                <div 
                  key={i} 
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    theme === 'dark' 
                      ? 'bg-neutral-900/40 border-neutral-800' 
                      : 'bg-white border-neutral-200/60 shadow-sm'
                  }`}
                >
                  <div className={`text-2xl font-bold font-mono tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </section>

            {/* 3. TECHNICAL SKILLS */}
            <section id="skills" className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/40 pb-3">
                <h3 className={`text-base font-bold font-mono tracking-wider uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  // {t.sections.skills}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  {skillsList.length} tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      const cleanedSkill = skill.split(' ')[0].split('/')[0].toLowerCase();
                      const hasTag = allTags.some(t => t.toLowerCase() === cleanedSkill);
                      if (hasTag) {
                        setActiveProjectFilter(cleanedSkill === activeProjectFilter ? null : cleanedSkill);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-500'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </section>

            {/* 4. SERVICES Bento Grid */}
            <section id="services" className="space-y-6">
              <div className="border-b border-neutral-200/60 dark:border-neutral-800/40 pb-3">
                <h3 className={`text-base font-bold font-mono tracking-wider uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  // {t.sections.services}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicesList(lang).map((srv) => (
                  <div 
                    key={srv.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                      theme === 'dark' 
                        ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-600' 
                        : 'bg-white border-neutral-200/60 hover:border-neutral-400 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className={`p-2 rounded-xl border w-fit ${
                        theme === 'dark' 
                          ? 'bg-neutral-900 border-neutral-800 text-white' 
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                      }`}>
                        <ServiceIcon name={srv.iconName} className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {srv.title}
                        </h4>
                        <p className={`text-[11px] leading-relaxed ${
                          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. INTERACTIVE TERMINAL */}
            <section id="console" className="space-y-4">
              <div className="border-b border-neutral-200/60 dark:border-neutral-800/40 pb-3">
                <h3 className={`text-base font-bold font-mono tracking-wider uppercase ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  // {t.sections.console}
                </h3>
              </div>

              <Terminal 
                lang={lang} 
                onReboot={handleReboot}
                theme={theme}
                onExecuteCommand={(cmd) => {
                  const matchedTag = allTags.find(t => t.toLowerCase() === cmd);
                  if (matchedTag) {
                    setActiveProjectFilter(matchedTag);
                  }
                }}
              />
            </section>

            {/* 6. OTHER / GAMES BUTTON */}
            <section className="pt-8 pb-4 flex flex-col items-center justify-center">
              <button
                onClick={() => setIsGamesOpen(true)}
                className="relative group overflow-hidden px-8 py-4 bg-neutral-950/90 hover:bg-neutral-900 text-white font-mono rounded-2xl border border-neutral-800 hover:border-emerald-500/60 shadow-2xl shadow-emerald-950/20 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                {/* Subtle top ambient glow */}
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent group-hover:via-emerald-400 transition-all duration-500" />
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/30 text-emerald-400 transition-colors shadow-inner">
                    <Gamepad2 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wider uppercase text-neutral-100 group-hover:text-emerald-400 transition-colors">
                        {lang === 'ru' ? 'Другое' : 'Other'}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-widest uppercase">
                        4 {lang === 'ru' ? 'Игры' : 'Games'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {lang === 'ru' ? 'Мини-игры и аркады' : 'Arcade Mini-Games'}
                    </span>
                  </div>
                </div>
              </button>
            </section>

          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-dashed border-neutral-200 dark:border-neutral-850 text-center text-xs font-mono text-neutral-400">
          <p>© 2026 xgurusx. {lang === 'ru' ? 'Простой, чистый стиль для комфортного чтения.' : 'Simple, cozy white style designed for relaxed reading.'}</p>
        </footer>
      </div>

      {/* Mini-Games Modal */}
      <GamesModal 
        isOpen={isGamesOpen} 
        onClose={() => setIsGamesOpen(false)} 
        lang={lang} 
        theme={theme} 
      />

    </div>
  );
}
