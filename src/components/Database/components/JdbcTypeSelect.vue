<template>
  <j-select
    showSearch
    v-model:value="myValue"
    style="width: 100%"
    :options="options"
    :disabled="disabled"
    @change="change"
  >
  </j-select>
</template>

<script setup name="JdbcTypeSelect">
import { inject } from 'vue'
import {TYPE_PROVIDE} from "@LowCode/components/Database/util";

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  javaType: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
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

watch(() => [JSON.stringify(types.value), props.javaType], () => {
  if (types.value && props.javaType) {
    const typeItem = types.value.find(item => item.javaType === props.javaType)
    if (typeItem) {
      options.value = typeItem.jdbcTypes.map(key => ({ label: key, value: key }))
    }
  } else {
    options.value = []
  }
}, { immediate: true })

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

</script>

<style scoped>

</style>
