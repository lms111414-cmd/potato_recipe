'use client';

import { motion } from 'framer-motion';
import { MOOD_LABELS, type Recipe } from '@/data/recipes';

interface RecipeBookCardProps {
  recipe: Recipe;
  index: number;
  onSelect: (recipe: Recipe) => void;
}

/**
 * 레시피북 그리드의 하위 아이템 카드 (프레젠테이셔널).
 * 유저 사진이 있으면 일러스트 대신 그 사진을 보여주고 "기록 완료" 배지를 단다.
 */
export function RecipeBookCard({ recipe, index, onSelect }: RecipeBookCardProps) {
  const hasRecord = !!recipe.userImage;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(recipe)}
      className="group text-left bg-white rounded-3xl p-2.5 border border-stone-100 shadow-[0_6px_16px_rgba(0,0,0,0.025)]"
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 relative">
        <img
          src={recipe.userImage ?? recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* 무드 라벨 */}
        <span className="absolute top-2 left-2 text-[10px] font-medium text-white bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {MOOD_LABELS[recipe.mood]}
        </span>
        {/* 기록 완료 배지 */}
        {hasRecord && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 16 }}
            className="absolute top-2 right-2 text-[10px] font-semibold text-amber-900 bg-amber-200/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm"
          >
            기록 완료 ✨
          </motion.span>
        )}
      </div>

      <div className="px-1.5 pt-2 pb-1">
        <h3 className="text-[13.5px] font-bold text-stone-800 tracking-wide truncate">
          {recipe.title}
        </h3>
        <p className="text-[11px] text-stone-400 mt-0.5 truncate">
          {recipe.userMemo ? `“${recipe.userMemo}”` : `⏱️ ${recipe.cookingTime}분`}
        </p>
      </div>
    </motion.button>
  );
}
