<template>
  <a-tabs v-model:activeKey="activeKey" type="card">
    <a-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>表单配置</h3>
        <j-form-item
          label="请确认当前节点需要候选人办理的表单内容"
          name="configForm"
          :rules="[{ required: true, message: '请配置表单内容' }]"
        >
          <j-button type="primary" block size="small" ghost>
            配置表单内容
          </j-button>
        </j-form-item>

        <h3 style="margin-top: 20px">节点控制</h3>
        <j-form-item name="autoPass">
          <template #label>
            自动通过
            <a-popover placement="right">
              <template #content>
                某候选人在上一个审批节点中担任过审批人角色，
                <br />开启后其在当前节点的审批意见为自动通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </a-popover>
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
    </a-tab-pane>
    <a-tab-pane key="member" tab="成员配置">
      <j-form ref="memberFormRef" :model="memberFormData" layout="vertical">
        <h3>候选人配置</h3>
        <j-form-item
          label="请选择可参与审批的候选成员"
          name="configForm"
          :rules="[{ required: true, message: '请选择成员' }]"
        >
          <j-button type="primary" block size="small" ghost>
            选择成员
          </j-button>
        </j-form-item>

        <h3 style="margin-top: 20px">权重控制</h3>
        <j-form-item
          name="passWeight"
          :rules="[{ required: true, message: '请输入通过权重' }]"
        >
          <template #label>
            通过权重
            <a-popover placement="right">
              <template #content>
                审批意见为“通过”的成员权重总和达到设定值时，审批通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </a-popover>
          </template>
          <j-input v-model:value="memberFormData.passWeight" />
        </j-form-item>
        <j-form-item
          name="rejectWeight"
          :rules="[{ required: true, message: '请输入驳回权重' }]"
        >
          <template #label>
            驳回权重
            <a-popover placement="right">
              <template #content>
                审批意见为“通过”的成员权重总和达到设定值时，审批通过
              </template>
              <AIcon type="InfoCircleOutlined" />
            </a-popover>
          </template>
          <j-input v-model:value="memberFormData.rejectWeight" />
        </j-form-item>

        <h3 style="margin-top: 20px">成员权限</h3>
        <j-form-item
          label="审批成员可以使用哪些按钮"
          name="authButtons"
          :rules="[{ required: true, message: '请选择按钮' }]"
        >
          <a-checkbox-group
            v-model:value="memberFormData.authButtons"
            :options="allButtons"
          />
        </j-form-item>
        <j-form-item
          label="驳回配置"
          name="rejectConfig"
          :rules="[{ required: true, message: '请选择驳回配置' }]"
        >
          <a-radio-group
            v-model:value="memberFormData.rejectConfig"
            button-style="solid"
          >
            <a-radio-button value="node">驳回至节点</a-radio-button>
            <a-radio-button value="end">结束流程</a-radio-button>
          </a-radio-group>
        </j-form-item>
        <j-form-item
          label="请选择驳回至哪个节点"
          name="rejectToNode"
          :rules="[{ required: true, message: '请选择驳回至哪个节点' }]"
          v-if="memberFormData.rejectConfig === 'node'"
        >
          <j-select
            v-model:value="memberFormData.rejectToNode"
            :options="nodeList"
          />
        </j-form-item>
      </j-form>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
const activeKey = ref('basic')
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

const basicFormData = ref({
  configForm: '',
  autoPass: false,
  dealRequired: false,
})

const memberFormData = ref({
  members: [],
  passWeight: 0,
  rejectWeight: 0,
  authButtons: [],
  rejectConfig: 'node',
  rejectToNode: '',
})
const allButtons = ref([
  { label: '通过', value: 'pass' },
  { label: '驳回', value: 'reject' },
])
const nodeList = ref([
  { label: '审批节点', value: 'approval' },
  { label: '处理节点', value: 'deal' },
])
</script>

<style lang="less" scoped></style>
