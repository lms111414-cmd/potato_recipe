'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Recipe } from '@/data/recipes';
import { useRecipes } from '@/context/RecipeContext';
import { RecipeBookCard } from '@/components/RecipeBookCard';
import { RecipeBookModal } from '@/components/RecipeBookModal';

export interface RecipeBookProps {
  /** 기록된 레시피 일기 수정 */
  onEditDiary: (recipe: Recipe) => void;
}

export function RecipeBook({ onEditDiary }: RecipeBookProps) {
  const { recipes } = useRecipes();
  const [selected, setSelected] = useState<Recipe | null>(null);

  // 유저가 직접 기록(사진 또는 메모)한 레시피만 도감에 모인다
  const recorded = recipes.filter((r) => r.userImage || r.userMemo);

  return (
    <div className="w-full max-w-md min-h-screen px-5 pt-6 pb-28">
      {/* 상단 헤더 */}
      <div className="flex flex-col items-center mb-7 select-none">
        <span className="text-2xl filter drop-shadow-sm mb-1">📖</span>
        <h1 className="text-xl font-bold tracking-wide text-stone-800">레시피북</h1>
        <p className="text-[11px] text-stone-400 tracking-widest uppercase mt-[-2px]">
          Recipe Book
        </p>
      </div>

      {recorded.length === 0 ? (
        /* 텅 빈 일기장 (초기 상태) */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center mt-24 px-6"
        >
          <span className="text-5xl mb-4 opacity-70">🗒️</span>
          <h2 className="text-[17px] font-semibold text-stone-700 mb-2">
            아직 텅 빈 일기장이에요
          </h2>
          <p className="text-[13px] text-stone-400 leading-relaxed">
            홈에서 마음에 드는 레시피를 골라
            <br />
            감자 게임에 도전하고 나만의 사진과 메모를
            <br />
            기록하면 이곳에 하나씩 모여요.
          </p>
        </motion.div>
      ) : (
        <>
          <p className="text-[13px] text-stone-400 pl-1 mb-4">
            나의 감자 도감 · {recorded.length}개의 기록 ✨
          </p>

          {/* 감성 그리드 레이아웃 (기록된 레시피만) */}
          <div className="grid grid-cols-2 gap-3.5">
            {recorded.map((recipe, index) => (
              <RecipeBookCard
                key={recipe.id}
                recipe={recipe}
                index={index}
                onSelect={setSelected}
              />
            ))}
          </div>
        </>
      )}

      {/* 레시피 상세 모달 (기록된 레시피 → 수정) */}
      <AnimatePresence>
        {selected && (
          <RecipeBookModal
            recipe={selected}
            onClose={() => setSelected(null)}
            onEditDiary={(recipe) => {
              setSelected(null);
              onEditDiary(recipe);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
