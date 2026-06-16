'use client';

import { motion } from 'framer-motion';
import { MOOD_LABELS, type Recipe } from '@/data/recipes';

interface RecipeBookModalProps {
  recipe: Recipe;
  onClose: () => void;
  /** 아직 기록되지 않은 레시피: 게임 탭으로 도전하러 이동 (옵션) */
  onChallenge?: (recipe: Recipe) => void;
  /** 이미 기록된 레시피: 내 일기 수정 */
  onEditDiary: (recipe: Recipe) => void;
}

export function RecipeBookModal({
  recipe,
  onClose,
  onChallenge,
  onEditDiary,
}: RecipeBookModalProps) {
  const hasRecord = !!(recipe.userImage || recipe.userMemo);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 카드 */}
      <motion.div
        className="relative w-full max-w-md bg-[#FDFBF7] rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100 font-serif"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* 대표 이미지 */}
        <div className="w-full aspect-[4/3] overflow-hidden bg-stone-50 relative">
          <img
            src={recipe.userImage ?? recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 text-[11px] font-medium text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {MOOD_LABELS[recipe.mood]}
          </span>
          {hasRecord && (
            <span className="absolute top-4 right-4 text-[11px] font-semibold text-amber-900 bg-amber-200/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              기록 완료 ✨
            </span>
          )}
          {/* 닫기 */}
          <button
            onClick={onClose}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm text-stone-600 hover:text-stone-900 shadow-sm flex items-center justify-center"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-5 pb-7">
          <h2 className="text-2xl font-medium text-amber-950 tracking-wide">
            {recipe.title}
          </h2>
          <p className="text-sm text-amber-700 mt-1">{recipe.description}</p>

          <div className="w-12 h-px bg-amber-300/70 my-5" />

          {/* 유저 메모가 있으면 강조 노출 */}
          {recipe.userMemo && (
            <p className="text-[15px] text-amber-900/90 leading-relaxed mb-4">
              “{recipe.userMemo}”
            </p>
          )}

          {/* 에세이형 조리 스토리(요약) */}
          <p className="text-[14px] text-stone-600 leading-[1.9] tracking-wide line-clamp-4">
            {recipe.story}
          </p>

          <div className="flex items-center gap-1 mt-5 text-[12px] text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-full w-max">
            <span>⏱️</span> {recipe.cookingTime}분 요리
          </div>

          {/* 액션 버튼 (기록 여부에 따라 분기) */}
          {hasRecord ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onEditDiary(recipe)}
              className="mt-7 w-full rounded-2xl py-4 text-[15px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-200 transition-colors"
            >
              ✏️ 내 일기 수정하기
            </motion.button>
          ) : (
            onChallenge && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onChallenge(recipe)}
                className="mt-7 w-full rounded-2xl py-4 text-[15px] font-semibold text-white bg-amber-800 hover:bg-amber-900 shadow-md shadow-amber-900/15 transition-colors"
              >
                이 레시피 사진 해금하러 가기 🎮
              </motion.button>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
