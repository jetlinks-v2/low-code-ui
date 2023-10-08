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
        <div class="pane-content">
          <span v-for="item in formData">
            <h3>{{ item.name }}</h3>
            <preview ref="previewRef" :data="item.configuration" />
          </span>
          <j-tag class="state" color="#2db7f5">申办中</j-tag>
        </div>
      </j-tab-pane>
      <j-tab-pane key="flow" tab="流程图">
        <div class="pane-content">
          <FlowDesigner readOnly :nodesData="nodesData" />
          <j-tag class="state" color="#2db7f5">申办中</j-tag>
        </div>
      </j-tab-pane>
      <j-tab-pane v-if="showRecords" key="records" tab="流转记录">
        <div class="pane-content">
          <j-timeline>
            <j-timeline-item>
              <div>
                <div class="item-title">
                  <div>发起流程</div>
                  <div>2023年9月21日15:16:35</div>
                </div>
                <div><AIcon type="UserOutlined" />发起人名称</div>
              </div>
            </j-timeline-item>
            <j-timeline-item>
              <div>
                <div>审批结点 2023年9月21日15:16:35</div>
                <div><AIcon type="UserOutlined" />发起人名称</div>
                <div>审批意见</div>
              </div>
            </j-timeline-item>
            <j-timeline-item>Technical testing 2015-09-01</j-timeline-item>
            <j-timeline-item
              >Network problems being solved 2015-09-01</j-timeline-item
            >
          </j-timeline>
          <j-tag class="state" color="#87d068">已办结</j-tag>
        </div>
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
  showRecords: {
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
<style scoped lang="less">
.pane-content {
  position: relative;
  .state {
    position: absolute;
    top: 0;
    right: 0;
    transform: rotate(35deg);
  }

  .item-title{
    display: flex;
    justify-content: space-between;
  }
}
</style>
