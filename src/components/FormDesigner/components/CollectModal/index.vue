<template>
  <j-modal
    :visible="true"
    title="模板配置"
    @ok="handleOk"
    @cancel="emits('close')"
  >
    <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
      <j-form-item
        label="名称"
        name="name"
        required
        :rules="[
          {
            max: 64,
            message: '最多输入64个字符',
          },
        ]"
      >
        <j-input
          v-model:value="modelRef.name"
          placeholder="请输入名称"
          :maxlength="64"
        />
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const emits = defineEmits(['close', 'save'])

const formRef = ref()

const modelRef = reactive({
  name: '',
})

const handleOk = () => {
  formRef.value
    .validate()
    .then((_data: any) => {
      emits('save', _data?.name)
    })
    .catch((err: any) => {
      console.error('error', err)
    })
}
</script>

<style lang="less" scoped>
</style>