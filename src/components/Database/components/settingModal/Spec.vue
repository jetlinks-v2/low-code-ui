<template>
  <j-card-select v-model:value="myValue" :options="DataActions" :column="2" :showImage="false" :multiple="true" @change="change"/>
</template>

<script setup name="SettingSpec">
import { DataActions } from "@LowCode/components/Database/util";

const emit = defineEmits(['update:value'])

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const myValue = ref([])

const change = (v) => {
  const spec = {
    ...props.value,
    canImport: v.includes('canImport'),
    canExport: v.includes('canExport'),
  }
  emit('update:value', spec)
}

watch(() => JSON.stringify(props.value), () => {
  console.log(props.value)
  if (props.value.canImport) {
    myValue.value.push('canImport')
  }

  if (props.value.canExport) {
    myValue.value.push('canExport')
  }
}, { immediate: true })

</script>

<style scoped>

</style>
