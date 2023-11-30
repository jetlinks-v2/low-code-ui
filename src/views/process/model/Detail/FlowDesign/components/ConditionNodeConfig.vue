<!-- 条件节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <j-collapse
          v-model:activeKey="collapseActive"
          expand-icon-position="right"
          :bordered="false"
        >
          <j-collapse-panel key="1">
            <template #header>
              <TitleComponent data="条件配置"></TitleComponent>
            </template>
            <j-form-item label="请配置进入下方节点的条件" name="terms">
              <ConditionSelect v-model:value="basicFormData.terms" />
            </j-form-item>
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import { findNodeById, handleTermsData } from './utils'
import { useFlowStore } from '@LowCode/store/flow'
import ConditionSelect from './ConditionSelect.vue'
import { TitleComponent } from '@LowCode/components/index'

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
const collapseActive = ref(['1'])

/**
 * 将数据保存至store, 不用校验合法性
 */
const saveConfigToStore = () => {
  return new Promise((resolve, reject) => {
    const result = findNodeById(
      flowStore.model.nodes,
      flowStore.selectedNode.id,
    )
    const { condition, terms } = basicFormData
    condition.configuration.terms = handleTermsData(terms)
    result.props = { ...result.props, condition }
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
  saveConfigToStore,
  validateConfig,
})
</script>

<style lang="less" scoped></style>
