'use client';

import { motion } from 'framer-motion';
import { MOOD_LABELS, type Recipe } from '@/data/recipes';
import { DiaryEntryForm } from '@/components/DiaryEntryForm';

interface DiaryEditModalProps {
  recipe: Recipe;
  onSave: (image: string | null, memo: string) => void;
  onClose: () => void;
}

export function DiaryEditModal({ recipe, onSave, onClose }: DiaryEditModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-md bg-[#FDFBF7] rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-100 font-serif px-6 pt-7 pb-8"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-[20px] font-bold text-amber-900 tracking-wide">
            ✏️ 내 일기 수정하기
          </h1>
          <p className="text-[13px] text-amber-700/80 mt-1">
            「{recipe.title}」 · {MOOD_LABELS[recipe.mood]}
          </p>
        </div>

        <DiaryEntryForm
          initialImage={recipe.userImage}
          initialMemo={recipe.userMemo}
          submitLabel="수정 완료"
          onSubmit={onSave}
          cancelLabel="닫기"
          onCancel={onClose}
        />
      </motion.div>
    </motion.div>
  );
}
