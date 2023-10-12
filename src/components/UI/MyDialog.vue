<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div @click.stop class="dialog__content">
      <div class="close-form">
          <span class="close-simbol" @click="hideDialog"> &#x1F7AA; </span>             
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import showMixin from "@/mixins/showMixin";

export default {
  name: 'my-dialog',
  mixins: [showMixin],
}
</script>

<style scoped>
  .dialog {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
  }

  .dialog__content {
    position: relative;
    margin: 100px auto auto;
    background: white;
    border-radius: 12px;
    min-height: 200px;
    min-width: 350px;
    padding: 20px;
  }
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
  }
</style>