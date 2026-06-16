'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MOOD_LABELS, type Recipe } from '@/data/recipes';
import { DiaryEntryForm } from '@/components/DiaryEntryForm';

interface GameSuccessProps {
  recipe: Recipe;
  onSave: (image: string | null, memo: string) => void;
  onSkip: () => void;
}

const CONFETTI_EMOJIS = ['🥔', '🎉', '✨', '⭐', '🧡'];

export function GameSuccess({ recipe, onSave, onSkip }: GameSuccessProps) {
  // 축하 컨페티(한 번만 생성)
  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        rotate: -180 + Math.random() * 360,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        size: 16 + Math.random() * 16,
      })),
    [],
  );

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{
        background:
          'linear-gradient(180deg, #FFF6E6 0%, #FFE9C9 45%, #FDFBF7 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 떨어지는 축하 컨페티 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c, i) => (
          <motion.span
            key={i}
            className="absolute top-[-6%]"
            style={{ left: `${c.left}%`, fontSize: c.size }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0.8], rotate: c.rotate }}
            transition={{
              delay: c.delay,
              duration: c.duration,
              ease: 'easeIn',
              repeat: Infinity,
              repeatDelay: Math.random(),
            }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative max-w-md mx-auto px-6 pt-12 pb-16 font-serif">
        {/* 축하 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-7"
        >
          <motion.span
            className="inline-block text-5xl mb-3"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
          >
            🎉
          </motion.span>
          <h1 className="text-[22px] font-bold text-amber-900 tracking-wide">
            미니게임 성공!
          </h1>
          <p className="text-[13px] text-amber-700/80 mt-1">
            「{recipe.title}」 사진을 직접 채울 수 있어요
          </p>
        </motion.div>

        {/* 기본 레시피 일러스트 카드 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.25 }}
          className="bg-white rounded-3xl p-4 border border-amber-100 shadow-lg mb-8"
        >
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 text-[11px] font-medium text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {MOOD_LABELS[recipe.mood]}
            </span>
          </div>
          <h2 className="text-[17px] font-bold text-stone-800 tracking-wide mt-3 px-1">
            {recipe.title}
          </h2>
          <p className="text-[13px] text-stone-500 mt-1 px-1">
            {recipe.description}
          </p>
        </motion.div>

        {/* 나만의 감자 일기 남기기 (공용 폼) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DiaryEntryForm
            submitLabel="기록 완료 및 저장"
            onSubmit={onSave}
            cancelLabel="나중에 기록하기"
            onCancel={onSkip}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
