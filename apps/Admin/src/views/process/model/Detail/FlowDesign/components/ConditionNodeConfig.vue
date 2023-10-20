<!-- 条件节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>条件配置</h3>
        <j-form-item label="请配置进入下方节点的条件" name="terms">
          <ConditionSelect v-model:value="basicFormData.terms" />
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import { findNodeById } from './utils'
import { useFlowStore } from '@/store/flow'
import ConditionSelect from './ConditionSelect.vue'

const flowStore = useFlowStore()
const activeKey = ref('basic')
const props = defineProps({
  node: {
    type: Object,
    default: () => ({}),
  },
})

// 基础配置
const basicFormRef = ref()
const basicFormData = reactive({
  condition: props.node?.props?.condition,
  //   此字段仅用于前端
  terms: props.node?.props?.condition?.configuration?.terms || [],
})

/**
 * 将数据保存至pinia
 */
const saveConfigToPinia = () => {
  return new Promise((resolve, reject) => {
    basicFormRef.value
      .validate()
      .then((valid) => {
        const result = findNodeById(
          flowStore.model.nodes,
          flowStore.selectedNode.id,
        )
        const { condition, terms } = basicFormData
        condition.configuration.terms = terms
        result.props = { ...result.props, condition }
        resolve(valid)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
defineExpose({
  saveConfigToPinia,
})
</script>

<style lang="less" scoped></style>
