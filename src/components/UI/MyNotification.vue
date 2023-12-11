<template>
  <div class="notification" v-if="isVisible">
    {{ notificationMessage }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      notificationMessage: '',
    };
  },
  methods: {
    showNotification(message) {
      this.notificationMessage = message;
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 3500);
    },
  },
};
</script>

<style scoped>
  .notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(22, 112, 39, 0.8);
    color: white;
    padding: 35px 20px;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    z-index: 5;
  }
</style>