'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS, MOOD_LABELS, type Mood, type Recipe } from '@/data/recipes';
import { useRecipes } from '@/context/RecipeContext';
import { RainEffect } from '@/components/RainEffect';
import { NightEffect } from '@/components/NightEffect';
import { SunnyEffect } from '@/components/SunnyEffect';
import { HomeRecipeCard } from '@/components/HomeRecipeCard';
import { RecipeDetailView } from '@/components/RecipeDetailView';
import { PotatoGame } from '@/components/PotatoGame';
import { GameSuccess } from '@/components/GameSuccess';
import { RecipeBook } from '@/components/RecipeBook';
import { DiaryEditModal } from '@/components/DiaryEditModal';
import { BottomNav, type TabId } from '@/components/BottomNav';

// 무드별 배경 색상 (1초 동안 부드럽게 전환)
const MOOD_BG: Record<Mood | 'default', string> = {
  default: 'bg-[#FDFBF7]',
  rainy: 'bg-[#DDE4EA]',
  tired: 'bg-[#1A1C38]',
  sunny: 'bg-[#FFF4D1]',
};

export default function Home() {
  // 전역 레시피 상태 (유저사진/메모 + 도전 레시피 + LocalStorage 영속화)
  const {
    recipes,
    setUserImage,
    setUserMemo,
    challengeRecipeId,
    setChallengeRecipe,
  } = useRecipes();
  // 하단 탭: 홈 / 감자 게임 / 레시피북
  const [activeTab, setActiveTab] = useState<TabId>('home');
  // null = 전체 보기 (초기 상태)
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  // 선택된 레시피가 있으면 상세 화면(isDetail) 상태로 전환
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  // 미니게임 성공 화면(isGameSuccess) 상태 - 사진 교체 권한을 얻은 레시피
  const [successRecipe, setSuccessRecipe] = useState<Recipe | null>(null);
  // 일기 수정 모달 대상 레시피
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const isHome = activeTab === 'home';
  const isGameTab = activeTab === 'game';
  const isRainyMood = isHome && selectedMood === 'rainy';
  const isNightMood = isHome && selectedMood === 'tired';

  // 현재 도전 중인 레시피 (레시피북에서 선택)
  const challengeRecipe = challengeRecipeId
    ? recipes.find((r) => r.id === challengeRecipeId) ?? null
    : null;

  // 선택된 무드가 없으면 전체, 있으면 해당 무드만 필터링
  const visibleRecipes = selectedMood
    ? recipes.filter((recipe) => recipe.mood === selectedMood)
    : recipes;

  // 같은 칩을 다시 누르면 전체 보기로 토글
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  };

  // 홈 상세에서 "기록 도전하기": 도전 레시피 지정 + 상세 닫고 게임 탭으로 이동
  const handleChallenge = (recipe: Recipe) => {
    setChallengeRecipe(recipe.id);
    setSelectedRecipe(null);
    setActiveTab('game');
  };

  // 미니게임 성공 시: 도전 레시피가 있으면 그 레시피, 없으면 미기록 레시피 중 하나
  const handleGameSuccess = () => {
    if (challengeRecipe) {
      setSuccessRecipe(challengeRecipe);
      return;
    }
    const candidates = recipes.filter((r) => !r.userImage);
    const pool = candidates.length > 0 ? candidates : recipes;
    const target = pool[Math.floor(Math.random() * pool.length)];
    setSuccessRecipe(target);
  };

  // 기록 완료: 도전했던 그 레시피에 사진/메모 저장 후 레시피북 탭으로 이동
  const handleSuccessSave = (image: string | null, memo: string) => {
    if (!successRecipe) return;
    if (image) setUserImage(successRecipe.id, image);
    if (memo) setUserMemo(successRecipe.id, memo);
    setSuccessRecipe(null);
    setChallengeRecipe(null);
    setActiveTab('book');
  };

  // 일기 수정 저장
  const handleEditSave = (image: string | null, memo: string) => {
    if (!editRecipe) return;
    setUserImage(editRecipe.id, image);
    setUserMemo(editRecipe.id, memo);
    setEditRecipe(null);
  };

  // 홈 탭에서만 무드 배경을 적용 (게임/레시피북은 기본 베이지)
  const bgClass = isHome ? MOOD_BG[selectedMood ?? 'default'] : MOOD_BG.default;

  return (
    <main
      className={`min-h-screen flex justify-center items-start ${isGameTab ? '' : 'p-4'} font-serif antialiased relative transition-colors duration-1000 ${bgClass}`}
    >

      {/* ================= [무드별 감성 효과 백그라운드] ================= */}
      <AnimatePresence mode="wait">
        {isRainyMood && <RainEffect key="rainy" />}
        {isNightMood && <NightEffect key="tired" />}
        {isHome && selectedMood === 'sunny' && <SunnyEffect key="sunny" />}
      </AnimatePresence>

      {/* ================= [탭 콘텐츠 전환] ================= */}
      <AnimatePresence mode="wait">
        {isHome && (
          <motion.div
            key="tab-home"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md bg-transparent min-h-screen relative overflow-hidden px-4 pt-6 pb-28 z-10"
          >
            {/* 상단 브랜딩 로고 헤더 */}
            <div className="flex flex-col items-center mb-9 select-none">
              <span className="text-3xl filter drop-shadow-sm mb-2">🥔</span>
              <h1 className={`font-serif text-[26px] font-medium tracking-[0.12em] transition-colors duration-1000 ${isNightMood ? 'text-stone-100' : 'text-amber-900'}`}>
                감자일기
              </h1>
            </div>

            {/* ================= [감성 인사 문구] ================= */}
            <div className="mb-5 px-1">
              <p className={`text-[13px] tracking-wide mb-1 transition-colors duration-1000 ${isNightMood ? 'text-stone-300' : 'text-stone-400'}`}>오늘의 감자 일기</p>
              <h2 className={`text-[20px] leading-snug font-semibold tracking-wide transition-colors duration-1000 ${isNightMood ? 'text-stone-50' : 'text-stone-800'}`}>
                오늘 당신의 날씨나<br />마음은 어떤가요?
              </h2>
            </div>

            {/* ================= [무드 선택 칩 버튼] ================= */}
            <div className="flex gap-2.5 flex-wrap mb-8">
              {MOODS.map((mood) => {
                const isActive = selectedMood === mood.id;
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    whileTap={{ scale: 0.94 }}
                    aria-pressed={isActive}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium border transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-800 text-white border-amber-800 shadow-md shadow-amber-900/15'
                        : 'bg-[#EADCC9] bg-opacity-40 text-stone-600 border-transparent hover:bg-opacity-70'
                    }`}
                  >
                    <span className="text-base leading-none">{mood.emoji}</span>
                    {mood.label}
                  </motion.button>
                );
              })}
            </div>

            {/* 섹션 메인 타이틀 */}
            <div className="flex items-baseline justify-between mb-6 pl-1">
              <h2 className={`text-[19px] font-semibold tracking-wide transition-colors duration-1000 ${isNightMood ? 'text-stone-100' : 'text-stone-800'}`}>
                {selectedMood
                  ? `${MOODS.find((m) => m.id === selectedMood)?.emoji} ${MOOD_LABELS[selectedMood]} 감자 요리`
                  : '🥔 나만의 감자 요리'}
              </h2>
              <span className="text-[12px] text-stone-400 font-sans">{visibleRecipes.length}개</span>
            </div>

            {/* 감자 요리 피드 (2열 그리드) */}
            <motion.div layout className="grid grid-cols-2 gap-3.5">
              <AnimatePresence mode="popLayout">
                {visibleRecipes.map((recipe, index) => (
                  <HomeRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                    onSelect={setSelectedRecipe}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {isGameTab && (
          <motion.div
            key="tab-game"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="z-10"
          >
            <PotatoGame
              onSuccess={handleGameSuccess}
              challengeTitle={challengeRecipe?.title ?? null}
            />
          </motion.div>
        )}

        {activeTab === 'book' && (
          <motion.div
            key="tab-book"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="z-10"
          >
            <RecipeBook onEditDiary={setEditRecipe} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= [하단 네비게이션 바] ================= */}
      <BottomNav active={activeTab} onChange={setActiveTab} />

      {/* ================= [상세 화면 전환 (isDetail)] ================= */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailView
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipe(null)}
            onChallenge={handleChallenge}
          />
        )}
      </AnimatePresence>

      {/* ================= [미니게임 성공 화면 (isGameSuccess)] ================= */}
      <AnimatePresence>
        {successRecipe && (
          <GameSuccess
            recipe={successRecipe}
            onSave={handleSuccessSave}
            onSkip={() => setSuccessRecipe(null)}
          />
        )}
      </AnimatePresence>

      {/* ================= [내 일기 수정 모달] ================= */}
      <AnimatePresence>
        {editRecipe && (
          <DiaryEditModal
            recipe={editRecipe}
            onSave={handleEditSave}
            onClose={() => setEditRecipe(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
