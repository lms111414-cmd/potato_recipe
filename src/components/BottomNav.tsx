'use client';

import { motion } from 'framer-motion';

export type TabId = 'home' | 'game' | 'book';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: '홈', icon: '🏠' },
  { id: 'game', label: '감자 게임', icon: '🥔' },
  { id: 'book', label: '레시피북', icon: '📖' },
];

interface BottomNavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#FDFBF7]/90 backdrop-blur-md border-t border-stone-100 z-30 px-4 py-2 flex justify-around items-center">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
            className="relative flex flex-col items-center gap-0.5 py-1.5 px-5"
          >
            {/* 활성 탭을 따라 부드럽게 미끄러지는 인디케이터 */}
            {isActive && (
              <motion.span
                layoutId="navIndicator"
                className="absolute inset-0 rounded-2xl bg-amber-100/70"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="relative z-10 text-lg leading-none"
            >
              {tab.icon}
            </motion.span>
            <span
              className={`relative z-10 text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                isActive ? 'text-amber-800' : 'text-stone-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
