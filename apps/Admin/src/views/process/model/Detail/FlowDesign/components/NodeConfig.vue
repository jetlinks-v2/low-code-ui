<!-- 节点配置 -->
<template>
  <component
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
// onMounted(() => {
//   console.log('selectedNode: ', selectedNode.value)
// })
// watch(
//   () => selectedNode.value,
//   (val) => {
//     console.log('selectedNode: ', val)
//     provide('nodeConfig', val.props)
//   },
//   { deep: true },
// )

const componentsMap = {
  APPROVAL: ApprovalNodeConfig,
  DEAL: DealNodeConfig,
  CONDITION: ConditionNodeConfig,
  CONDITIONS: ConditionsConfig,
  CONCURRENTS: ConcurrentsConfig,
}
</script>

<style lang="less" scoped></style>
