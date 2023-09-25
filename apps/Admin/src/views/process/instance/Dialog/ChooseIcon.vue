<template>
  <div>
    <j-radio-group v-model:value="selected" class="radio" @change="change">
      <j-radio-button
        v-for="typeStr in iconKeys"
        :value="typeStr"
        :key="typeStr"
        :class="{ active: selected === typeStr }"
      >
        <AIcon :type="typeStr" />
      </j-radio-button>
    </j-radio-group>
  </div>
</template>
<script setup>
import iconKeys from './fields'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const selected = ref()
const change = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>
<style scoped lang="less">
.radio {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, 1fr);
  max-height: 500px;
  overflow-y: auto;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    font-size: 40px;
    border: 2px solid #efefef;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: #415ed1;
      border-color: #415ed1;
    }
  }
}
</style>
