<template>
  <j-modal
      visible
      title="配置响应器"
      width="1000px"
      @ok="onSave"
      @cancel="onCancel"
  >
    <j-form
        layout="vertical"
        ref="formRef"
        :model="formModel"
    >
      <j-form-item
          label="依赖项"
          name="dependencies"
      >
        <j-select
            v-model:value="formModel.dependencies"
            placeholder="请选择依赖项"
            mode="tags"
        >
          <j-select-option v-for="item in options" :value="item.value">{{item.label}}({{item.value}})</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
          label="响应器"
          name="responder"
      >
        <Responder v-model:value="formModel.responder"/>
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
  },
  type: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['save', 'cancel'])
const designer = inject('PageDesigner')

const formModel = reactive({
  request: props.data?.request,
  dependencies: props.data?.dependencies,
  responder: props.data?.responder
})

const options = computed(() => {
  // 过滤自己
  return designer.pubsub?.value?.filter(item => item?.value !== props.id)
})

const onSave = () => {
  emit('save', formModel)
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
