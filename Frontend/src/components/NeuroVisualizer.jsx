import { useEffect, useRef } from 'react';
import '../styles/NeuroVisualizer.css';

const NeuroVisualizer = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    // let particles = [];
    // const maxParticles = 100;
    
    // Set canvas dimensions to match its parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Regenerate particles on resize
    //   initParticles();
    };
    
    // Initialize particles
    // const initParticles = () => {
    //   particles = [];
    //   for (let i = 0; i < maxParticles; i++) {
    //     particles.push({
    //       x: Math.random() * canvas.width,
    //       y: Math.random() * canvas.height,
    //       radius: Math.random() * 3 + 1,
    //       color: getRandomColor(),
    //       speed: Math.random() * 0.5 + 0.1,
    //       directionX: (Math.random() - 0.5) * 2,
    //       directionY: (Math.random() - 0.5) * 2,
    //       connections: []
    //     });
    //   }
    // };
    
    // Get a random color from our theme
    // const getRandomColor = () => {
    //   const colors = [
    //     'rgba(0, 188, 212, 0.7)',
    //     'rgba(124, 77, 255, 0.7)',
    //     'rgba(255, 64, 129, 0.7)'
    //   ];
    //   return colors[Math.floor(Math.random() * colors.length)];
    // };
    
    // Calculate connections between particles
    // const calculateConnections = () => {
    //   const connectionDistance = 100;
      
    //   // Clear previous connections
    // //   particles.forEach(particle => {
    // //     particle.connections = [];
    // //   });
      
    //   // Calculate new connections
    // //   for (let i = 0; i < particles.length; i++) {
    // //     for (let j = i + 1; j < particles.length; j++) {
    // //       const dx = particles[i].x - particles[j].x;
    // //       const dy = particles[i].y - particles[j].y;
    // //       const distance = Math.sqrt(dx * dx + dy * dy);
          
    // //       if (distance < connectionDistance) {
    // //         particles[i].connections.push({
    // //           particle: j,
    // //           opacity: 1 - (distance / connectionDistance)
    // //         });
    // //       }
    // //     }
    // //   }
    // };
    
    // Animation loop
    // const animate = () => {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      
    //   // Update particle positions
    //   particles.forEach((particle) => {
    //     // Move particle
    //     particle.x += particle.directionX * particle.speed;
    //     particle.y += particle.directionY * particle.speed;
        
    //     // Bounce off edges
    //     if (particle.x < 0 || particle.x > canvas.width) {
    //       particle.directionX *= -1;
    //     }
        
    //     if (particle.y < 0 || particle.y > canvas.height) {
    //       particle.directionY *= -1;
    //     }
        
    //     // Draw particle
    //     ctx.beginPath();
    //     ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    //     ctx.fillStyle = particle.color;
    //     ctx.fill();
        
    //     // Draw connections
    //     particle.connections.forEach(connection => {
    //       const targetParticle = particles[connection.particle];
    //       ctx.beginPath();
    //       ctx.moveTo(particle.x, particle.y);
    //       ctx.lineTo(targetParticle.x, targetParticle.y);
    //       ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * 0.2})`;
    //       ctx.lineWidth = connection.opacity;
    //       ctx.stroke();
    //     });
    //   });
      
    //   // Recalculate connections occasionally
    //   if (Math.random() < 0.05) {
    //     calculateConnections();
    //   }
      
    //   animationFrameId = requestAnimationFrame(animate);
    // };
    
    // Initialize
    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas);
    // calculateConnections();
    // animate();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="neuro-visualizer"></canvas>;
};

export default NeuroVisualizer;