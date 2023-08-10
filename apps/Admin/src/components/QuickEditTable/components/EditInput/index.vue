<template>
  <j-input
    type="text"
    class="edit-input"
    v-model:value="inputValue"
    @input="onInput"
    @blur="onBlur"
    @click="onClick"
  />
</template>

<script setup lang="ts" name="EditInput">
import { ref } from 'vue'
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  setValue: {
    type: Function,
    default: () => {},
  },
})

const inputValue = ref(props.value)

const onInput = (e: Event) => {
  inputValue.value = (e.target as HTMLInputElement).value.trim()
}

const onClick = (e: Event) => {
  e.stopPropagation()
}

const onBlur = () => {
  props.setValue(inputValue.value)
}
</script>

<style lang="less" scoped>
.edit-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // border: 1px solid orange;
}
</style>
