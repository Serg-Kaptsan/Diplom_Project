<template>
  <div class="close-form">
    <img 
      class="close-simbol"
      title="close form"
      :src="isHovered ? '/close-red.png' : '/close.png'"
      alt="close"
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
      @click="hideDialog"
    >
  </div>
</template>

<script>
  export default {
    name: 'close-form',
    data() {
      return {
        isHovered: false,
      };
    }
  }

</script>

<style scoped>
  .close-form{
    position: absolute;
    top: 0;
    right: 0;        
    font-size: 14px;
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .close-form img {
    margin: 12px;
    width: 14px;
    height: 14px;
  }
</style>