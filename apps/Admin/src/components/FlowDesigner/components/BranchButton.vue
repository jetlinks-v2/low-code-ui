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
          <div class="node-icon">
            <AIcon type="FunnelPlotOutlined" />
          </div>
          <span>添加分支</span>
        </div>
        <div
          class="node-select-item approval"
          @click="handleAddApproval"
          v-if="!isConditionNode"
        >
          <div class="node-icon">
            <AIcon type="UserOutlined" />
          </div>
          <span>审批节点</span>
        </div>
        <div
          class="node-select-item deal"
          @click="handleAddDeal"
          v-if="!isConditionNode"
        >
          <div class="node-icon">
            <AIcon type="CarryOutOutlined" />
          </div>
          <span>办理节点</span>
        </div>
        <div class="node-select-item config" @click="handleOpenConfig">
          <div class="node-icon">
            <AIcon type="SettingOutlined" />
          </div>
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
    background: #f2f3f5;
    border-radius: 5px;
    .node-icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 6px;
    }
    &:hover {
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    &.approval {
      .node-icon {
        background: #fcab34;
      }
    }
    &.deal {
      .node-icon {
        background: #4fc971;
      }
    }
    &.conditions {
      .node-icon {
        background: #ab62ee;
      }
    }
    &.config {
      .node-icon {
        background: #999999;
      }
    }
  }
}
</style>
