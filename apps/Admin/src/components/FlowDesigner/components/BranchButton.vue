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
    <div class="branch-box">
      <div class="node-error" v-if="isDanger">
        <j-tooltip>
          <template #title>{{ errorInfo }}</template>
          <AIcon type="WarningOutlined" />
        </j-tooltip>
      </div>
      <j-button class="add-branch-btn-el" type="plain" :danger="isDanger"> {{ text }} </j-button>
    </div>
  </j-popover>
</template>

<script setup lang="ts" name="BranchButton">
import { useFlowStore } from '@/store/flow'
import { computed, defineExpose } from 'vue'

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
  id: {
    type: String,
    default: undefined
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const flowStore = useFlowStore()

const selectedNode = computed(() => flowStore.selectedNode)

const visible = ref(false)

const errorInfo = ref('')

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

const isDanger = computed(() => {
  return !!errorInfo.value
})

defineExpose({
  validate: (err) => {
    errorInfo.value = ''
    if (props.data.type === 'CONDITIONS' && props.data?.props.inclusiveType === 'condition') {
      const { inclusiveCondition } = props.data?.props
      if (!Object.values(inclusiveCondition?.condition || {}).length || !inclusiveCondition?.gotoNodes.length ) {
        err.push({
          errors: ['未填写必填配置项'],
          name: ['weight', 'complexWeight']
        })
        errorInfo.value = '配置项错误'
      }
    } else {
      const complexWeight = props.data?.props?.weight?.complexWeight
      const inputNodeWeight = props.data?.props?.weight?.inputNodeWeight
      if (inputNodeWeight !== undefined && Object.values(inputNodeWeight).length && complexWeight !== undefined) {
        const _weight = Object.values(inputNodeWeight).reduce((prev: number, next) => prev + next, 0)
        if (_weight < complexWeight) {
          err.push({
            errors: ['通过权重不能大于所有分支的权重总和'],
            name: ['weight', 'complexWeight']
          })
          errorInfo.value = '配置项错误'
        }
      }
    }
  }
})
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

.branch-box {
  position: relative;

  .node-error {
    position: absolute;
    right: -30px;
    top: -20px;
    font-size: 20px;
    color: #f56c6c;
  }
}

.add-branch-btn-el {
  top: -8px;
}

</style>
