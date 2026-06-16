# 감자 일기 (Potato Recipe App)

1인가구를 위한 감성 웰니스 레시피 미니앱

## 프로젝트 개요

감자 일기는 따뜻한 감정을 담은 감자 요리 레시피 미니앱입니다.
사용자의 기분과 날씨에 맞는 감자 요리를 추천받고, 간단한 3분 타이머와 함께 요리를 즐길 수 있습니다.

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Package Manager**: npm

## 설치 및 실행

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열어주세요.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── pages/
│   ├── _app.tsx           # Next.js 앱 루트
│   ├── _document.tsx      # HTML 문서 구조
│   ├── index.tsx          # 메인 화면
│   └── recipe/
│       └── [id].tsx       # 레시피 상세 화면
├── components/
│   ├── MoodSelector.tsx   # 무드 선택 컴포넌트
│   ├── RecipeCard.tsx     # 레시피 카드 컴포넌트
│   └── Timer.tsx          # 타이머 컴포넌트
├── data/
│   └── recipes.ts         # 레시피 데이터
└── globals.css            # 전역 스타일

public/                     # 정적 자산
```

## 주요 기능

### 1. 무드 선택
- '비 오는 날', '지친 저녁', '화창한 주말' 세 가지 무드 중 선택
- 선택된 무드에 따른 레시피 3가지 자동 노출

### 2. 레시피 카드
- 각 무드별 감자 요리 추천
- 부드러운 애니메이션 효과
- 카드 클릭 시 상세 화면으로 이동

### 3. 레시피 상세 뷰
- 에세이 형태의 감성적인 조리 순서
- 편지지 스타일의 따뜻한 디자인
- 명조체/세리프 폰트 사용

### 4. 3분 타이머
- 간단한 요리를 위한 3분(180초) 카운트다운
- 시작, 일시중지, 초기화 기능
- 실시간 시간 표시

## 디자인 시스템

### 색상
- **주 배경**: #FDFBF7 (따뜻한 베이지)
- **차 배경**: #F5F0E8
- **강조**: Amber 색상군

### 폰트
- **주 폰트**: Noto Serif KR (명조체)
- **Fallback**: Georgia, serif

### 애니메이션
- Fade-in-up 효과로 부드러운 UI 전환
- Framer Motion을 활용한 미묘한 모션 디자인

## 앱인토스 플랫폼 호환성

이 프로젝트는 앱인토스(Apps in Toss) 플랫폼의 규격을 준수합니다.

- `granite.config.ts`: 토스 미니앱 플랫폼 설정
- 모바일-우선 반응형 설계
- 토스 UI 가이드라인 준수

## 개발 팁

### 새로운 레시피 추가
`src/data/recipes.ts`의 `recipes` 배열에 새로운 레시피 객체를 추가합니다.

```typescript
{
  id: 'unique-id',
  mood: 'rainy' | 'tired' | 'sunny',
  title: '레시피 제목',
  description: '짧은 설명',
  cookingTime: 3,
  story: '감성적인 조리 스토리...',
}
```

## 향후 개선사항

- [ ] 사용자 맞춤 레시피 저장 기능
- [ ] 재료 리스트 추가
- [ ] 배경음악 기능
- [ ] 레시피 공유 기능
- [ ] 사용자 리뷰 및 평점

## 라이선스

Private Project

## 문의

프로젝트에 관한 문의는 개발자에게 연락주세요.
