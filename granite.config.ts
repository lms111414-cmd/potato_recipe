export default {
  name: 'potato-recipe',
  displayName: '감자 일기',
  description: '1인가구를 위한 감성 웰니스 레시피 미니앱',
  version: '0.1.0',

  // 앱인토스 플랫폼 설정
  platform: {
    ios: true,
    android: true,
  },

  // 빌드 설정
  build: {
    entry: 'src/pages/_app.tsx',
    output: 'dist',
    target: 'es2020',
  },

  // 권한 설정
  permissions: [],

  // 네이티브 모듈
  nativeModules: [],

  // 화면 라우팅
  screens: [
    {
      name: 'home',
      path: '/',
      component: 'src/pages/index.tsx',
    },
    {
      name: 'recipe-detail',
      path: '/recipe/:id',
      component: 'src/pages/recipe/[id].tsx',
    },
  ],
}
