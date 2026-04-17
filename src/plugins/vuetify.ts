import { h } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

import 'remixicon/fonts/remixicon.css'
import '@/assets/styles/sass/style.scss'

const remixIconSet = {
  component: (props: { icon: string }) => {
    const iconClass =
      typeof props.icon === 'string' ? props.icon : `ri-${props.icon}`

    return h('i', {
      class: `${iconClass} v-icon__svg`,
      'aria-hidden': 'true',
      role: 'img',
    })
  },
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'ri',
    aliases,
    sets: {
      ri: remixIconSet as any,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#f9a319',
          secondary: '#fdc300',
          tertiary: '#5475f2',
          accent: '#ff5a00',
          error: '#f3003f',
          info: '#7f716a',
          success: '#03c75a',
          warning: '#c70034',
          gray: '#8e8c8b',
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
  defaults: {
    VBtn: { variant: 'flat', rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VCard: { elevation: 2, rounded: 'xl' },
  },
})
