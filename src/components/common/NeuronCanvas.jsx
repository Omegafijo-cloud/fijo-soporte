// components/common/NeuronCanvas.jsx
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { defaultThemeSettings } from '../../context/AppStateContext'; // Import default settings

const NeuronCanvas = React.memo(({ themeSettings }) => {
    const canvasRef = useRef(null);
    const particlesArray = useRef([]);
    const animationFrameId = useRef(null);

    // Ensure colors are always valid, falling back to defaults if not provided by themeSettings
    const globalNeuronColorsRGB = [
        themeSettings['--neuron-color-1-rgb'] || defaultThemeSettings['--neuron-color-1-rgb'],
        themeSettings['--neuron-color-2-rgb'] || defaultThemeSettings['--neuron-color-2-rgb'],
        themeSettings['--neuron-color-3-rgb'] || defaultThemeSettings['--neuron-color-3-rgb']
    ];
    const globalNeuronConnectionRGB = themeSettings['--neuron-connection-rgb'] || defaultThemeSettings['--neuron-connection-rgb'];

    const initParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particlesArray.current = [];
        const numberOfParticles = (canvas.height * canvas.width) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2.5 + 1.5;
            const x = Math.random() * (canvas.width - size * 2) + size;
            const y = Math.random() * (canvas.height - size * 2) + size;
            const speedX = (Math.random() * 0.8) - 0.4;
            const speedY = (Math.random() * 0.8) - 0.4;
            const randomRgbString = globalNeuronColorsRGB[Math.floor(Math.random() * globalNeuronColorsRGB.length)];
            const color = `rgba(${randomRgbString}, 0.7)`;
            particlesArray.current.push({ x, y, size, color, speedX, speedY });
        }
    }, [globalNeuronColorsRGB]);

    const animateParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.current.forEach(particle => {
            if (particle.x + particle.size > canvas.width || particle.x - particle.size < 0) particle.speedX = -particle.speedX;
            if (particle.y + particle.size > canvas.height || particle.y - particle.size < 0) particle.speedY = -particle.speedY;
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        let opacityValue = 1;
        const connectionRgb = globalNeuronConnectionRGB;
        for (let a = 0; a < particlesArray.current.length; a++) {
            for (let b = a + 1; b < particlesArray.current.length; b++) {
                let distance = Math.sqrt(((particlesArray.current[a].x - particlesArray.current[b].x) ** 2) + ((particlesArray.current[a].y - particlesArray.current[b].y) ** 2));
                if (distance < (canvas.width / 100 * 12)) {
                    opacityValue = 1 - (distance / (canvas.width / 100 * 12));
                    ctx.strokeStyle = `rgba(${connectionRgb}, ${opacityValue * 0.4})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray.current[a].x, particlesArray.current[a].y);
                    ctx.lineTo(particlesArray.current[b].x, particlesArray.current[b].y);
                    ctx.stroke();
                }
            }
        }
        animationFrameId.current = requestAnimationFrame(animateParticles);
    }, [globalNeuronConnectionRGB]);

    useEffect(() => {
        initParticles();
        animationFrameId.current = requestAnimationFrame(animateParticles);

        const handleResize = () => initParticles();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [initParticles, animateParticles, themeSettings]); // Re-run initParticles if themeSettings change

    return <canvas ref={canvasRef} id="neuronCanvas" className="fixed top-0 left-0 w-full h-full -z-10"></canvas>;
});

export default NeuronCanvas;
