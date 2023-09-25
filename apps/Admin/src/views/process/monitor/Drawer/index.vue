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
      <j-tab-pane key="form" tab="表单"> 表单页 </j-tab-pane>
      <j-tab-pane key="flow" tab="流程图">
        <FlowDesigner readOnly />
      </j-tab-pane>
      <j-tab-pane key="records" tab="流转记录">
        <j-timeline>
          <j-timeline-item>
            <div>
              <div>发起流程 2023年9月21日15:16:35</div>
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
          <j-timeline-item>Network problems being solved 2015-09-01</j-timeline-item>
        </j-timeline>
      </j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'

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
const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
}>()

const activeKey = ref<string>('form')
</script>
<style scoped lang="less"></style>
