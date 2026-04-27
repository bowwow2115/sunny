declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'vue-clipboard3' {
  const plugin: any
  export default plugin
}

declare module 'hangul-js' {
  const Hangul: any
  export default Hangul
}

declare global {
  interface Window {
    constants: any
    vuetify: any
    Utils: any
    $app: any
    $router: any
    $store: any
    $vuetify: any
    vue: any
    _consolelog: any
    daum: any
    opera: any
    MSStream: any
    validateHandle: any
  }
  const daum: any
}

export {}
