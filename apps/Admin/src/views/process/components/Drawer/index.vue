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
    <!-- <j-scrollbar> -->
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
              <div class="title">{{ item.formName }}</div>
              <FormPreview
                v-if="!item.multiple"
                :data="item.fullInfo.configuration"
              />
              <TableFormPreview
                v-else
                v-model:data-source="tableData"
                :columns="
                  getTableColumns(item.fullInfo?.configuration?.children)
                "
              />
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
    <!-- </j-scrollbar> -->
  </j-drawer>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import FormPreview from '@/components/FormDesigner/preview.vue'
import TableFormPreview from '@/views/process/model/Detail/FlowDesign/components/TableFormPreview.vue'

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

const tableData = ref<any>([{}])
const getTableColumns = (fields: any[]) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    // formId,
    ...m,
  }))
  _columns?.forEach((item) => {
    tableData.value[0][item.dataIndex] = undefined
  })
  console.log('_columns', _columns)
  return _columns
}

const init = () => {
  try {
    const obj = JSON.parse(props.data.model)
    nodesData.value = obj.nodes
    formData.value = obj.config.forms
  } catch (error) {}
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
    padding: 0 12px 12px 12px;
  }
  .ant-tabs-ink-bar {
    background-color: transparent;
  }
}
.content {
  background: #fafafa;
  .title {
    padding: 16px;
    // text-align: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #333333;
  }
  :deep(.container) {
      background: #fafafa;
    }
}
</style>
