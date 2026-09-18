import React, { useEffect, useRef } from 'react';

export const WireframeSphere = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let angleX = 0.35;
    let angleY = 0;
    const angleZ = -0.25;

    // High DPI scaling
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (rect.width || 480) * dpr;
      canvas.height = (rect.height || 480) * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Generate sphere mesh points
    const radius = 185;
    const latBands = 22;
    const lonBands = 30;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 480;
      const height = rect.height || 480;
      const cx = width * 0.54;
      const cy = height * 0.5;

      ctx.clearRect(0, 0, width, height);

      // Slow organic rotation
      angleY += 0.0035;

      // Rotation transforms
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const project = (x, y, z) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        let y1 = y;

        // Rotate X
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = z1 * cosX + y1 * sinX;
        let x2 = x1;

        // Rotate Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = y2 * cosZ + x2 * sinZ;
        let z3 = z2;

        const fov = 440;
        const scale = fov / (fov + z3 + 120);
        return {
          px: cx + x3 * scale,
          py: cy + y3 * scale,
          z: z3,
          scale
        };
      };

      // Draw latitude rings (parallels)
      for (let lat = 1; lat < latBands; lat++) {
        const phi = (lat / latBands) * Math.PI - Math.PI / 2;
        const ringRadius = radius * Math.cos(phi);
        const y = radius * Math.sin(phi);

        ctx.beginPath();
        let first = true;
        let avgZ = 0;

        for (let lon = 0; lon <= lonBands; lon++) {
          const theta = (lon / lonBands) * Math.PI * 2;
          const x = ringRadius * Math.cos(theta);
          const z = ringRadius * Math.sin(theta);
          const p = project(x, y, z);
          avgZ += p.z;

          if (first) {
            ctx.moveTo(p.px, p.py);
            first = false;
          } else {
            ctx.lineTo(p.px, p.py);
          }
        }

        avgZ /= lonBands;
        const depthAlpha = Math.max(0.12, Math.min(0.7, (avgZ + radius) / (2 * radius)));

        ctx.strokeStyle = `rgba(14, 165, 233, ${depthAlpha * 0.75})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw longitude rings (meridians)
      for (let lon = 0; lon < lonBands; lon++) {
        const theta = (lon / lonBands) * Math.PI * 2;

        ctx.beginPath();
        let first = true;
        let avgZ = 0;

        for (let lat = 0; lat <= latBands; lat++) {
          const phi = (lat / latBands) * Math.PI - Math.PI / 2;
          const ringRadius = radius * Math.cos(phi);
          const x = ringRadius * Math.cos(theta);
          const y = radius * Math.sin(phi);
          const z = ringRadius * Math.sin(theta);
          const p = project(x, y, z);
          avgZ += p.z;

          if (first) {
            ctx.moveTo(p.px, p.py);
            first = false;
          } else {
            ctx.lineTo(p.px, p.py);
          }
        }

        avgZ /= latBands;
        const depthAlpha = Math.max(0.1, Math.min(0.75, (avgZ + radius) / (2 * radius)));

        ctx.strokeStyle = `rgba(37, 99, 235, ${depthAlpha * 0.7})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // Draw glowing intersection points (nodes)
      for (let lat = 1; lat < latBands; lat += 1) {
        const phi = (lat / latBands) * Math.PI - Math.PI / 2;
        const ringRadius = radius * Math.cos(phi);
        const y = radius * Math.sin(phi);

        for (let lon = 0; lon < lonBands; lon += 1) {
          const theta = (lon / lonBands) * Math.PI * 2;
          const x = ringRadius * Math.cos(theta);
          const z = ringRadius * Math.sin(theta);
          const p = project(x, y, z);

          // Only render front-facing nodes more brightly
          if (p.z > -radius * 0.4) {
            const alpha = Math.max(0.2, (p.z + radius) / (2 * radius));
            const pointSize = p.z > 40 ? 1.6 : 1.1;

            ctx.fillStyle = `rgba(125, 211, 252, ${alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(p.px, p.py, pointSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default WireframeSphere;
