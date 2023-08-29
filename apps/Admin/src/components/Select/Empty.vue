<template>
  <j-select
    v-model:value="myValue"
    show-search
    mode="multiple"
    style="width: 100%"
    max-tag-count="responsive"
    @change="handleChange"
  >
    <j-select-option value="null" :disabled="myValue.length &&!disabled" >无</j-select-option>
    <j-select-option v-for="item in _options.value" :value="item.value" :disabled="disabled">{{ item.label }}</j-select-option>
  </j-select>
</template>

<script setup name="EmptySelect">

const props = defineProps({
  options: {
    type: Array,
    default: () => ([])
  },
  value: {
    type: Array,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'change'])

const _options = reactive({ value: []})

const myValue = ref([])
const disabled = computed(() => {
  return myValue.value.includes('null')
})

const handleChange = (key) => {
  const hasNull = key.includes('null')
  myValue.value = hasNull ? ['null'] : key
  emit('update:value', hasNull ? undefined : key)
  emit('change', hasNull ? undefined : key)
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value || ['null']
}, { immediate: true })

watch(() => JSON.stringify(props.options), () => {
  _options.value = props.options || []

}, { immediate: true })
</script>

<style scoped>

</style>
