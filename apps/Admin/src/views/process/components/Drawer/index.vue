<template>
  <j-drawer
    visible
    class="custom-class"
    title=""
    :closable="false"
    placement="right"
    @close="emits('update:visible', false)"
    :contentWrapperStyle="{ width: 'auto', minWidth: '50%', maxWidth: '66.6%' }"
  >
    <j-tabs v-model:activeKey="activeKey">
      <j-tab-pane key="form" tab="表单">
        <span v-for="item in formData">
          <h3>{{ item.name }}</h3>
          <preview ref="previewRef" :data="item.configuration" />
        </span>
      </j-tab-pane>
      <j-tab-pane key="flow" tab="流程图">
        <FlowDesigner readOnly :nodesData="nodesData" />
      </j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import { queryForm_api } from '@/api/process/model'
import preview from '@/components/FormDesigner/preview.vue'

interface EmitProps {
  (e: 'update:visible', flag: boolean): void
}

interface FormsProps {
  formId: string
  multiple: boolean
}

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<EmitProps>()

const activeKey = ref<string>('form')

// 表单
const formData = ref<any[]>([])
// 流程图
const nodesData = ref<any>({})

const init = () => {
  try {
    const obj = JSON.parse(props.data.model)
    nodesData.value = obj.nodes
    getFormData(obj.config.forms)
  } catch (error) {
    console.error(error)
  }
}

const getFormData = (list: FormsProps[]) => {
  const param = {
    terms: [
      {
        type: 'and',
        value: list.map((i) => i.formId),
        termType: 'in',
        column: 'id',
      },
    ],
  }
  queryForm_api(param).then((res) => {
    if (res.success) {
      formData.value = res.result.data
    }
  })
}
init()
</script>
