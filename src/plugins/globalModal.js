import Vue from 'vue';
import GlobalModal from '@/views/ErrorDialogPlugIn.vue';

const ModalConstructor = Vue.extend(GlobalModal);

const instance = new ModalConstructor({
  el: document.createElement('div')
});

document.body.appendChild(instance.$el);

export default {
  install(Vue) {
    Vue.prototype.$modal = {
      open(title, message) {
        instance.open(title, message);
      },
      close() {
        instance.close();
      }
    };
  }
};
