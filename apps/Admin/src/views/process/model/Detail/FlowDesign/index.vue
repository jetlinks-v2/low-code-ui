<!-- 流程设计 -->
<template>
  <FlowDesigner
    ref="flowDesignerRef"
    @selectNode="nodeSelected"
    @delNode="nodeDel"
  />

  <j-drawer
    destroyOnClose
    placement="right"
    :width="600"
    :visible="showConfig"
    :closable="false"
    @close="showConfig = false"
  >
    <template v-if="isAdvanceConfig" #title> 高级配置 </template>
    <j-input
      v-if="!isAdvanceConfig"
      v-model:value="nodeName"
      placeholder="请输入"
      style="margin-bottom: 10px"
    />

    <NodeConfig ref="nodeConfigRef" />
  </j-drawer>
</template>

<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import NodeConfig from './components/NodeConfig.vue'
import { useFlowStore } from '@/store/flow'
import { findNodeById } from './components/utils'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

// 是否高级配置
const isAdvanceConfig = computed(() => {
  return ['CONDITIONS', 'CONCURRENTS'].includes(selectedNode.value?.type)
})

// 节点名称
const nodeName = computed({
  get: () => selectedNode.value?.name,
  set: (val) => {
    flowStore.selectedNode.name = val
  },
})

const flowDesignerRef = ref()
const nodeConfigRef = ref()
const showConfig = ref(false)
const nodeSelected = (node) => {
  console.log('节点选中', node)
  showConfig.value = true
}

/**
 * 删除审批节点时, 判断上一个节点是否是办理节点,
 * 并且props.freeChoiceUser是否是当前删除节点的id
 * 如果是则设置props.freeChoiceUser = undefined
 */
const nodeDel = (node) => {
  //   console.log('节点删除', node)
  const parentNode = findNodeById(flowStore.model.nodes, node.parentId)
  if (
    parentNode.type === 'DEAL' &&
    parentNode.props.freeChoiceUser === node.id
  ) {
    parentNode.props.freeChoiceUser = undefined
  }
}

/**
 * 关闭抽屉, 保存节点数据至store
 */
const saveNodeConfig = () => {
  nodeConfigRef.value
    .saveConfig()
    .then((valid) => {
      console.log('saveNodeConfig valid: ', valid)
      showConfig.value = false
    })
    .catch((err) => {
      console.log('saveNodeConfig err: ', err)
    })
}

watch(
  () => showConfig.value,
  (val) => {
    if (!val) saveNodeConfig()
  },
)

/**
 * 当前步骤校验方法
 */
const validateSteps = () => {
  return new Promise((resolve, reject) => {
    const err = flowDesignerRef.value.validateProcess()
    !err.length ? resolve(true) : reject(err)
  })
}

defineExpose({ validateSteps })
</script>

<style lang="less" scoped></style>
