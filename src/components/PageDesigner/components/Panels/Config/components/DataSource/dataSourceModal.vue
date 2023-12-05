<template>
  <j-modal visible title="数据源配置" width="800px" @ok="onSave" @cancel="onCancel">
    <dataSourceConfig ref="formRef" :value="data" />
  </j-modal>
</template>

<script setup name="DataSourceModal">
import dataSourceConfig from './dataSourceConfig.vue'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel'])
const formRef = ref()
const onSave = () => {
  formRef.value?.onSave().then(res => {
    if (res) {
      emit('save', res)
    }
  })
}

const onCancel = () => {
  emit('cancel')
}
</script>
