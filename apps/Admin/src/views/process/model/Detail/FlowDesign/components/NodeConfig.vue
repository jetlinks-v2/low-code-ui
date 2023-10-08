<!-- 节点配置 -->
<template>
  <component
    ref="nodeConfigRef"
    :is="componentsMap[(selectedNode.type || '').toUpperCase()]"
    :node="selectedNode"
  />
</template>

<script setup lang="ts">
import { useFlowStore } from '@/store/flow'
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
const saveConfig = () => {
  nodeConfigRef.value.saveConfigToPinia()
}

defineExpose({
  saveConfig,
})
</script>

<style lang="less" scoped></style>
