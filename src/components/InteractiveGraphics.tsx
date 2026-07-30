import React, { useState, useEffect } from 'react';
import avatarImg from '../assets/avatar.jpg';

interface GraphicProps {
  theme: 'light' | 'dark';
}

export default function InteractiveGraphics({ theme }: GraphicProps) {
  const [time, setTime] = useState('');
  const [cpu, setCpu] = useState(12);
  const [imgSrc, setImgSrc] = useState<string>(avatarImg);
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (imgSrc !== '/avatar.jpg') {
      setImgSrc('/avatar.jpg');
    } else {
      setImgError(true);
    }
  };

  useEffect(() => {
    // Live clock for smartphone preview
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulated live CPU spikes for technical minimalism
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 25) + 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-6 items-center justify-center py-4 select-none w-full">
      {/* Dynamic Avatar */}
      <div className="relative">
        {/* Soft abstract floating grid background */}
        <div className={`absolute -inset-1 rounded-full blur-xl opacity-20 ${
          theme === 'dark' ? 'bg-white' : 'bg-black'
        }`}></div>
        
        {/* Main circular frame */}
        <div className={`relative w-36 h-36 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-xl ${
          theme === 'dark' 
            ? 'bg-neutral-900 border-neutral-700 shadow-black/80' 
            : 'bg-white border-neutral-300 shadow-neutral-200'
        }`}>
          {/* User Avatar Image */}
          {!imgError ? (
            <img 
              src={imgSrc} 
              alt="xgurusx avatar" 
              referrerPolicy="no-referrer"
              onError={handleImgError}
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center font-mono">
              <span className="text-2xl font-black text-emerald-400 tracking-wider">XG</span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">DEV</span>
            </div>
          )}

          {/* Subtle spinning technical ring overlay */}
          <svg className="absolute inset-0 w-full h-full animate-spin [animation-duration:30s] pointer-events-none opacity-40 text-white z-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" fill="none" />
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" strokeDasharray="12 6" fill="none" />
          </svg>
        </div>
      </div>

      {/* Modern Wireframe Smartphone Graphic */}
      <div className="relative">
        <div className={`absolute -inset-2 rounded-3xl blur-lg opacity-15 ${
          theme === 'dark' ? 'bg-white' : 'bg-black'
        }`}></div>
        
        {/* Phone outer body */}
        <div className={`relative w-[130px] h-[240px] rounded-[24px] border-2 p-2.5 flex flex-col justify-between ${
          theme === 'dark' 
            ? 'bg-neutral-950 border-neutral-800' 
            : 'bg-white border-neutral-200'
        }`}>
          {/* Speaker grill */}
          <div className={`w-10 h-1 rounded-full mx-auto ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}></div>

          {/* Smartphone Screen Inner */}
          <div className={`flex-1 rounded-[14px] my-2.5 p-2 font-mono flex flex-col justify-between border ${
            theme === 'dark' 
              ? 'bg-neutral-900 border-neutral-800 text-neutral-300' 
              : 'bg-neutral-50 border-neutral-100 text-neutral-700'
          }`}>
            {/* Top row */}
            <div className="flex justify-between items-center text-[7px] text-neutral-400 select-none">
              <span>LTE</span>
              <span className="animate-pulse">{time || '09:22'}</span>
              <span>100%</span>
            </div>

            {/* Middle logo / grid */}
            <div className="my-auto flex flex-col items-center justify-center py-2 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                {/* Visual coordinate system crosshair */}
                <div className="w-full h-[1px] bg-current"></div>
                <div className="h-full w-[1px] bg-current absolute"></div>
              </div>
              <div className={`text-xl font-black tracking-widest ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                XG
              </div>
              <div className="text-[6px] tracking-widest text-neutral-500 uppercase mt-1">
                SYSTEMS OK
              </div>
            </div>

            {/* Bottom telemetry panel */}
            <div className="space-y-0.5 border-t border-neutral-800 dark:border-neutral-800 pt-1 text-[6px] text-neutral-500">
              <div className="flex justify-between">
                <span>CPU TICK:</span>
                <span className="text-emerald-500">{cpu}%</span>
              </div>
              <div className="flex justify-between">
                <span>MEM STACK:</span>
                <span>4.1GB</span>
              </div>
              <div className="flex justify-between">
                <span>LOC CODE:</span>
                <span>0x7FFF</span>
              </div>
            </div>
          </div>

          {/* Home Bar indicator */}
          <div className={`w-12 h-1 rounded-full mx-auto ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}></div>
        </div>
      </div>
    </div>
  );
}

