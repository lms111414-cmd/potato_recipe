'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

interface NightEffectProps {
  starCount?: number;
}

export function NightEffect({ starCount = 55 }: NightEffectProps) {
  // 매 렌더마다 별 위치가 흔들리지 않도록 한 번만 생성
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: starCount }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 78,
        size: 1 + Math.random() * 2.4,
        delay: Math.random() * 3,
        duration: 1.4 + Math.random() * 2.6,
      })),
    [starCount],
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
      {/* 깊은 밤하늘 톤 (다크 네이비 → 소프트 퍼플) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(26, 28, 56, 0.92) 0%, rgba(48, 40, 82, 0.88) 55%, rgba(72, 60, 96, 0.82) 100%)',
        }}
      />

      {/* 우측 상단에 은은하게 번지는 달빛 */}
      <div
        className="moon-glow"
        style={{ width: '230px', height: '230px', top: '-60px', right: '-50px' }}
      />

      {/* 반짝이는 작은 별빛 */}
      {stars.map((star, i) => (
        <span
          key={`star-${i}`}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
