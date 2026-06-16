'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { recipes as initialRecipes, type Recipe } from '@/data/recipes';

const STORAGE_KEY = 'potato-diary:recipes:v3';

// LocalStorage에 저장하는 유저 상태(동적 필드만 보관)
type RecipeOverride = {
  id: string;
  isLocked: boolean;
  userImage: string | null;
  userMemo: string;
};

interface RecipeContextValue {
  recipes: Recipe[];
  /** LocalStorage 로드가 끝났는지 여부 */
  hydrated: boolean;
  /** 현재 게임 탭에서 도전 중인 레시피 ID (레시피북에서 선택) */
  challengeRecipeId: string | null;
  /** 도전할 레시피 ID 지정/해제 */
  setChallengeRecipe: (id: string | null) => void;
  /** 특정 레시피 해금 */
  unlockRecipe: (id: string) => void;
  /** 잠긴 레시피 중 하나를 무작위로 해금 (미니게임 보상). 해금된 레시피 반환 */
  unlockRandomRecipe: () => Recipe | null;
  /** 유저 사진 등록/수정 */
  setUserImage: (id: string, url: string | null) => void;
  /** 유저 한 줄 일기 등록/수정 */
  setUserMemo: (id: string, memo: string) => void;
  /** 모든 진행 상황 초기화 */
  resetProgress: () => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

const toOverride = (r: Recipe): RecipeOverride => ({
  id: r.id,
  isLocked: r.isLocked,
  userImage: r.userImage,
  userMemo: r.userMemo,
});

export function RecipeProvider({ children }: { children: ReactNode }) {
  // 서버/클라이언트 첫 렌더는 항상 정적 기본값 → hydration mismatch 방지
  const [recipeList, setRecipeList] = useState<Recipe[]>(initialRecipes);
  const [hydrated, setHydrated] = useState(false);
  // 도전 중인 레시피 ID (세션 한정, 영속화하지 않음)
  const [challengeRecipeId, setChallengeRecipe] = useState<string | null>(null);
  const listRef = useRef(recipeList);
  listRef.current = recipeList;

  // 마운트 시 LocalStorage에서 유저 상태를 불러와 정적 데이터에 머지
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const overrides: RecipeOverride[] = JSON.parse(raw);
        const map = new Map(overrides.map((o) => [o.id, o]));
        setRecipeList(
          initialRecipes.map((r) => {
            const o = map.get(r.id);
            return o
              ? {
                  ...r,
                  isLocked: o.isLocked,
                  userImage: o.userImage,
                  userMemo: o.userMemo,
                }
              : r;
          }),
        );
      }
    } catch {
      // 손상된 데이터는 무시하고 기본값 유지
    }
    setHydrated(true);
  }, []);

  // 상태가 바뀔 때마다 LocalStorage에 영속화 (로드 완료 후에만)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recipeList.map(toOverride)),
      );
    } catch {
      // 저장 실패(용량 초과 등)는 조용히 무시
    }
  }, [recipeList, hydrated]);

  const unlockRecipe = useCallback((id: string) => {
    setRecipeList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isLocked: false } : r)),
    );
  }, []);

  const unlockRandomRecipe = useCallback((): Recipe | null => {
    const locked = listRef.current.filter((r) => r.isLocked);
    if (locked.length === 0) return null;
    const target = locked[Math.floor(Math.random() * locked.length)];
    setRecipeList((prev) =>
      prev.map((r) => (r.id === target.id ? { ...r, isLocked: false } : r)),
    );
    return { ...target, isLocked: false };
  }, []);

  const setUserImage = useCallback((id: string, url: string | null) => {
    setRecipeList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, userImage: url } : r)),
    );
  }, []);

  const setUserMemo = useCallback((id: string, memo: string) => {
    setRecipeList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, userMemo: memo } : r)),
    );
  }, []);

  const resetProgress = useCallback(() => {
    setRecipeList(initialRecipes);
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        recipes: recipeList,
        hydrated,
        challengeRecipeId,
        setChallengeRecipe,
        unlockRecipe,
        unlockRandomRecipe,
        setUserImage,
        setUserMemo,
        resetProgress,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) {
    throw new Error('useRecipes는 RecipeProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
