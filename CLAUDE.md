# 감자 일기 개발 가이드

## 프로젝트 개요

감자 일기는 토스 미니앱 플랫폼(앱인토스)을 대상으로 한 감성 웰니스 레시피 앱입니다.

### 핵심 특징
- 따뜻한 감성 디자인 (베이지 배경, 명조체)
- 무드 기반 레시피 추천 (비 오는 날, 지친 저녁, 화창한 주말)
- 3분 요리 타이머
- Framer Motion 기반 부드러운 애니메이션

## 기술 스택

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + 커스텀 CSS
- **Animation**: Framer Motion
- **Build**: Next.js built-in

## 개발 워크플로우

### 로컬 실행

```bash
npm install
npm run dev
```

### 코드 구조

- `/src/pages` - 페이지 컴포넌트 (라우팅)
- `/src/components` - 재사용 가능한 컴포넌트
- `/src/data` - 정적 데이터 (레시피 등)
- `/src/globals.css` - 전역 스타일 및 커스텀 클래스

### 주요 컴포넌트

**MoodSelector.tsx**
- 무드 선택 칩 버튼
- Props: selectedMood, onMoodSelect

**RecipeCard.tsx**
- 레시피 카드 표시 (애니메이션 포함)
- Framer Motion 사용으로 부드러운 전환 효과

**Timer.tsx**
- 3분 카운트다운 타이머
- 상태 관리: timeLeft, isRunning

## 스타일링 시스템

### Tailwind 설정 (`tailwind.config.ts`)
- 커스텀 색상: `beige-light`, `beige`, `beige-warm`
- 커스텀 폰트: `font-serif` (Noto Serif KR)
- 애니메이션: `fade-in-up`

### 주요 클래스들 (`globals.css`)
- `.letterpaper` - 편지지 배경 (가로줄 포함)
- `.mood-chip` - 무드 선택 칩 스타일
- `.recipe-card` - 레시피 카드 스타일
- `.timer-display` - 타이머 숫자 표시
- `.timer-button` - 타이머 버튼 스타일

## 레시피 데이터 추가

`src/data/recipes.ts`의 `recipes` 배열에 추가:

```typescript
{
  id: 'unique-id',
  mood: 'rainy' | 'tired' | 'sunny',
  title: '요리 이름',
  description: '한 줄 설명',
  cookingTime: 3,
  story: '감성적인 조리 스토리'
}
```

## 앱인토스 플랫폼 설정

`granite.config.ts`에서 다음 항목 관리:
- 앱 메타데이터 (이름, 버전, 설명)
- 플랫폼 설정 (iOS/Android)
- 화면 라우팅 정의
- 권한 설정

## 개발 팁

### 반응형 레이아웃
- Tailwind의 `max-w-md` 사용으로 모바일 최적화
- 패딩: `px-4` (좌우 여백)

### 애니메이션 지연
- RecipeCard에서 `delay: index * 0.1` 사용
- 순차적인 애니메이션 효과 구현

### 타이머 로직
- `useEffect`로 1초마다 업데이트
- 상태: `timeLeft` (남은 시간), `isRunning` (실행 여부)

## 성능 최적화

- Next.js 이미지 최적화 (필요 시)
- 동적 임포트 (대용량 컴포넌트용)
- 번들 크기 모니터링

## 배포

### 빌드

```bash
npm run build
```

### 토스 플랫폼 배포
1. `granite.config.ts` 검증
2. 빌드 완료 확인
3. 앱인토스 CLI로 배포

## 주의사항

- 모든 텍스트는 한국어 폰트(Noto Serif KR)를 사용하므로 명조체 폰트가 필수
- 배경 이미지는 `globals.css`의 `.letterpaper` 클래스에 정의
- 모바일 환경에서 테스트 필수 (앱인토스는 모바일 플랫폼)

## 문제 해결

### 폰트가 적용되지 않음
- `next/document.tsx` 확인
- `globals.css`의 `@import` 확인

### 애니메이션이 부드럽지 않음
- Framer Motion 버전 확인
- `transition` 값 조정

### 타이머가 작동하지 않음
- `useEffect` 의존성 배열 확인
- 상태 업데이트 로직 확인
