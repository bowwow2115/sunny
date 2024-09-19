import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import 'vuetify/src/styles/main.sass' // Vuetify 스타일을 가져옵니다.
import '@/assets/styles/sass/style.scss' // style.scss를 한번만 불러오면 자동으로 css로 컴파일 해줌

import colors from 'vuetify/lib/util/colors'

// import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

Vue.use(Vuetify)

const opts = {
  // icons: {
  //   iconfont: 'mdiSvg', //'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg',
  // },
  // 언어 설정
  theme: {
    dark: false, // 다크 모드를 원하면 true로 설정
    // default: 'light',
    themes: {
      light: {
        //primary: '#90ce00', //연두
        primary: '#f9a319', //연주황
        secondary: '#fdc300', //노랑
        tertiary: '#5475f2', //파랑
        accent: '#ff5a00', //주황 (강조)
        error: '#f3003f', //핑크 (에러)
        info: '#7f716a', //브라운 (정보)
        success: '#03c75a', //초록 (성공)
        warning: '#c70034', //진핑크 (경고)
        gray: '#8e8c8b', //그레이
      },
      dark: {
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
    },
    options: {
      customProperties: true, // Vuetify의 custom properties 사용
    },
    default: {},
  },
}

export default new Vuetify(opts)
