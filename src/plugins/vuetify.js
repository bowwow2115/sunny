// plugins/vuetify.js
import { h } from 'vue' // ✅ 이 줄 추가!
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

// ✅ RemixIcon 폰트 (전역에서 이미 로딩했다면 생략 가능)
import 'remixicon/fonts/remixicon.css'

// ✅ 프로젝트 커스텀 스타일
import '@/assets/styles/sass/style.scss'

// ─────────────────────────────────────────────
// 🎨 RemixIcon 커스텀 아이콘 세트 정의
// ─────────────────────────────────────────────
/**
 * Vuetify 에서 RemixIcon 을 사용하기 위한 커스텀 아이콘 렌더러
 * 사용법: <v-icon icon="ri-user-5-fill" />
 */
const remixIconSet = {
  component: (props) => {
    // ✅ props.icon 이 "ri-xxx" 형식인지 확인
    const iconClass =
      typeof props.icon === 'string' ? props.icon : `ri-${props.icon}`

    return h('i', {
      class: `${iconClass} v-icon__svg`,
      'aria-hidden': 'true',
      role: 'img',
    })
  },
}

// ─────────────────────────────────────────────
// ⚙️ Vuetify 옵션 설정
// ─────────────────────────────────────────────
const opts = {
  // ✅ 모든 Vuetify 컴포넌트/디렉티브 등록
  components,
  directives,

  // ✅ 아이콘 설정
  icons: {
    defaultSet: 'ri', // ✅ 기본 아이콘 세트를 'ri' 로 설정
    aliases, // MDI alias 유지 (선택사항)
    sets: {
      ri: remixIconSet, // ✅ 커스텀 RemixIcon 세트 등록
    },
  },

  // ✅ 테마 설정
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#f9a319', // 연주황
          secondary: '#fdc300', // 노랑
          tertiary: '#5475f2', // 파랑
          accent: '#ff5a00', // 주황 (강조)
          error: '#f3003f', // 핑크 (에러)
          info: '#7f716a', // 브라운 (정보)
          success: '#03c75a', // 초록 (성공)
          warning: '#c70034', // 진핑크 (경고)
          gray: '#8e8c8b', // 그레이
          // ✅ 추가 유틸리티 색상 (Vuetify 컴포넌트 호환용)
          background: '#ffffff',
          surface: '#ffffff',
          'on-primary': '#ffffff',
          'on-secondary': '#000000',
          'on-surface': '#000000',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#1e1e1e',
        },
      },
    },
  },

  // ✅ 글로벌 defaults 설정 (선택사항: 일관된 스타일 적용)
  defaults: {
    VBtn: {
      variant: 'flat',
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VCard: {
      elevation: 2,
      rounded: 'xl',
    },
  },
}

// ─────────────────────────────────────────────
// 🚀 Vuetify 인스턴스 생성 및 내보내기
// ─────────────────────────────────────────────
export default createVuetify(opts)
