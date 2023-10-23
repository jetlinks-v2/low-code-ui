<!-- 审批节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置" forceRender>
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>表单配置</h3>
        <j-form-item
          label="请确认当前节点需要候选人办理的表单内容"
          name="formBinds"
          :rules="[{ required: true, message: '请配置表单内容' }]"
        >
          <ConfigFormFields v-model:value="basicFormData.formBinds" />
        </j-form-item>

        <h3 style="margin-top: 20px">节点控制</h3>
        <j-form-item name="autoPass">
          <template #label>
            自动通过
            <j-tooltip placement="right">
              <template #title>
                某候选人在上一个审批节点中担任过审批人角色，开启后其在当前节点的审批意见为自动通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </template>
          <j-switch
            size="small"
            v-model:checked="basicFormData.autoPass"
          ></j-switch>
        </j-form-item>
        <j-form-item label="审批意见必填" name="dealRequired">
          <j-switch
            size="small"
            v-model:checked="basicFormData.dealRequired"
          ></j-switch>
        </j-form-item>
      </j-form>
    </j-tab-pane>
    <j-tab-pane key="member" tab="成员配置" forceRender>
      <j-form ref="memberFormRef" :model="memberFormData" layout="vertical">
        <h3>候选人配置</h3>
        <j-form-item
          label="请选择可参与审批的候选成员"
          name="candidates"
          :rules="[{ required: true, message: '请选择成员' }]"
        >
          <ConfigureMembers v-model:members="memberFormData.candidates" />
        </j-form-item>

        <h3 style="margin-top: 20px">权重控制</h3>
        <j-form-item
          name="completeWeight"
          :rules="[{ required: true, message: '请输入通过权重' }]"
        >
          <template #label>
            通过权重
            <j-tooltip placement="right">
              <template #title>
                审批意见为“通过”的成员权重总和达到设定值时，审批通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </template>
          <j-input v-model:value="memberFormData.completeWeight" />
        </j-form-item>
        <j-form-item
          name="rejectWeight"
          :rules="[{ required: true, message: '请输入驳回权重' }]"
        >
          <template #label>
            驳回权重
            <j-tooltip placement="right">
              <template #title>
                审批意见为“通过”的成员权重总和达到设定值时，审批通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </template>
          <j-input v-model:value="memberFormData.rejectWeight" />
        </j-form-item>

        <h3 style="margin-top: 20px">成员权限</h3>
        <j-form-item
          label="审批成员可以使用哪些按钮"
          name="authButtons"
          :rules="[{ required: true, message: '请选择按钮' }]"
        >
          <j-checkbox-group
            v-model:value="memberFormData.authButtons"
            :options="allButtons"
          />
        </j-form-item>
        <j-form-item
          label="驳回配置"
          name="endProcessWhenReject"
          :rules="[{ required: true, message: '请选择驳回配置' }]"
        >
          <j-radio-group
            v-model:value="memberFormData.endProcessWhenReject"
            button-style="solid"
          >
            <j-radio-button :value="false">驳回至节点</j-radio-button>
            <j-radio-button :value="true">结束流程</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item
          label="请选择驳回至哪个节点"
          name="gotoWhenReject"
          :rules="[{ required: true, message: '请选择驳回至哪个节点' }]"
          v-if="!memberFormData.endProcessWhenReject"
        >
          <j-select
            v-model:value="memberFormData.gotoWhenReject"
            :options="nodeList"
          />
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import ConfigFormFields from './ConfigFormFields.vue'
import { findNodeById } from './utils'
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
  formBinds: props.node?.props?.formBinds || {},
  autoPass: props.node?.props?.autoPass,
  dealRequired: props.node?.props?.dealRequired,
})

// 成员配置
const memberFormRef = ref()
const memberFormData = reactive({
  candidates: props.node?.props?.candidates,
  completeWeight: props.node?.props?.completeWeight,
  rejectWeight: props.node?.props?.rejectWeight,
  authButtons: props.node?.props?.authButtons,
  endProcessWhenReject: props.node?.props?.endProcessWhenReject,
  gotoWhenReject: props.node?.props?.gotoWhenReject,
})
const allButtons = ref([
  { label: '通过', value: 'pass' },
  { label: '驳回', value: 'reject' },
])
const nodeList = ref([
  { label: '审批节点', value: 'approval' },
  { label: '处理节点', value: 'deal' },
])

/**
 * 将数据保存至store, 不用校验合法性
 */
const saveConfigToStore = () => {
  return new Promise((resolve, reject) => {
    const result = findNodeById(
      flowStore.model.nodes,
      flowStore.selectedNode.id,
    )
    result.props = {
      ...result.props,
      ...basicFormData,
      ...memberFormData,
    }
    resolve(result)
    // basicFormRef.value
    //   ?.validate()
    //   .then((valid1) => {
    //     memberFormRef.value
    //       ?.validate()
    //       .then((valid2) => {
    //         const result = findNodeById(
    //           flowStore.model.nodes,
    //           flowStore.selectedNode.id,
    //         )
    //         result.props = {
    //           ...result.props,
    //           ...basicFormData,
    //           ...memberFormData,
    //         }
    //         resolve({ ...valid1, ...valid2 })
    //       })
    //       .catch((err) => {
    //         reject(err)
    //       })
    //   })
    //   .catch((err) => {
    //     reject(err)
    //   })
  })
}

defineExpose({
  saveConfigToStore,
})
</script>

<style lang="less" scoped></style>
