'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Drop = {
  left: number;
  delay: number;
  duration: number;
  height: number;
  opacity: number;
  thickness: number;
};

// 빗방울이 화면에 닿을 때 살짝 번지는 잔물결(ripple)
type Ripple = {
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
};

interface RainEffectProps {
  dropCount?: number;
  rippleCount?: number;
}

export function RainEffect({ dropCount = 48, rippleCount = 8 }: RainEffectProps) {
  // 매 렌더마다 위치가 흔들리지 않도록 한 번만 생성
  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: dropCount }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 0.9 + Math.random() * 1.4,
        height: 40 + Math.random() * 70,
        opacity: 0.12 + Math.random() * 0.35,
        thickness: Math.random() > 0.75 ? 2 : 1,
      })),
    [dropCount],
  );

  const ripples = useMemo<Ripple[]>(
    () =>
      Array.from({ length: rippleCount }, () => ({
        left: Math.random() * 100,
        top: 55 + Math.random() * 40,
        delay: Math.random() * 5,
        duration: 2.5 + Math.random() * 2,
        size: 16 + Math.random() * 26,
      })),
    [rippleCount],
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
      {/* 비 내리는 날의 차분한 색감 필터 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(165, 182, 194, 0.42) 0%, rgba(100, 116, 139, 0.22) 100%)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* 위에서 아래로 떨어지는 빗줄기 */}
      {drops.map((drop, i) => (
        <span
          key={`drop-${i}`}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            width: `${drop.thickness}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}

      {/* 바닥에 닿아 번지는 잔물결 */}
      {ripples.map((ripple, i) => (
        <span
          key={`ripple-${i}`}
          className="rain-ripple"
          style={{
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            animationDelay: `${ripple.delay}s`,
            animationDuration: `${ripple.duration}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
