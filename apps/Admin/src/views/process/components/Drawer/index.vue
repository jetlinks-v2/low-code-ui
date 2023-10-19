<template>
  <j-drawer
    visible
    class="custom-class"
    title="流程详情"
    :closable="false"
    placement="right"
    @close="emits('update:visible', false)"
    :contentWrapperStyle="{ width: 'auto', minWidth: '50%', maxWidth: '66.6%' }"
  >
    <j-tabs v-model:activeKey="activeKey">
      <j-tab-pane key="form">
        <template #tab>
          <div>
            <j-button :type="activeKey === 'form' ? 'primary' : 'text'"
              >表单</j-button
            >
          </div>
        </template>
        <div class="content">
          <div v-for="item in formData">
            <div class="title">{{ item.name }}</div>
            <preview ref="previewRef" :data="item.configuration" />
          </div>
        </div>
      </j-tab-pane>
      <j-tab-pane key="flow">
        <template #tab>
          <div>
            <j-button :type="activeKey === 'flow' ? 'primary' : 'text'"
              >流程图</j-button
            >
          </div>
        </template>
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
  } catch (error) {}
}

const getFormData = (list: FormsProps[]) => {
  const param = {
    paging: true,
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
<style lang="less" scoped>
:deep(.ant-tabs) {
  border: 1px solid #f0f0f0;
  .ant-tabs-nav {
    padding-left: 16px;

    background: #f9f9f9;
  }
  .ant-tabs-content {
    padding: 0 24px 24px 24px;
  }
  .ant-tabs-ink-bar {
    background-color: transparent;
  }
}
.content {
  background: #fafafa;
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #333333;
  }
  :deep(.canvas-box) {
    background: #fafafa;
    .container {
      background: #fafafa;
    }
  }
}
</style>
