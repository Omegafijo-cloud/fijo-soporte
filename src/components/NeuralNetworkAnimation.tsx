'use client';

import React, { useRef, useEffect } from 'react';

interface NeuralNetworkAnimationProps {
  width?: number;
  height?: number;
}

const NeuralNetworkAnimation: React.FC<NeuralNetworkAnimationProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    let animationFrameId: number;
    let neurons: Neuron[] = [];
    
    const resizeCanvas = () => {
        canvas.width = width || parent?.clientWidth || window.innerWidth;
        canvas.height = height || parent?.clientHeight || window.innerHeight;
        neurons = [];
        initNeurons();
    }

    class Neuron {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = Math.random() * 0.5 - 0.25;
        this.vy = Math.random() * 0.5 - 0.25;
        this.color = color;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
          this.vx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.vy *= -1;
        }
      }
    }
    
    const neuronColors = [
      'rgba(106, 27, 154, 0.7)', // Morado
      'rgba(0, 188, 212, 0.7)',  // Turquesa
      'rgba(26, 35, 126, 0.7)'   // Azul Oscuro
    ];
    const connectionColor = 'rgba(106, 27, 154, 0.2)';
    const maxDistance = 100;
    
    function initNeurons() {
      const neuronCount = Math.floor((canvas.width * canvas.height) / (width ? 10000 : 15000));
      for (let i = 0; i < neuronCount; i++) {
        const radius = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = neuronColors[Math.floor(Math.random() * neuronColors.length)];
        neurons.push(new Neuron(x, y, radius, color));
      }
    }
    
    function connectNeurons() {
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx!.beginPath();
            ctx!.strokeStyle = connectionColor;
            ctx!.lineWidth = 1 - distance / maxDistance;
            ctx!.moveTo(neurons[i].x, neurons[i].y);
            ctx!.lineTo(neurons[j].x, neurons[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();
      });
      connectNeurons();
      animationFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ display: 'block', background: 'transparent' }} />;
};

export default NeuralNetworkAnimation;
