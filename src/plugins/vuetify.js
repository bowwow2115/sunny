import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import 'vuetify/dist/vuetify.min.css'

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
        primary: colors.amber.darken4,
        secondary: '#2196F3',
        accent: colors.amber.accent3,
        error: colors.deepOrange.accent3,
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#2196F3',
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
  },

}

export default new Vuetify(opts)
