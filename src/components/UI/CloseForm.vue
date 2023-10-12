<template>
    <div class="close-form">
        <span class="close-simbol" @click="hideDialog"> &#x1F7AA; </span>             
    </div>
</template>

<script>
    export default {
        name: 'close-form',
    }
</script>

<style scoped>
  .close-form{
    position: absolute;
    top: 0;
    right: 0;        
    font-size: 24px;
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .close-simbol{
      margin-left: 12px;
  }
  .close-form:hover{
    color: red;
    /* font-weight: 00; */
  }
</style>