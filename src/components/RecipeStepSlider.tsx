'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface RecipeStepSliderProps {
  /** 긴 줄글 레시피 본문 (문단/마침표 기준으로 단계 카드로 분리) */
  story: string;
}

/** 긴 줄글을 단계 카드용 단락 배열로 변환한다. */
function parseSteps(story: string): string[] {
  const trimmed = story.trim();
  if (!trimmed) return [];

  // 1순위: 문단(빈 줄 / 줄바꿈) 기준으로 분리
  const byParagraph = trimmed
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (byParagraph.length > 1) return byParagraph;

  // 2순위: 문단이 하나뿐이면 마침표 기준으로 2~3문장씩 묶어 분리
  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    chunks.push(sentences.slice(i, i + 3).join(' '));
  }
  return chunks.length ? chunks : [trimmed];
}

export function RecipeStepSlider({ story }: RecipeStepSliderProps) {
  const steps = useMemo(() => parseSteps(story), [story]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = steps.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  };

  if (total === 0) return null;

  return (
    <div className="select-none">
      {/* 단계 카드 */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-amber-100 bg-[#FBF6EC] shadow-sm shadow-amber-900/5 px-6 py-7 min-h-[220px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-800 text-white text-[13px] font-semibold font-serif">
                {index + 1}
              </span>
              <span className="text-[13px] font-serif text-amber-700 tracking-wide">
                {index + 1}단계 · 전체 {total}단계
              </span>
            </div>
            <p className="text-amber-900/90 font-serif leading-[2] text-[15px] tracking-wide whitespace-pre-line">
              {steps[index]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 페이지네이션 점 */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}단계로 이동`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-6 bg-amber-700'
                : 'w-2 bg-amber-300/60 hover:bg-amber-400'
            }`}
          />
        ))}
      </div>

      {/* 이전 / 다음 버튼 */}
      <div className="flex items-center gap-3 mt-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="flex-1 rounded-2xl py-3.5 text-[14px] font-serif font-medium border border-amber-200 text-amber-800 bg-white/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
        >
          ← 이전
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="flex-1 rounded-2xl py-3.5 text-[14px] font-serif font-medium text-white bg-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-900"
        >
          다음 →
        </motion.button>
      </div>
    </div>
  );
}
