<!-- 并行分支配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <j-form-item name="type">
          <template #label>
            请配置从并行分支进入下一个流程节点的条件
            <j-tooltip placement="right">
              <template #title>
                并行分支中任意一个节点办理人选择了退回后，
                不需要等待其他节点的处理意见，立刻退回至对应节点
              </template>
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </template>
          <j-radio-group
            v-model:value="basicFormData.type"
            button-style="solid"
          >
            <j-radio-button value="parallel">全部分支完成</j-radio-button>
            <j-radio-button value="complex">部分分支完成</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item
          name="inputNodeWeight"
          label="请配置各分支的权重"
          v-if="basicFormData.type === 'complex'"
        >
          <j-button
            type="primary"
            block
            size="small"
            ghost
            @click="visible = true"
          >
            配置
          </j-button>
        </j-form-item>
        <j-form-item
          name="complexWeight"
          label="请配置并行分支的通过权重"
          v-if="basicFormData.type === 'complex'"
        >
          <j-input-number
            v-model:value="basicFormData.complexWeight"
            style="width: 100%"
          />
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>

  <j-modal
    title="分支权重配置"
    width="300px"
    v-model:visible="visible"
    @ok="saveBranchWeight"
    @cancel="visible = false"
  >
    <j-form ref="branchFormRef" :model="branchFormData" layout="vertical">
      <j-form-item
        v-for="(item, index) in branchFormItem"
        :key="index"
        :name="item.name"
        :label="item.label"
      >
        <j-input-number v-model:value="item.value" style="width: 100%" />
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { findDataById } from './utils'
import { useFlowStore } from '@/store/flow'

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
  //   type: 'parallel',
  //   complexType: 'weight',
  //   complexWeight: 1,
  //   inputNodeWeight: {},
  type: props.node?.props?.type || 'parallel',
  complexType: props.node?.props?.complexType || 'weight',
  complexWeight: props.node?.props?.complexWeight || 1,
  inputNodeWeight: props.node?.props?.inputNodeWeight || {},
})

// 分支权重配置
const visible = ref(false)
const branchFormRef = ref()
const branchFormData = reactive({})
const branchFormItem = computed(() => {
  return flowStore.selectedNode.branches.map((m) => ({
    name: m.id,
    label: m.name,
    value: 1,
  }))
})
const saveBranchWeight = () => {}

/**
 * 将数据保存至pinia
 */
const saveConfigToPinia = () => {
  const result = findDataById(flowStore.model.nodes, flowStore.selectedNode.id)
  result.props = { ...result.props, ...basicFormData }
  console.log('saveConfigToPinia1: ', result)
  console.log('saveConfigToPinia2: ', flowStore.selectedNode)
}
defineExpose({
  saveConfigToPinia,
})

watch(
  () => props.nodes,
  (val) => {
    console.log('props.nodes: ', val)
  },
  { deep: true },
)
</script>

<style lang="less" scoped></style>
