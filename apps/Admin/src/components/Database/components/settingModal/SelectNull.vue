<template>
  <j-select
    allowClear
    :options="rulesOptions"
    v-model:value="myValue"
    @change="change"
  />
</template>

<script setup name="SelectNull">

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  value: {
    type: [Number,String],
    value: undefined
  }
})

const emit = defineEmits(['update:value', 'change'])

const myValue = ref()
const undefinedValue = 'undefined'
const rulesOptions = computed(() => {
  return [
    {
      label: '空',
      value: undefinedValue
    },
    ...(props.options || [])
  ]
})

const change = (e) => {
  const _value = e === undefinedValue ? undefined : e
  emit('update:value', _value)
  emit('change', _value)
}

watch(() => props.value, () => {
  myValue.value = props.value ? props.value : undefinedValue
}, { immediate: true })

</script>

<style scoped>

</style>
