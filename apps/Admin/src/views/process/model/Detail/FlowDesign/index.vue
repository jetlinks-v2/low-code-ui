<!-- 流程设计 -->
<template>
  <FlowDesigner @selectNode="nodeSelected" />

  <j-drawer
    :width="500"
    :title="title"
    placement="right"
    :visible="showConfig"
    @close="showConfig = false"
  >
    <template #extra>
      <j-space>
        <j-button @click="showConfig = false">取消</j-button>
        <j-button type="primary" @click="handleSubmit">确定</j-button>
      </j-space>
    </template>

    <NodeConfig ref="nodeConfigRef" />
  </j-drawer>
</template>

<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import NodeConfig from './components/NodeConfig.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

const title = computed(() => {
  return ['CONDITIONS', 'CONCURRENTS'].includes(selectedNode.value?.type)
    ? '高级配置'
    : selectedNode.value?.name
})

const nodeConfigRef = ref()
const showConfig = ref(false)
const nodeSelected = (node) => {
  console.log('配置节点', node)
  showConfig.value = true
}

const handleSubmit = () => {
  nodeConfigRef.value.saveConfig()
  showConfig.value = false
}
</script>

<style lang="less" scoped></style>
