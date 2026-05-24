import { useEffect, useRef } from "react";

export default function ParticlesBackgroundIsland() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isAnimating = false;

    if (prefersReducedMotion.matches) {
      return undefined;
    }

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const particleCount = window.innerWidth <= 700 ? 35 : 60;

      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.7,
        vx: (Math.random() * 0.3 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.3 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
      }));
    };

    const render = () => {
      if (!isAnimating) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(51, 51, 51, ${particle.alpha})`;
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particlesRef.current.length; nextIndex += 1) {
          const nextParticle = particlesRef.current[nextIndex];
          const distance = Math.hypot(particle.x - nextParticle.x, particle.y - nextParticle.y);

          if (distance < 140) {
            const alpha = (1 - distance / 140) * 0.5;
            context.strokeStyle = `rgba(3, 3, 3, ${alpha})`;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(nextParticle.x, nextParticle.y);
            context.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    const start = () => {
      if (isAnimating || document.hidden) return;
      isAnimating = true;
      animationRef.current = requestAnimationFrame(render);
    };

    const stop = () => {
      isAnimating = false;
      cancelAnimationFrame(animationRef.current);
    };

    const syncAnimation = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncAnimation);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas particles-canvas" style={{ backgroundColor: "#fff" }} aria-hidden="true" />;
}
