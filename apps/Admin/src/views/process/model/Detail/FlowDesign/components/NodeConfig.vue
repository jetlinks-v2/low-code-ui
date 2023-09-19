<!-- 节点配置 -->
<template>
  <component
    :is="componentsMap[(selectedNode.type || '').toUpperCase()]"
    :config="selectedNode.props"
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
// console.log('selectedNode: ', selectedNode.value)

const componentsMap = {
  APPROVAL: ApprovalNodeConfig,
  DEAL: DealNodeConfig,
  CONDITION: ConditionNodeConfig,
  CONDITIONS: ConditionsConfig,
  CONCURRENTS: ConcurrentsConfig,
}
</script>

<style lang="less" scoped></style>
