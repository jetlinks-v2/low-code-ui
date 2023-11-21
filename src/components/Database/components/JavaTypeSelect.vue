<template>
  <j-select
    showSearch
    v-model:value="myValue"
    style="width: 100%"
    :options="options"
    @change="change"
  >
  </j-select>
</template>

<script setup name="JavaTypeSelect">
import { inject } from 'vue'
import {TYPE_PROVIDE} from "@/components/Database/util";

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'change'])

const types = inject(TYPE_PROVIDE, [])
const options = ref([])
const myValue = ref()

const change = (key) => {
  myValue.value = key
  emit('update:value', key)
  emit('change', key)
}

watch(() => JSON.stringify(types.value), () => {
  if (types.value) {
    options.value = types.value.map(item => {
      return {
        label: item.javaType,
        value: item.javaType
      }
    })
  }
}, { immediate: true })

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

</script>

<style scoped>

</style>
