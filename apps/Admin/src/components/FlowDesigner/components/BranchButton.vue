<!-- 分支/条件按钮 -->
<template>
  <j-popover placement="right" trigger="click" v-model:visible="visible">
    <template #content>
      <div class="node-select">
        <div
          class="node-select-item conditions"
          @click="handleAddBranch"
          v-if="isConditionNode"
        >
          <AIcon type="ShareAltOutlined" />
          <span>添加分支</span>
        </div>
        <div
          class="node-select-item approval"
          @click="handleAddApproval"
          v-if="!isConditionNode"
        >
          <AIcon type="ShareAltOutlined" />
          <span>审批节点</span>
        </div>
        <div
          class="node-select-item deal"
          @click="handleAddDeal"
          v-if="!isConditionNode"
        >
          <AIcon type="SendOutlined" />
          <span>办理节点</span>
        </div>
        <div class="node-select-item config" @click="handleOpenConfig">
          <AIcon type="SettingOutlined" />
          <span>高级配置</span>
        </div>
      </div>
    </template>
    <j-button type="plain"> {{ text }} </j-button>
  </j-popover>
</template>

<script setup lang="ts" name="BranchButton">
import { useFlowStore } from '@/store/flow'
import { computed } from 'vue'

const emits = defineEmits(['addBranchNode', 'openConfig'])
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  isConditionNode: {
    type: Boolean,
    default: false,
  },
})

const flowStore = useFlowStore()

const selectedNode = computed(() => flowStore.selectedNode)

const visible = ref(false)
const handleAddBranch = () => {
  visible.value = false
  emits('addBranchNode', 'CONDITIONS')
}
const handleAddApproval = () => {
  visible.value = false
  emits('addBranchNode', 'APPROVAL')
}
const handleAddDeal = () => {
  visible.value = false
  emits('addBranchNode', 'DEAL')
}
const handleOpenConfig = () => {
  visible.value = false
  emits('openConfig')
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
    &.config {
      background: #f2f2f2;
    }
  }
}
</style>
