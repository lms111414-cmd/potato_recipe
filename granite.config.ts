import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 앱인토스 콘솔에 등록한 appName과 동일하게 맞춰주세요.
  appName: 'potato-recipe',
  brand: {
    displayName: '감자 일기',
    primaryColor: '#8B5E34',
    // 콘솔에서 업로드한 아이콘 이미지 URL을 넣어주세요.
    icon: '',
  },
  permissions: [],
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'next dev',
      // Next.js 정적 export 결과물(out/)을 번들로 패키징합니다.
      build: 'next build',
    },
  },
  outdir: 'out',
});
