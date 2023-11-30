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
            :options="options"
        />
      </j-form-item>
      <j-form-item
          v-if="showResponder"
        label="响应器"
        name="responder"
      >
        <Responder v-model:value="formModel.responder" />
      </j-form-item>
    </j-form>

  </j-modal>
</template>

<script setup name="ResponderModal">
import Responder from './Responder.vue'

import { usePageProvider } from '../../../../../hooks'

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

const page = usePageProvider()

const formModel = reactive({
  request: props.data?.request,
  dependencies: props.data?.dependencies,
  responder: props.data?.responder
})

const showDataSource = computed(() => {
  return !['proTable'].includes(props.type)
})

const showResponder = computed(() => {
  return !['proTable'].includes(props.type)
})

const options = computed(() => {
  // 过滤自己
  return Object.keys(designer.dependencies.value).filter(key => key !== props.id).map((key) => {
    return {
      label: designer.dependencies.value[key],
      value: key
    }
  })
})

const onSave = () => {
  console.log('onSave', formModel)
  emit('save', formModel)
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
