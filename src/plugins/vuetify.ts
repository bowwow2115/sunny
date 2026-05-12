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
    aliases: {
      ...aliases,
      checkboxOn: 'ri-checkbox-circle-fill',
      checkboxOff: 'ri-checkbox-blank-circle-line',
      checkboxIndeterminate: 'ri-checkbox-indeterminate-circle-line',
      clear: 'ri-close-circle-fill',
    },
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
          primary: '#F9A825',
          secondary: '#FFD54F',
          tertiary: '#FFB300',
          accent: '#FB8C00',
          error: '#E53935',
          info: '#807c7b',
          success: '#43A047',
          warning: '#EF6C00',
          gray: '#8e8c8b',
          background: '#f9f8f5',
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
