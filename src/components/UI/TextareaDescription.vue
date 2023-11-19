<template>
    <div>
      <label :for="fieldId" class="form-label" id="label-text">Description:</label>
      <textarea
        :id="fieldId"
        v-model="localValue"
        @input="checkLength"
        placeholder="Enter text..."
      >
      </textarea>
      <p class="form-text" id="remain">
        Remaining characters: {{ remainingCharacters }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'textarea-description',
    data() {
      return {
        localValue: "",
        maxLength: 255,        
      };
    },
    computed: {
      remainingCharacters() {
        return this.maxLength - this.localValue.length;
      },
    },
    methods: {
      checkLength() {
        if (this.localValue.length > this.maxLength) {
          this.localValue = this.localValue.slice(0, this.maxLength);
        }
        this.$emit("update:modelValue", this.localValue);
      },
    },
  };
  </script>

  <style scoped>
    #label-text{
        text-align: left !important;
        font-weight: bold;
    }
    textarea {
        margin-top: 0;
        width: 100%;
    }
    textarea:hover {
        background-color: transparent;
    }
    #remain {
        text-align: left;
        margin: -5px auto 5px 5px;
    }
</style>