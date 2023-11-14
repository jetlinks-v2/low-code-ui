<template>
  <j-drawer
    visible
    class="custom-class"
    title="流程详情"
    :closable="false"
    width="50%"
    placement="right"
    @close="emits('update:visible', false)"
  >
    <!-- :contentWrapperStyle="{ width: 'auto', minWidth: '50%', maxWidth: '66.6%' }" -->
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
          <!-- <j-scrollbar style="height: calc(100vh - 225px)"> -->
            <div v-for="item in formData">
              <div class="title">
                <j-space>
                  <img
                    :src="getImage(`/flow-designer/preview-form.png`)"
                    style="height: 16px"
                  />
                  <span>
                    {{ item.formName }}
                  </span>
                </j-space>
              </div>
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
          <!-- </j-scrollbar> -->
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
        <FlowDesigner
          readOnly
          dragging
          :nodesData="nodesData"
          style="height: calc(100vh - 225px)"
        />
      </j-tab-pane>
    </j-tabs>
    <!-- </j-scrollbar> -->
  </j-drawer>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import FormPreview from '@/components/FormDesigner/preview.vue'
import TableFormPreview from '@/views/process/model/Detail/FlowDesign/components/TableFormPreview.vue'
import { getImage } from '@jetlinks/utils'
import { queryFormNoPage_api } from '@/api/process/model'
import {handleRules} from "@/components/FormDesigner/hooks/useProps";

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
  type: {
    type: String,
    default: '',
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
  const _columns = fields?.map((m) => {

    return {
      title: m.formItemProps?.label,
      dataIndex: m.formItemProps?.name,
      ellipsis: true,
      // formId,
      width: 200,
      ...m,
      form: {
        rules: handleRules(m)
      },
    }
  })
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
    if (props.data.state.value === 'undeployed') {
      getFormData(obj.config.forms)
    } else {
      formData.value = obj.config.forms
    }
  } catch (error) {}
}

const getFormData = (list: FormsProps[]) => {
  const param = {
    terms: [
      {
        type: 'and',
        value: list.map((i) => i.formId),
        termType: 'in',
        column: 'key',
      },
      {
        value: 'true',
        termType: 'eq',
        type: 'and',
        column: 'latest',
      },
      // 过滤未配置的表单
      {
        value: '',
        termType: 'notnull',
        column: 'configuration',
      },
      {
        value: {},
        termType: 'not',
        column: 'configuration',
      },
    ],
  }
  queryFormNoPage_api(param).then((res) => {
    if (res.success) {
      formData.value = list.map((item) => {
        const row = res.result.find((m) => m.key === item.formId)
        return {
          ...item,
          formId: row.key,
          formName: row.name,
          // 表单完整信息: 仅供前端使用
          fullInfo: row,
        }
      })
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
