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
        primary: '#90ce00',
        secondary: colors.cyan.lighten3,
        tertiary: colors.yellow.darken1,
        accent: colors.cyan.darken4, //강조
        error: colors.deepOrange.accent2, //오류
        info: colors.blueGrey.lighten3, //정보
        success: '#77D618', //성공
        warning: colors.amber.darken3, //경고
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
