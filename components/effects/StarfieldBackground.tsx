"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
}

const STAR_COUNT = 220;

function createStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.3 + 0.3,
    baseAlpha: Math.random() * 0.5 + 0.3,
    twinkleSpeed: Math.random() * 0.015 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
    driftX: (Math.random() - 0.5) * 0.03,
    driftY: (Math.random() - 0.5) * 0.03,
  }));
}

/**
 * Persistent, dependency-free Canvas2D starfield mounted once in the root layout.
 * Deliberately not Three.js/WebGL -- this background runs on every page, so it stays
 * cheap (a single 2D draw call per frame for a few hundred points), while the heavier
 * 3D scene is reserved for the homepage hero only.
 */
export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = createStars(width, height);
    let frameId: number;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed;
        star.x = (star.x + star.driftX + width) % width;
        star.y = (star.y + star.driftY + height) % height;
        const alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(238, 241, 255, ${alpha.toFixed(3)})`;
        ctx!.fill();
      }
      frameId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      draw();
    } else {
      frameId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space-950">
      <div
        className="absolute -left-1/4 -top-1/4 h-[60vmax] w-[60vmax] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-violet-accent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[55vmax] w-[55vmax] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-blue-accent) 0%, transparent 70%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
