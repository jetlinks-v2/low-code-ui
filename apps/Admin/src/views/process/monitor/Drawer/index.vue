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
      <j-tab-pane key="form">
        <template #tab>
          <div>
            <j-button :type="activeKey === 'form' ? 'primary' : 'text'"
              >表单</j-button
            >
          </div>
        </template>
        <div class="pane-content">
          <div v-for="item in formData">
            <div class="title">{{ item.formName }}</div>
            <preview
              ref="previewRef"
              :data="item.configuration"
              :value="item.data"
            />
          </div>
          <div class="state">
            <ProImage
              :width="146"
              :height="120"
              :src="getImage(`/me/${state.value}.png`)"
              :preview="false"
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
        <div class="pane-content">
          <FlowDesigner readOnly :nodesData="nodesData" />
          <div class="state">
            <ProImage
              :width="146"
              :height="120"
              :src="getImage(`/me/${state.value}.png`)"
              :preview="false"
            />
          </div>
        </div>
      </j-tab-pane>
      <j-tab-pane key="records">
        <template #tab>
          <div>
            <j-button :type="activeKey === 'records' ? 'primary' : 'text'"
              >流转记录</j-button
            >
          </div>
        </template>
        <div class="pane-content">
          <FlowHistory :info="info" />
        </div>
      </j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import { getDetail_api } from '@/api/process/monitor'
import preview from '@/components/FormDesigner/preview.vue'
import { getImage } from '@jetlinks/utils'
import FlowHistory from '@/views/process/me/Detail/components/FlowHistory.vue'

interface EmitProps {
  (e: 'update:visible', flag: boolean): void
}

interface stateProps {
  text: string
  value: string
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

const state: Ref<stateProps> = ref({
  text: '',
  value: '',
})

// 表单
const formData = ref<any[]>([])
// 流程图
const nodesData = ref<any>({})

const info = ref<any>({})

const init = () => {
  // 获取详情
  getDetail_api(props.data.id).then((res: any) => {
    if(res.success){    
      formData.value = res.result.form
      state.value = res.result.state
      info.value = res.result
      try {
        const obj = JSON.parse(res.result.modelContent)
        nodesData.value = obj.nodes
      } catch (error) {}
    }
  })
}

init()
</script>
<style scoped lang="less">
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
.pane-content {
  position: relative;
  background: #fafafa;
  .title {
    padding: 24px 24px 0 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #333333;
  }
  .state {
    position: absolute;
    top: 0;
    right: 0;
  }

  :deep(.canvas-box) {
    background: #fafafa;
    .container {
      background: #fafafa;
    }
  }
}
</style>
