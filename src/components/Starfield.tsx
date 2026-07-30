import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
  theme: 'light' | 'dark';
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

export default function Starfield({ theme }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const isDark = theme === 'dark';

    const darkColors = [
      '#ffffff',
      '#ffffff',
      '#e0f2fe', // soft blue star
      '#fef08a', // soft warm gold star
      '#f5d0fe', // soft violet star
    ];

    const lightColors = [
      '#cbd5e1', // slate-300
      '#94a3b8', // slate-400
    ];

    const starColors = isDark ? darkColors : lightColors;

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      // Limit DPR to max 1.5 to keep GPU render costs extremely low
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Strict particle density limit for ultra fast performance
      const count = Math.floor((width * height) / (isDark ? 15000 : 35000));
      const starCount = Math.min(Math.max(count, 25), isDark ? 85 : 30);

      stars = [];
      for (let i = 0; i < starCount; i++) {
        const baseAlpha = Math.random() * (isDark ? 0.6 : 0.2) + (isDark ? 0.2 : 0.08);
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.4,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      // Frame throttle to ~30fps for minimal power & CPU footprint
      if (time - lastTime < 30) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric glow in dark mode
      if (isDark) {
        const grad = ctx.createRadialGradient(width * 0.5, height * 0.2, 0, width * 0.5, height * 0.2, width * 0.7);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.02)');
        grad.addColorStop(0.6, 'rgba(139, 92, 246, 0.01)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.alpha += star.twinkleSpeed;
          if (star.alpha > star.baseAlpha + 0.25 || star.alpha > 0.85) {
            star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
          } else if (star.alpha < star.baseAlpha - 0.25 || star.alpha < 0.1) {
            star.twinkleSpeed = Math.abs(star.twinkleSpeed);
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, star.alpha));
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    initStars();

    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initStars();
        if (prefersReducedMotion) {
          render(performance.now());
        }
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      aria-hidden="true"
    />
  );
}
