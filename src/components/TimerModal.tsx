'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerModalProps {
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export function TimerModal({ open, onClose, duration = 180 }: TimerModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  // 모달이 열릴 때마다 타이머 초기화 후 자동 시작
  useEffect(() => {
    if (open) {
      setTimeLeft(duration);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [open, duration]);

  // 1초마다 카운트다운
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, timeLeft]);

  // 분:초(예: 05:00) 형식으로 변환
  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatted = formatTime(Math.max(timeLeft, 0));
  const totalLabel = `${Math.round(duration / 60)}분`;
  const isDone = timeLeft <= 0;

  // 원형 진행 링 계산
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;

  const handleToggle = () => {
    if (isDone) {
      setTimeLeft(duration);
      setIsRunning(true);
    } else {
      setIsRunning((r) => !r);
    }
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
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

          {/* 타이머 카드 */}
          <motion.div
            className="relative w-full max-w-[320px] bg-[#FDFBF7] rounded-[28px] px-7 py-9 shadow-2xl border border-amber-100 flex flex-col items-center"
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <p className="text-[13px] text-amber-700 tracking-wide font-serif mb-6">
              {isDone ? '완성되었어요 🥔' : `${totalLabel} 요리 타이머`}
            </p>

            {/* 원형 카운트다운 */}
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" width="180" height="180">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="rgba(180, 83, 9, 0.12)"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: circumference * (1 - progress) }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </svg>
              <span className="text-5xl font-serif font-light text-amber-900 tabular-nums">
                {formatted}
              </span>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex gap-3 mt-8 w-full">
              <button
                onClick={handleToggle}
                className="flex-1 timer-button justify-center text-center"
              >
                {isDone ? '다시 시작' : isRunning ? '일시중지' : '재개'}
              </button>
              <button
                onClick={handleReset}
                className="timer-button opacity-75 px-5"
              >
                초기화
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-5 text-xs text-amber-700 hover:text-amber-900 transition-colors font-serif"
            >
              닫기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
