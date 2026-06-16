'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type ItemType = '🥔' | '🍅' | '🍠';

type FallingItem = {
  id: number;
  x: number; // 중심 x 좌표(px)
  y: number; // 상단 y 좌표(px)
  type: ItemType;
  speed: number;
};

export interface PotatoGameProps {
  /** 목표 점수 달성 시 한 번 호출 (성공 화면으로 전환) */
  onSuccess?: () => void;
  /** 레시피북에서 도전 중인 레시피 제목 (있으면 안내 배너 표시) */
  challengeTitle?: string | null;
}

// 이 점수를 넘기면 레시피 한 개가 해금된다
const REWARD_SCORE = 50;

const BASKET_WIDTH = 76;
const ITEM_SIZE = 40;
const SCORE_BY_TYPE: Record<ItemType, number> = {
  '🥔': 10,
  '🍅': -5,
  '🍠': -5,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function PotatoGame({ onSuccess, challengeTitle }: PotatoGameProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const basketXRef = useRef(0);
  const idRef = useRef(0);
  const rewardedRef = useRef(false);

  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [basketX, setBasketX] = useState(0);
  // 점수 변화 시 살짝 튀는 피드백
  const [pop, setPop] = useState<'up' | 'down' | null>(null);

  // 목표 점수 달성 시 한 번만 성공 화면으로 전환
  useEffect(() => {
    if (rewardedRef.current) return;
    if (score >= REWARD_SCORE) {
      rewardedRef.current = true;
      onSuccess?.();
    }
  }, [score, onSuccess]);

  // 플레이 영역 크기 측정 + 바구니 초기 위치
  useEffect(() => {
    const measure = () => {
      const el = fieldRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      if (basketXRef.current === 0) {
        basketXRef.current = rect.width / 2;
        setBasketX(rect.width / 2);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 일정 간격으로 새 아이템 생성
  useEffect(() => {
    const spawn = setInterval(() => {
      const w = sizeRef.current.w || 320;
      const roll = Math.random();
      const type: ItemType = roll < 0.55 ? '🥔' : roll < 0.775 ? '🍅' : '🍠';
      idRef.current += 1;
      setItems((prev) => [
        ...prev,
        {
          id: idRef.current,
          x: clamp(Math.random() * w, ITEM_SIZE, w - ITEM_SIZE),
          y: -ITEM_SIZE,
          type,
          speed: 3 + Math.random() * 3,
        },
      ]);
    }, 720);
    return () => clearInterval(spawn);
  }, []);

  // 낙하 + 충돌(받기) 처리 루프
  useEffect(() => {
    const loop = setInterval(() => {
      const h = sizeRef.current.h || 0;
      const basketCenter = basketXRef.current;
      const catchTop = h - 104;
      const catchBottom = h - 44;

      setItems((prev) => {
        const remaining: FallingItem[] = [];
        for (const item of prev) {
          const ny = item.y + item.speed * 4;
          const reachedBasket = ny + ITEM_SIZE >= catchTop && ny <= catchBottom;
          const aligned =
            Math.abs(item.x - basketCenter) < BASKET_WIDTH / 2 + ITEM_SIZE / 2;

          if (reachedBasket && aligned) {
            const delta = SCORE_BY_TYPE[item.type];
            setScore((s) => s + delta);
            setPop(delta > 0 ? 'up' : 'down');
            window.setTimeout(() => setPop(null), 250);
            continue; // 받았으니 제거
          }
          if (ny > h) continue; // 놓침 → 제거
          remaining.push({ ...item, y: ny });
        }
        return remaining;
      });
    }, 30);
    return () => clearInterval(loop);
  }, []);

  // 바구니 위치 갱신 (포인터/터치)
  const moveBasketTo = useCallback((clientX: number) => {
    const el = fieldRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(
      clientX - rect.left,
      BASKET_WIDTH / 2,
      rect.width - BASKET_WIDTH / 2,
    );
    basketXRef.current = x;
    setBasketX(x);
  }, []);

  // 키보드 화살표 조작
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const w = sizeRef.current.w || 320;
      const step = e.key === 'ArrowLeft' ? -28 : 28;
      const x = clamp(
        basketXRef.current + step,
        BASKET_WIDTH / 2,
        w - BASKET_WIDTH / 2,
      );
      basketXRef.current = x;
      setBasketX(x);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.div
      className="relative z-10 w-full max-w-md mx-auto flex flex-col h-[100dvh] pb-24 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #BFE3F2 0%, #DCF0F7 45%, #F3F8E9 100%)',
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 상단 바: 타이틀 + 점수 */}
      <div className="relative z-10 w-full px-5 pt-6 flex items-center justify-between">
        <h1 className="font-serif font-bold text-lg text-sky-900">
          🥔 감자 수확
        </h1>
        <motion.div
          animate={{ scale: pop ? 1.18 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 16 }}
          className={`font-serif font-bold text-lg rounded-full px-5 py-2 shadow-sm bg-white/80 ${
            pop === 'up'
              ? 'text-amber-700'
              : pop === 'down'
                ? 'text-rose-500'
                : 'text-sky-900'
          }`}
        >
          {score}점
        </motion.div>
      </div>

      {/* 레시피북에서 넘어온 도전 안내 배너 */}
      {challengeTitle && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto mt-3 w-[88%] rounded-full bg-amber-800/90 text-white text-center text-[13px] font-serif font-medium px-4 py-2 shadow-md"
        >
          지금은 「{challengeTitle}」 레시피 해금 도전 중!
        </motion.div>
      )}

      {/* 안내 문구 / 목표 */}
      <p className="relative z-10 text-center text-[13px] text-sky-900/70 font-serif mt-3 px-6">
        바구니를 움직여 감자(🥔 +10)를 받고
        <br />
        토마토 🍅 · 고구마 🍠 (-5)는 피해보세요!
        <br />
        <span className="text-amber-700 font-medium">
          {REWARD_SCORE}점을 넘기면 내 사진으로 레시피를 꾸밀 수 있어요!
        </span>
      </p>

      {/* 플레이 영역 */}
      <div
        ref={fieldRef}
        onPointerMove={(e) => moveBasketTo(e.clientX)}
        onTouchMove={(e) => moveBasketTo(e.touches[0].clientX)}
        className="relative flex-1 w-full max-w-md mx-auto mt-2 touch-none cursor-pointer select-none"
      >
        {/* 떨어지는 아이템들 */}
        {items.map((item) => (
          <span
            key={item.id}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              fontSize: 30,
              lineHeight: `${ITEM_SIZE}px`,
              textAlign: 'center',
              transform: 'translateX(-50%)',
              willChange: 'top',
            }}
          >
            {item.type}
          </span>
        ))}

        {/* 바구니를 든 감자 캐릭터 */}
        <div
          className="absolute bottom-6 flex flex-col items-center"
          style={{
            left: basketX,
            transform: 'translateX(-50%)',
            width: BASKET_WIDTH,
            willChange: 'left',
          }}
        >
          <span className="text-3xl drop-shadow-sm -mb-2 z-10">🥔</span>
          <span className="text-5xl drop-shadow-md">🧺</span>
        </div>
      </div>
    </motion.div>
  );
}
