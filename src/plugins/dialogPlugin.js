import Vue from 'vue'

const DialogPlugin = {
  install(Vue) {
    Vue.prototype.$dialog = function (component, props) {
      return new Promise((resolve, reject) => {
        const DialogConstructor = Vue.extend(component)
        const instance = new DialogConstructor({
          vuetify: this.$root.$options.vuetify, // Vuetify 인스턴스 전달
          el: document.createElement('div'),
          propsData: props,
        })

        document.body.appendChild(instance.$el)

        instance.open(props).then(resolve).catch(reject)
      })
    }
  },
}

const ErrorDialogPlugin = {
  install(Vue) {
    Vue.prototype.$showError = async function ({ code = '', message = '' }) {
      const { default: ErrorDialog } = await import(
        '@/components/dialog/ErrorDialog.vue'
      )

      const DialogConstructor = Vue.extend(ErrorDialog)
      const instance = new DialogConstructor({
        vuetify: this.$root.$options.vuetify, // Vuetify 인스턴스 전달
        el: document.createElement('div'),
      })

      document.body.appendChild(instance.$el)

      return instance.open(code, message)
    }
  },
}

const MessageDialogPlugin = {
  install(Vue) {
    Vue.prototype.$showMessage = async function ({ type = '', message = '' }) {
      const { default: GlobalSnackbar } = await import(
        '@/components/GlobalSnackbar.vue'
      )

      const DialogConstructor = Vue.extend(GlobalSnackbar)
      const instance = new DialogConstructor({
        vuetify: this.$root.$options.vuetify, // Vuetify 인스턴스 전달
        el: document.createElement('div'),
      })

      document.body.appendChild(instance.$el)

      return instance.open(type, message)
    }
  },
}

export { DialogPlugin, ErrorDialogPlugin, MessageDialogPlugin }
