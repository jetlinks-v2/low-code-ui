<!-- 节点连接线新增按钮 -->
<template>
  <j-popover placement="right" trigger="click" v-model:visible="visible">
    <template #content>
      <div class="node-select">
        <div class="node-select-item approval" @click="handleAddApproval">
          <div class="node-icon">
            <AIcon type="UserOutlined" />
          </div>
          <span>审批节点</span>
        </div>
        <div class="node-select-item deal" @click="handleAddDeal">
          <div class="node-icon">
            <AIcon type="CarryOutOutlined" />
          </div>
          <span>办理节点</span>
        </div>
        <div
          class="node-select-item conditions"
          :class="{ disabled: isEmptyNode }"
          @click="handleAddConditions"
        >
          <div class="node-icon">
            <AIcon type="FunnelPlotOutlined" />
          </div>
          <span>条件分支</span>
        </div>
        <div
          class="node-select-item concurrents"
          :class="{ disabled: isEmptyNode }"
          @click="handleAddConcurrents"
        >
          <div class="node-icon">
            <AIcon type="ShareAltOutlined" />
          </div>
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
const isEmptyNode = inject('isEmptyNode')
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
  if (isEmptyNode) return
  visible.value = false
  emits('insertNode', 'CONDITIONS')
}
const handleAddConcurrents = () => {
  if (isEmptyNode) return
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
      //   background-color: #fff;
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
    &.concurrents {
      .node-icon {
        background: #1890ff;
      }
    }
    &.disabled {
      cursor: not-allowed;
      background: #f2f3f5;
      color: #999999;
      .node-icon {
        background: #999999;
      }
      &:hover {
        box-shadow: none;
      }
    }
  }
}
</style>
