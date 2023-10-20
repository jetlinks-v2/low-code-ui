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
          :rules="[
            {
              required: true,
              message: `请输入通过权重`,
              trigger: 'blur',
            },
            {
              validator: rules.complexWeightValidator,
              trigger: 'blur',
            },
          ]"
        >
          <j-input-number
            v-model:value="basicFormData.complexWeight"
            :min="1"
            :max="99999"
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
      <template v-for="(item, index) in branchFormItem" :key="index">
        <j-form-item
          :name="item.name"
          :label="item.label"
          :rules="[
            {
              required: true,
              message: `请输入${item.label}权重`,
              trigger: 'blur',
            },
            {
              validator: rules.branchWeightValidator,
              trigger: 'blur',
            },
          ]"
          required
        >
          <j-input-number
            v-model:value="branchFormData[item.name]"
            :min="1"
            :max="99"
            :precision="0"
            style="width: 100%"
          />
        </j-form-item>
      </template>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { findNodeById, findBranchLastNode, sumValues } from './utils'
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
  type: props.node?.props?.type || 'parallel',
  complexType: props.node?.props?.complexType || 'weight',
  complexWeight: props.node?.props?.complexWeight || 2,
  inputNodeWeight: props.node?.props?.inputNodeWeight || {},
})

// 分支权重配置
const visible = ref(false)
const branchFormRef = ref()
const branchFormData = ref({})
const branchFormItem = ref<any[]>([])

// 校验规则
const rules = {
  // 通过权重验证
  complexWeightValidator: (_: any, value: number) => {
    // 分支权重之和
    const branchTotal = sumValues(branchFormData.value)
    if (value > branchTotal) {
      return Promise.reject('通过权重不能大于所有分支的权重总和')
    }
    return Promise.resolve()
  },
  // 分支权重验证
  branchWeightValidator: (_: any, value: number) => {
    const branchTotal = sumValues(branchFormData.value)
    if (branchTotal < basicFormData.complexWeight) {
      return Promise.reject(
        `所有分支的权重总和不能小于通过权重${basicFormData.complexWeight}`,
      )
    }
    return Promise.resolve()
  },
}

watch(
  () => flowStore.selectedNode.branches,
  (val) => {
    val.forEach((item, index) => {
      const lastNode = findBranchLastNode(item)
      branchFormData.value[lastNode.id] = 1
      branchFormItem.value.push({
        name: lastNode.id,
        label: `分支${index + 1}权重`,
      })
    })
  },
  { deep: true, immediate: true },
)

watch(
  () => visible.value,
  (val) => {
    // 分支权重弹窗关闭, 触发基础配置表单验证
    if (!val) basicFormRef.value.validate()
  },
)

/**
 * 保存分支权重配置
 */
const saveBranchWeight = () => {
  branchFormRef.value.validate().then((valid) => {
    Object.keys(valid).forEach((key: string) => {
      basicFormData.inputNodeWeight[key] = valid[key]
    })
    visible.value = false
  })
}

/**
 * 将数据保存至pinia, 不用校验数据
 */
const saveConfigToPinia = () => {
  return new Promise((resolve, reject) => {
    const result = findNodeById(
      flowStore.model.nodes,
      flowStore.selectedNode.id,
    )
    result.props = { ...result.props, ...basicFormData }
    resolve(result)
    // basicFormRef.value
    //   .validate()
    //   .then((valid) => {
    //     const result = findNodeById(
    //       flowStore.model.nodes,
    //       flowStore.selectedNode.id,
    //     )
    //     result.props = { ...result.props, ...basicFormData }
    //     resolve(valid)
    //   })
    //   .catch((err) => {
    //     reject(err)
    //   })
  })
}
defineExpose({
  saveConfigToPinia,
})
</script>

<style lang="less" scoped></style>
