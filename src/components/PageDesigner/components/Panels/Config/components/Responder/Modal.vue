<template>
  <j-modal
    visible
    title="配置响应器"
    width="800px"
    @ok="onSave"
    @cancel="onCancel"
  >
    <j-form
        layout="vertical"
        ref="formRef"
        :model="formModel"
    >
      <j-form-item
        label="数据源"
        name="request"
      >
        <j-input />
      </j-form-item>
      <j-form-item
        label="响应器"
      >
        <Responder />
      </j-form-item>
    </j-form>

  </j-modal>
</template>

<script setup name="ResponderModal">
import Responder from './Responder.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel'])

const formModel = reactive({
  request: ''
})

const onSave = () => {
  emit('save')
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
