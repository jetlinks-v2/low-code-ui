<!-- 基础信息 -->
<template>
  <div class="base-info">
    <j-form ref="formRef" :model="form" autocomplete="off" layout="vertical">
      <j-form-item
        name="formList"
        :rules="[{ validator: rules.checkFormList, trigger: 'change' }]"
      >
        <template #label>
          <TitleComponent data="表单配置" />
        </template>
        <div>请选择该流程中需要使用的流程表单</div>
        <ConfigForm v-model="form.formList"></ConfigForm>
      </j-form-item>
      <j-form-item name="members">
        <template #label>
          <TitleComponent data="权限控制" />
        </template>
        <div>配置可以使用该流程的成员</div>
        <ConfigureMembers
          :isNode="false"
          :hasWeight="false"
          v-model:members="form.members"
        ></ConfigureMembers>
      </j-form-item>
    </j-form>
  </div>
</template>
<script setup lang="ts">
import ConfigForm from './components/ConfigForm.vue'

const formRef = ref()

/**
 * 基础信息保存
 * @param type 默认save 不校验填写内容，submit 提交时校验
 */
const submit = async (type = 'save') => {
  // 仅保存配置数据，不校验填写内容的合规性。
  if (type !== 'save') {
    await formRef.value.validate()
  }
  return form
}
const form = reactive({
  formList: [],
  members: [],
})
const rules = {
  checkFormList: async (_rule: any, value: string): Promise<any> => {
    if (form.formList.length === 0) {
      return Promise.reject('请配置表单')
    } else {
      return Promise.resolve()
    }
  },
}

defineExpose({ submit })

watch(
  () => form.formList,
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
}
</style>
