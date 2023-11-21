<!-- 节点配置 -->
<template>
  <component
    ref="nodeConfigRef"
    :is="componentsMap[(selectedNode.type || '').toUpperCase()]"
    :node="selectedNode"
  />
</template>

<script setup lang="ts">
import { useFlowStore } from '@LowCode/store/flow'
import ApprovalNodeConfig from './ApprovalNodeConfig.vue'
import DealNodeConfig from './DealNodeConfig.vue'
import ConditionNodeConfig from './ConditionNodeConfig.vue'
import ConditionsConfig from './ConditionsConfig.vue'
import ConcurrentsConfig from './ConcurrentsConfig.vue'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

const componentsMap = {
  APPROVAL: ApprovalNodeConfig,
  DEAL: DealNodeConfig,
  ROOT: DealNodeConfig, // 根节点配置同处理节点
  CONDITION: ConditionNodeConfig,
  CONDITIONS: ConditionsConfig,
  CONCURRENTS: ConcurrentsConfig,
}

const nodeConfigRef = ref()

/**
 * 保存配置
 */
const saveConfigToStore = () => {
  return nodeConfigRef.value.saveConfigToStore()
}

/**
 * 校验配置
 */
const validateConfig = () => {
  return nodeConfigRef.value.validateConfig()
}
const memberSubmit = () => {
  if (
    selectedNode.value.type === 'DEAL' ||
    selectedNode.value.type === 'APPROVAL'
  ) {
    nodeConfigRef.value?.memberSubmit()
  }
}
defineExpose({
  saveConfigToStore,
  validateConfig,
  memberSubmit,
})
</script>

<style lang="less" scoped>
:deep(
    .ant-collapse-icon-position-right
      > .ant-collapse-item
      > .ant-collapse-header
  ) {
  background: #fafafa;
  padding: 10px 20px;
}
:deep(.ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content) {
  background-color: #fff;
}
:deep(.title) {
  margin-bottom: 0;
}
:deep(.ant-collapse-borderless > .ant-collapse-item) {
  border-bottom: none;
}
</style>
