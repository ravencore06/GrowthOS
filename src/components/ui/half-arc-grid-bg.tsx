"use client";

import { useRef, useEffect, useState } from "react";

export function HalfArcGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = width / 2;
    const centerY = height * 1.8;
    const radius = Math.max(400, Math.min(width, height) * 1.5);

    // Clear with deep black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Draw stars across entire background
    const starCount = 400;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.2 + 0.3;
      const opacity = Math.random() * 0.7 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // MASSIVE purple glow from top center (neon dusk effect)
    const duskGradient = ctx.createRadialGradient(
      centerX,
      height * -0.1,
      0,
      centerX,
      height * -0.1,
      height * 1.0
    );
    duskGradient.addColorStop(0, "rgba(139, 92, 246, 0.9)");
    duskGradient.addColorStop(0.05, "rgba(124, 58, 237, 0.8)");
    duskGradient.addColorStop(0.1, "rgba(109, 40, 217, 0.65)");
    duskGradient.addColorStop(0.2, "rgba(88, 28, 135, 0.5)");
    duskGradient.addColorStop(0.3, "rgba(67, 20, 100, 0.3)");
    duskGradient.addColorStop(0.45, "rgba(50, 15, 75, 0.15)");
    duskGradient.addColorStop(0.6, "rgba(35, 10, 55, 0.05)");
    duskGradient.addColorStop(0.8, "rgba(20, 5, 35, 0.01)");
    duskGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = duskGradient;
    ctx.fillRect(0, 0, width, height);

    // Secondary warm purple glow layer
    const warmGlowGradient = ctx.createRadialGradient(
      centerX,
      height * 0.05,
      0,
      centerX,
      height * 0.05,
      height * 0.7
    );
    warmGlowGradient.addColorStop(0, "rgba(168, 85, 247, 0.5)");
    warmGlowGradient.addColorStop(0.15, "rgba(139, 92, 246, 0.35)");
    warmGlowGradient.addColorStop(0.3, "rgba(109, 40, 217, 0.15)");
    warmGlowGradient.addColorStop(0.5, "rgba(88, 28, 135, 0.05)");
    warmGlowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = warmGlowGradient;
    ctx.fillRect(0, 0, width, height);

    // Blue tint at edges
    const blueEdgeGradient = ctx.createRadialGradient(
      centerX,
      height * 0.0,
      height * 0.15,
      centerX,
      height * 0.0,
      height * 0.8
    );
    blueEdgeGradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
    blueEdgeGradient.addColorStop(0.25, "rgba(59, 130, 246, 0.1)");
    blueEdgeGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.03)");
    blueEdgeGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = blueEdgeGradient;
    ctx.fillRect(0, 0, width, height);

    // === ARC GLOWING EFFECTS ===

    // Layer 1: Outer massive glow (atmosphere)
    const outerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius - 150,
      centerX,
      centerY,
      radius + 200
    );
    outerGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
    outerGlow.addColorStop(0.6, "rgba(59, 130, 246, 0.1)");
    outerGlow.addColorStop(0.72, "rgba(139, 92, 246, 0.25)");
    outerGlow.addColorStop(0.8, "rgba(168, 85, 247, 0.4)");
    outerGlow.addColorStop(0.86, "rgba(59, 130, 246, 0.6)");
    outerGlow.addColorStop(0.9, "rgba(139, 92, 246, 0.5)");
    outerGlow.addColorStop(0.94, "rgba(59, 130, 246, 0.3)");
    outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.lineWidth = 350;
    ctx.strokeStyle = outerGlow;
    ctx.stroke();

    // Layer 2: Mid glow
    const midGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius - 50,
      centerX,
      centerY,
      radius + 100
    );
    midGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
    midGlow.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
    midGlow.addColorStop(0.7, "rgba(168, 85, 247, 0.4)");
    midGlow.addColorStop(0.85, "rgba(59, 130, 246, 0.7)");
    midGlow.addColorStop(0.92, "rgba(168, 85, 247, 0.6)");
    midGlow.addColorStop(0.96, "rgba(59, 130, 246, 0.3)");
    midGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.lineWidth = 150;
    ctx.strokeStyle = midGlow;
    ctx.stroke();

    // Layer 3: Inner bright glow
    const innerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius - 20,
      centerX,
      centerY,
      radius + 40
    );
    innerGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
    innerGlow.addColorStop(0.4, "rgba(168, 85, 247, 0.3)");
    innerGlow.addColorStop(0.6, "rgba(192, 132, 252, 0.6)");
    innerGlow.addColorStop(0.75, "rgba(59, 130, 246, 0.8)");
    innerGlow.addColorStop(0.85, "rgba(168, 85, 247, 0.7)");
    innerGlow.addColorStop(0.95, "rgba(59, 130, 246, 0.4)");
    innerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.05, Math.PI * 0.95, false);
    ctx.lineWidth = 60;
    ctx.strokeStyle = innerGlow;
    ctx.stroke();

    // Main arc line - bright and crisp
    const arcGradient = ctx.createLinearGradient(
      centerX - radius * 0.5,
      centerY,
      centerX + radius * 0.5,
      centerY
    );
    arcGradient.addColorStop(0, "rgba(59, 130, 246, 1)");
    arcGradient.addColorStop(0.15, "rgba(139, 92, 246, 1)");
    arcGradient.addColorStop(0.35, "rgba(168, 85, 247, 1)");
    arcGradient.addColorStop(0.5, "rgba(200, 150, 255, 1)");
    arcGradient.addColorStop(0.65, "rgba(168, 85, 247, 1)");
    arcGradient.addColorStop(0.85, "rgba(139, 92, 246, 1)");
    arcGradient.addColorStop(1, "rgba(59, 130, 246, 1)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.08, Math.PI * 0.92, false);
    ctx.lineWidth = 6;
    ctx.strokeStyle = arcGradient;
    ctx.stroke();

    // Arc line glow (shadow blur effect)
    ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.08, Math.PI * 0.92, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner arc bright line
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 12, Math.PI * 0.08, Math.PI * 0.92, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(192, 132, 252, 0.9)";
    ctx.stroke();

    // Outer arc subtle line
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, Math.PI * 0.08, Math.PI * 0.92, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
    ctx.stroke();

    // Grid lines radiating from arc
    const radialLines = 40;
    for (let i = 0; i <= radialLines; i++) {
      const angle = Math.PI * 0.08 + (Math.PI * 0.84 * i) / radialLines;
      const innerR = radius - 45;
      const outerR = radius + 50;

      const x1 = centerX + Math.cos(angle) * innerR;
      const y1 = centerY + Math.sin(angle) * innerR;
      const x2 = centerX + Math.cos(angle) * outerR;
      const y2 = centerY + Math.sin(angle) * outerR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      const lineOpacity = 0.08 + (i % 4) * 0.04;
      ctx.strokeStyle = `rgba(139, 92, 246, ${lineOpacity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Concentric grid lines along arc
    const concentricLines = 14;
    for (let i = 1; i <= concentricLines; i++) {
      const offset = i * 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - offset, Math.PI * 0.08, Math.PI * 0.92, false);
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 - i * 0.008})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Arc nodes with intense glow
    const nodeCount = 24;
    for (let i = 0; i <= nodeCount; i++) {
      const angle = Math.PI * 0.08 + (Math.PI * 0.84 * i) / nodeCount;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Node outer glow
      const nodeOuterGlow = ctx.createRadialGradient(x, y, 0, x, y, 30);
      nodeOuterGlow.addColorStop(0, "rgba(168, 85, 247, 0.6)");
      nodeOuterGlow.addColorStop(0.3, "rgba(139, 92, 246, 0.3)");
      nodeOuterGlow.addColorStop(0.6, "rgba(109, 40, 217, 0.1)");
      nodeOuterGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = nodeOuterGlow;
      ctx.fill();

      // Node mid glow
      const nodeMidGlow = ctx.createRadialGradient(x, y, 0, x, y, 15);
      nodeMidGlow.addColorStop(0, "rgba(192, 132, 252, 0.9)");
      nodeMidGlow.addColorStop(0.4, "rgba(168, 85, 247, 0.5)");
      nodeMidGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = nodeMidGlow;
      ctx.fill();

      // Node center bright
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 245, 255, 0.95)";
      ctx.fill();
    }

  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ width: dimensions.width, height: dimensions.height }}
    />
  );
}
