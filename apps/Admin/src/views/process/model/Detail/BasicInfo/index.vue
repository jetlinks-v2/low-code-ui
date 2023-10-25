<!-- 基础信息 -->
<template>
  <div class="base-info">
    <div class="form-box">
      <j-form
        ref="formRef"
        :model="formData"
        autocomplete="off"
        layout="vertical"
      >
        <TitleComponent data="表单配置" />
        <j-form-item
          name="forms"
          label="请选择该流程中需要使用的流程表单"
          :rules="[
            {
              required: true,
              validator: rules.checkFormList,
              trigger: 'change',
            },
          ]"
        >
          <ConfigForm v-model:modelValue="formData.forms" />
        </j-form-item>
        <TitleComponent data="权限控制" />
        <j-form-item name="assignedUser" label="配置可以使用该流程的成员">
          <ConfigureMembers
            :isNode="false"
            :hasWeight="false"
            :supCancel="false"
            v-model:members="formData.assignedUser"
          />
        </j-form-item>
      </j-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import ConfigForm from './components/ConfigForm.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const formRef = ref()

const formData = reactive({
  forms: computed({
    get: () => flowStore.model.config.forms || [],
    set: (val) => {
      flowStore.model.config.forms = val
    },
  }),
  assignedUser: computed({
    get: () => flowStore.model.nodes.props?.assignedUser || [],
    set: (val) => {
      // 基础信心权限控制, 对应根节点的 props.assignedUser, 根节点必然存在 props.assignedUser
      flowStore.model.nodes.props!.assignedUser = val
    },
  }),
})

const rules = {
  checkFormList: async (_rule: any, value: string): Promise<any> => {
    if (formData.forms?.length === 0) {
      return Promise.reject('请配置表单')
    } else {
      return Promise.resolve()
    }
  },
}

/**
 * 当前步骤校验方法
 */
const validateSteps = () => {
  return new Promise((resolve, reject) => {
    formRef.value
      .validate()
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

defineExpose({ validateSteps })

watch(
  () => formData.forms,
  () => {
    formRef.value.validate()
  },
  { deep: true },
)
</script>
<style scoped lang="less">
.base-info {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .form-box {
    width: 50%;
  }
}
</style>
