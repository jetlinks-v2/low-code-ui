<!-- 节点连接线新增按钮 -->
<template>
  <j-popover placement="right" trigger="click" v-model:visible="visible">
    <template #content>
      <div class="node-select">
        <div class="node-select-item approval" @click="handleAddApproval">
          <AIcon type="ShareAltOutlined" />
          <span>审批节点</span>
        </div>
        <div class="node-select-item deal" @click="handleAddDeal">
          <AIcon type="SendOutlined" />
          <span>办理节点</span>
        </div>
        <div class="node-select-item conditions" @click="handleAddConditions">
          <AIcon type="ShareAltOutlined" />
          <span>条件分支</span>
        </div>
        <div class="node-select-item concurrents" @click="handleAddConcurrents">
          <AIcon type="MenuOutlined" />
          <span>并行分支</span>
        </div>
      </div>
    </template>
    <j-button type="primary" shape="circle">
      <template #icon>
        <AIcon type="PlusOutlined" />
      </template>
    </j-button>
  </j-popover>
</template>

<script setup lang="ts" name="InsertButton">
import { useFlowStore } from '@/store/flow'
import { computed } from 'vue'

const emits = defineEmits(['insertNode'])
const flowStore = useFlowStore()

const selectedNode = computed(() => flowStore.selectedNode)

const visible = ref(false)
const handleAddApproval = () => {
  visible.value = false
  emits('insertNode', 'APPROVAL')
}
const handleAddDeal = () => {
  visible.value = false
  emits('insertNode', 'DEAL')
}
const handleAddConditions = () => {
  visible.value = false
  emits('insertNode', 'CONDITIONS')
}
const handleAddConcurrents = () => {
  visible.value = false
  emits('insertNode', 'CONCURRENTS')
}
</script>

<style lang="less" scoped>
.node-select {
  display: flex;
  gap: 10px;
  .node-select-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 15px;
    border: 1px solid #f8f9f9;
    background-color: #f8f9f9;
    border-radius: 5px;
    &:hover {
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    &.approval {
      background: #facd91;
    }
    &.deal {
      background: #caf982;
    }
    &.conditions {
      background: #debaff;
    }
    &.concurrents {
      background: #ffffbb;
    }
  }
}
</style>
