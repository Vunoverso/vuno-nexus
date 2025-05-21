import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const lines = Array.from({ length: 80 }, () => createLine());

    function createLine() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 100 + 100,
        speed: Math.random() * 0.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
      };
    }

    let animationId: number;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1;

      for (let line of lines) {
        ctx.globalAlpha = line.alpha;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
        line.y += line.speed;
        if (line.y > height) {
          line.y = -line.length;
          line.x = Math.random() * width;
        }
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'none', opacity: 0.3 }}
    />
  );
}