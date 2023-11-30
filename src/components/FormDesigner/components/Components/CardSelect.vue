<template>
  <CardSelect
    v-model:value="_value"
    @change="onChange"
    :options="_options"
    :disabled="disabled"
    :multiple="multiple"
  />
</template>

<script lang="ts" setup>
import { CardSelect } from 'jetlinks-ui-components'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Array],
    default: undefined,
  },
})
const emit = defineEmits(['update:value', 'change'])
const _value = ref()

const _options = computed(() => {
  return props?.options || []
})

watch(
  () => props.value,
  () => {
    if (props.multiple) {
      _value.value = Array.isArray(props?.value) ? props.value : []
    } else {
      _value.value = Array.isArray(props?.value)
        ? props.value?.[0]
        : props.value
    }
  },
  { deep: true, immediate: true },
)
const onChange = (val: any) => {
  let __value = undefined
  if (props.multiple) {
    __value = Array.isArray(val) ? val : []
  } else {
    __value = Array.isArray(val) ? val?.[0] : val
  }
  emit('update:value', __value)
  emit('change', __value)
}
</script>