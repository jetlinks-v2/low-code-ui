<!-- 条件分支配置 -->
<template>
  <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
    <j-form-item label="多个条件满足时" name="type">
      <j-radio-group v-model:value="tempType" button-style="solid" size="small">
        <j-space>
          <j-radio-button value="exclusive">
            执行第一个满足条件
          </j-radio-button>
          <j-radio-button value="condition">
            部分条件下的流程通过
          </j-radio-button>
          <j-radio-button value="all">所有条件下的流程通过</j-radio-button>
        </j-space>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      label="当以下条件同时满足时"
      name="condition"
      :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
      v-if="tempType === 'condition'"
    >
      <j-select
        mode="multiple"
        placeholder="请选择"
        v-model:value="basicFormData.condition"
        :options="allConditionBranches"
      />
    </j-form-item>
    <j-form-item
      label="执行以下条件节点"
      name="gotoNodes"
      :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
      v-if="tempType === 'condition'"
    >
      <j-select
        mode="multiple"
        placeholder="请选择"
        v-model:value="basicFormData.gotoNodes"
        :options="[
          { label: '任意节点', value: '@exclusive' },
          ...allConditionBranches.filter((f) =>
            basicFormData.condition.includes(f.value),
          ),
        ]"
      />
    </j-form-item>
  </j-form>
</template>

<script setup lang="ts">
import { findNodeById, handleObjToArr, handleArrToObj } from './utils'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

const props = defineProps({
  node: {
    type: Object,
    default: () => ({}),
  },
})

// 基础配置
const basicFormRef = ref()
const nodeProps = computed(() => props.node?.props)
// 临时变量, 用于radio展示 仅供前端使用
// const tempType = ref(
//   nodeProps.value?.type === 'exclusive'
//     ? 'exclusive'
//     : nodeProps.value?.inclusiveType,
// )
const tempType = ref('exclusive')

const basicFormData = reactive({
  type: nodeProps.value?.type || 'inclusive',
  inclusiveType: nodeProps.value?.inclusiveType || 'all',
  inclusiveCondition: nodeProps.value?.inclusiveCondition || {
    condition: {},
    gotoNodes: [],
  },
  //   临时字段, 仅供前端使用
  condition:
    handleObjToArr(nodeProps.value?.inclusiveCondition?.condition) || [],
  gotoNodes: nodeProps.value?.inclusiveCondition?.gotoNodes || [],
})

const allConditionBranches = computed(() => {
  return flowStore.selectedNode.branches.map((m) => ({
    label: m.name,
    value: m.id,
  }))
})

watch(
  () => tempType.value,
  (val) => {
    basicFormData.type = val === 'exclusive' ? 'exclusive' : 'inclusive'
    basicFormData.inclusiveType = val !== 'exclusive' ? val : undefined
  },
)

/**
 * 将数据保存至store, 不用校验合法性
 */
const saveConfigToStore = () => {
  return new Promise((resolve, reject) => {
    const result = findNodeById(
      flowStore.model.nodes,
      flowStore.selectedNode.id,
    )
    const { type, inclusiveType, condition, gotoNodes } = basicFormData
    result.props = {
      ...result.props,
      type,
      inclusiveType,
      inclusiveCondition: {
        condition: handleArrToObj(condition),
        gotoNodes,
      },
    }
    resolve(result)
  })
}

/**
 * 校验配置数据
 */
const validateConfig = () => {
  return new Promise((resolve, reject) => {
    basicFormRef.value
      .validate()
      .then((valid) => {
        const result = findNodeById(
          flowStore.model.nodes,
          flowStore.selectedNode.id,
        )
        const { type, inclusiveType, condition, gotoNodes } = basicFormData
        result.props = {
          ...result.props,
          type,
          inclusiveType,
          inclusiveCondition: {
            condition: handleArrToObj(condition),
            gotoNodes,
          },
        }
        resolve(valid)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
defineExpose({
  saveConfigToStore,
  validateConfig,
})
</script>

<style lang="less" scoped></style>
