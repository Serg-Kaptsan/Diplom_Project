<template>
  <select :value="modelValue" @input="changeOption">
    <option disabled value="">Sort by</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'my-select',
  props: {
    modelValue: {
      type: String
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeOption(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  },
  model:{
    prop: 'modelValue',
    event: 'update:modelValue'
  }
}
</script>

<style scoped>

</style>
