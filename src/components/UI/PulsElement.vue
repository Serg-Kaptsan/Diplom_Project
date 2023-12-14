<template>
    <div :class="{ pulse: isPulsating }">
        Loading
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isPulsating: true,
      };
    },
  };
  </script>

<style scoped>
    .pulse {
        animation: pulseAnimation 1.5s infinite;
        font-size: 24px;
        font-weight: 500;
        color: rgb(16, 63, 219);
    }

    @keyframes pulseAnimation {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        25% {
            transform: scale(1.2);
            opacity: 0.9;
        }
        50% {
            transform: scale(1.4);
            opacity: 1;
        }
        75% {
            transform: scale(1.2);
            opacity: 0.9;
        }
        100% {
            transform: scale(1);
            opacity: 0.8;
        }
    }
</style>
  