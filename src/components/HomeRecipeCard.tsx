'use client';

import { motion } from 'framer-motion';
import { MOODS, MOOD_LABELS, type Recipe } from '@/data/recipes';

export interface HomeRecipeCardProps {
  recipe: Recipe;
  index: number;
  onSelect: (recipe: Recipe) => void;
}

/**
 * 홈 탭 2열 그리드의 하위 아이템 카드 (프레젠테이셔널).
 * 베이지 편지지 톤의 포근한 카드에 [요리명 / 추천 무드 / 감성 에세이 한 조각]을 담는다.
 */
export function HomeRecipeCard({ recipe, index, onSelect }: HomeRecipeCardProps) {
  const moodEmoji = MOODS.find((m) => m.id === recipe.mood)?.emoji ?? '';

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(recipe)}
      className="group flex flex-col text-left bg-[#FDFBF7] rounded-[26px] p-3 border border-amber-100/80 shadow-[0_6px_18px_rgba(120,90,40,0.06)]"
    >
      {/* 기본 일러스트 (격자에 꽉 차게) */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-amber-100/60 relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* 추천 무드 태그 */}
        <span className="absolute top-2 left-2 text-[10px] font-medium text-white bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {moodEmoji} {MOOD_LABELS[recipe.mood]}
        </span>
        {/* 이미 기록한 레시피 표시 */}
        {recipe.userImage && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold text-amber-900 bg-amber-200/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
            기록 완료 ✨
          </span>
        )}
      </div>

      {/* 요리명 + 감성 에세이 한 조각 (타이머 제거, 에세이 느낌으로 정돈) */}
      <div className="px-1 pt-3 pb-1.5 flex flex-col flex-1">
        <h3 className="text-[14px] font-bold text-stone-800 tracking-wide leading-snug line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-[11.5px] text-amber-900/55 mt-1.5 leading-relaxed font-serif line-clamp-3">
          {recipe.story}
        </p>
      </div>
    </motion.button>
  );
}
