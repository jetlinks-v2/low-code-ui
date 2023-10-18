<!-- 流程设计 -->
<template>
  <FlowDesigner @selectNode="nodeSelected" @delNode="nodeDel" />

  <j-drawer
    destroyOnClose
    placement="right"
    :width="600"
    :visible="showConfig"
    :closable="false"
    @close="showConfig = false"
  >
    <!-- :title="title" -->
    <!-- <template #extra>
      <j-space>
        <j-button @click="showConfig = false">取消</j-button>
        <j-button type="primary" @click="handleSubmit">确定</j-button>
      </j-space>
    </template> -->

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

// const title = computed(() => {
//   return ['CONDITIONS', 'CONCURRENTS'].includes(selectedNode.value?.type)
//     ? '高级配置'
//     : selectedNode.value?.name
// })

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

// const handleSubmit = () => {
//   nodeConfigRef.value
//     .saveConfig()
//     .then((valid) => {
//       console.log('handleSubmit valid: ', valid)
//       showConfig.value = false
//     })
//     .catch((err) => {
//       console.log('handleSubmit err: ', err)
//     })
// }

/**
 * 下一步
 */
const next = () => {
  // 流程设计步骤, 无直接验证, 只有节点高级配置有验证
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

defineExpose({ next })
</script>

<style lang="less" scoped></style>
