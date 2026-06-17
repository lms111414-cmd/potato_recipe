'use client';

import { motion } from 'framer-motion';
import { type Recipe, MOOD_LABELS } from '@/data/recipes';

export interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  /** "이 레시피 기록 도전하기": 게임 탭으로 이동 */
  onChallenge: (recipe: Recipe) => void;
}

export function RecipeDetailView({
  recipe,
  onBack,
  onChallenge,
}: RecipeDetailViewProps) {
  const hasRecord = !!recipe.userImage;

  return (
    <motion.div
      className="letterpaper fixed inset-0 z-30 overflow-y-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-md mx-auto px-5 pt-5 pb-16 min-h-screen">
        {/* 뒤로가기 */}
        <button
          onClick={onBack}
          className="text-sm text-amber-700 hover:text-amber-900 transition-colors font-serif mb-5"
        >
          ← 뒤로
        </button>

        {/* 대표 이미지 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-amber-100 shadow-sm mb-6 relative"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 text-[11px] font-medium text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {MOOD_LABELS[recipe.mood]}
          </span>
        </motion.div>

        {/* 제목 / 설명 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <h1 className="text-2xl font-serif font-medium text-amber-950 mb-2 tracking-wide">
            {recipe.title}
          </h1>
          <p className="text-sm text-amber-700 font-serif mb-6">{recipe.description}</p>

          {/* 구분선 */}
          <div className="w-12 h-px bg-amber-300/70 mb-7" />

          {/* 에세이형 조리 스토리 */}
          <p className="text-amber-900/90 font-serif leading-[2] text-[15px] tracking-wide whitespace-pre-line">
            {recipe.story}
          </p>

          {/* 기록 도전하기 (정적 레이아웃 — 글 흐름에 자연스럽게 포함되어 스크롤 시 함께 이동) */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChallenge(recipe)}
            className="mt-10 w-full rounded-2xl py-4 text-[15px] font-semibold text-white bg-amber-800 hover:bg-amber-900 shadow-md shadow-amber-900/15 transition-colors"
          >
            {hasRecord
              ? '다시 기록 도전하기 🎮'
              : '이 레시피 기록 도전하기 🎮'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
