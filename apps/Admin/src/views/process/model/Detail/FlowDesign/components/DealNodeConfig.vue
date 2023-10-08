<!-- 处理节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>表单配置</h3>
        <j-form-item
          label="请确认当前节点需要候选人办理的表单内容"
          name="forms"
          :rules="[{ required: true, message: '请配置表单内容' }]"
        >
          <ConfigureForm v-model:value="basicFormData.forms" />
        </j-form-item>
      </j-form>
    </j-tab-pane>
    <j-tab-pane key="member" tab="成员配置">
      <j-form ref="memberFormRef" :model="memberFormData" layout="vertical">
        <h3>候选人配置</h3>
        <j-form-item
          label="请选择可参与办理的候选成员"
          name="members"
          :rules="[{ required: true, message: '请选择成员' }]"
        >
          <ConfigureMembers v-model:members="memberFormData.members" />
        </j-form-item>

        <h3 style="margin-top: 20px">成员权限</h3>
        <j-form-item
          label="办理成员可以使用哪些按钮"
          name="authButtons"
          :rules="[{ required: true, message: '请选择按钮' }]"
        >
          <j-checkbox-group
            v-model:value="memberFormData.authButtons"
            :options="allButtons"
          />
        </j-form-item>
        <j-form-item label="办理成员可以自由选择下一节点办理人" name="allow">
          <j-switch
            size="small"
            v-model:checked="memberFormData.allow"
          ></j-switch>
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import ConfigureForm from './ConfigureForm.vue'

const activeKey = ref('basic')
const props = defineProps({
  node: {
    type: Object,
    default: () => ({}),
  },
})
// 基础配置
const basicFormRef = ref()
const basicFormData = ref({
  forms: props.node?.props?.formBinds || {},
})

// 成员配置
const memberFormRef = ref()
const memberFormData = ref({
  members: [],
  authButtons: [],
  allow: false,
})

const allButtons = ref([{ label: '提交', value: 'submit' }])
const nodeList = ref([
  { label: '审批节点', value: 'approval' },
  { label: '处理节点', value: 'deal' },
])
</script>

<style lang="less" scoped></style>
