<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'my-button'
}
</script>

<style scoped>
.button {
  padding: 5px 15px;
  background: none;
  color: black;
  border: 2px solid teal;
  border-radius: 5px;
}
</style>
