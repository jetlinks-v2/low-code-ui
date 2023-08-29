<template>
  <j-select v-model:value="myValue" @change="change">
    <j-select-option key="false" >{{ falseText }}</j-select-option>
    <j-select-option key="true" >{{ trueText }}</j-select-option>
  </j-select>
</template>

<script setup name="BooleanSelect">

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  falseText: {
    type: String,
    default: '否'
  },
  trueText: {
    type: String,
    default: '是'
  },
  falseValue: {
    type: [String, Number],
    default: false
  },
  trueValue: {
    type: [String, Number],
    default: true
  }
})

const emit = defineEmits(['update:value', 'change'])

const myValue = ref()

const change = (key) => {
  myValue.value = key
  const _value = key === 'false' ? props.falseValue : props.trueValue
  emit('update:value', _value)
  emit('change', _value)
}

watch(() => props.value, () => {
  myValue.value = props.value === props.trueValue ? 'true' : 'false'
}, { immediate: true })
</script>

<style scoped>

</style>
