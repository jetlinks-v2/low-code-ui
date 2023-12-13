<template>
  <div class="box">
    <j-button @click="onClick(false)">-</j-button>
    <j-input-number
        v-bind="_props"
        :value="_value"
        :controls="false"
        @change="onChange"
    />
    <j-button @click="onClick(true)">+</j-button>
  </div>
</template>

<script setup lang="ts">
import {omit} from "lodash-es";

const props = defineProps({
  value: {
    type: Number
  },
  precision: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: String
  },
  parser: {
    type: String
  },
  max: {
    type: Number,
  },
  min: {
    type: Number,
  },
  size: {
    type: String
  },
  step: {
    type: Number,
    default: 1
  },
  placeholder: {
    type: String,
  }
})
const emits = defineEmits(['update:value', 'change'])

const _value = computed(() => {
  return props.value || 0
})

const _props = computed(() => {
  if(props.formatter && props.parser){
    return {
      ...omit(props, ['formatter', 'value', 'parser']),
      formatter: new Function('value', 'info', props.formatter),
      parser: new Function('value', props.parser),
    }
  }
  return omit(props, ['formatter', 'value', 'parser'])
})

const onChange = (_val: number) => {
  emits('update:value', _val)
}

const onClick = (flag: boolean) => {
  const _step = props?.step || 1
  if(flag){
    const __value = (_value?.value || 0) + _step
    if(props.max !== undefined && props.max !== null && __value > props.max){
      emits('update:value', props.max)
      emits('change', props.max)
    } else {
      emits('update:value', __value)
      emits('change', __value)
    }
  } else {
    const __value = (_value?.value || 0) - _step
    if(props.min !== undefined && props.min !== null && __value < props.min){
      emits('update:value', props.min)
      emits('change', props.min)
    } else {
      emits('update:value', __value)
      emits('change', __value)
    }
  }
}
</script>

<style scoped lang="less">
.box {
  display: flex;
  gap: 6px
}
</style>