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
  CONDITION: ConditionNodeConfig,
  CONDITIONS: ConditionsConfig,
  CONCURRENTS: ConcurrentsConfig,
}

const nodeConfigRef = ref()
const saveConfig = () => {
  nodeConfigRef.value.saveConfigToPinia()
}

defineExpose({
  saveConfig,
})
</script>

<style lang="less" scoped></style>
