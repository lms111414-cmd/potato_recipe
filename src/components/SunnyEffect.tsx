'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Ray = {
  left: number;
  rotate: number;
  delay: number;
  duration: number;
};

type Particle = {
  left: number;
  size: number;
  delay: number;
  duration: number;
};

interface SunnyEffectProps {
  rayCount?: number;
  particleCount?: number;
}

export function SunnyEffect({ rayCount = 7, particleCount = 22 }: SunnyEffectProps) {
  // 우측 상단 햇살에서 퍼지는 빛줄기
  const rays = useMemo<Ray[]>(
    () =>
      Array.from({ length: rayCount }, (_, i) => ({
        left: 55 + i * 7 + Math.random() * 4,
        rotate: -18 + Math.random() * 36,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
      })),
    [rayCount],
  );

  // 아지랑이처럼 피어오르는 따뜻한 공기 입자
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: particleCount }, () => ({
        left: Math.random() * 100,
        size: 6 + Math.random() * 16,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 5,
      })),
    [particleCount],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* 화사한 햇살 톤 (연한 옐로우 → 오렌지) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(255, 244, 209, 0.85) 0%, rgba(255, 224, 178, 0.6) 45%, rgba(255, 209, 156, 0.45) 100%)',
        }}
      />

      {/* 우측 상단에서 번지는 햇빛 (Sun Flare) */}
      <div
        className="sun-flare"
        style={{ width: '300px', height: '300px', top: '-90px', right: '-80px' }}
      />

      {/* 쏟아지는 햇살 줄기 */}
      {rays.map((ray, i) => (
        <span
          key={`ray-${i}`}
          className="sun-ray"
          style={{
            left: `${ray.left}%`,
            transform: `rotate(${ray.rotate}deg)`,
            animationDelay: `${ray.delay}s`,
            animationDuration: `${ray.duration}s`,
          }}
        />
      ))}

      {/* 아지랑이처럼 피어오르는 빛 입자 */}
      {particles.map((p, i) => (
        <span
          key={`haze-${i}`}
          className="haze-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
