<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      title: '',
      message: ''
    };
  },
  methods: {
    open(title, message) {
      this.title = title;
      this.message = message;
      this.visible = true;
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}
</style>
