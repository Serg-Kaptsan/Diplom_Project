<template>
    <div class="large-image"
        v-if="product">
        <img :src="'data:image/jpeg;base64,' + product.imageData" :alt="product.name"
          
        />
    </div>
  </template>
  
  <script>
    export default {
      data() {
        return {
          product: null,
        };
      },
      created() {
        this.product = {
          imageData: this.$route.params.imageData
        };
      },
    }
  </script>
  
  <style scoped>
  .large-image {
    position: fixed;
    top: 30px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .large-image img {
    max-width: 90%;
    max-height: 90%;
  }
  </style>