<template>
  <j-modal
    :maskClosable="false"
    width="650px"
    :visible="true"
    :title="!!data?.id ? '编辑' : '新增'"
    @ok="handleSave"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <div style="margin-top: 10px">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item
          label="表单标识"
          name="key"
          :validateFirst="true"
          :rules="[
            {
              pattern: /^[a-zA-Z0-9_\-]+$/,
              message: '请输入英文或者数字或者-或者_',
              trigger: ['blur', 'change'],
            },
            {
              max: 20,
              message: '最多输入20个字符',
              trigger: ['blur', 'change'],
            },
            {
              validator: vailId,
              trigger: 'blur',
            },
          ]"
        >
          <j-input
            :disabled="props.data?.key"
            v-model:value="modelRef.key"
            placeholder="请输入表单标识"
          />
        </j-form-item>
        <j-form-item
          label="表单名称"
          name="name"
          :validateFirst="true"
          :rules="[
            {
              required: true,
              message: '请输入表单名称',
            },
            {
              max: 16,
              message: '最多输入16个字符',
            },
          ]"
        >
          <j-input v-model:value="modelRef.name" placeholder="请输入表单名称" />
        </j-form-item>
        <j-form-item
          label="说明"
          name="description"
          :validateFirst="true"
          :rules="[
            {
              max: 200,
              message: '最多输入200个字符',
            },
          ]"
        >
          <j-textarea
            v-model:value="modelRef.description"
            placeholder="请输入说明"
            showCount
            :maxlength="200"
          />
        </j-form-item>
      </j-form>
    </div>
  </j-modal>
</template>

<script lang="ts" setup>
import { _save, isExists } from '@/api/process/form'
import { onlyMessage } from '@/utils/comm'
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['close', 'save'])

const props = defineProps({
  data: {
    type: Object,
    default: undefined,
  },
})
const loading = ref<boolean>(false)
const formRef = ref()

const modelRef = reactive({
  key: undefined,
  name: '',
  description: '',
})

const vailId = async (_: Record<string, any>, value: string) => {
  if (!props?.data?.key && value) {
    const resp = await isExists(value)
    if (resp.status === 200 && resp.result) {
      return Promise.reject('ID重复')
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}

watch(
  () => props.data,
  (newValue) => {
    Object.assign(modelRef, newValue)
  },
  { immediate: true, deep: true },
)

const handleCancel = () => {
  emit('close')
  formRef.value.resetFields()
}

const handleSave = () => {
  formRef.value
    .validate()
    .then(async (_data: any) => {
      loading.value = true
      if (!_data.key) {
        delete _data.key
      }
      const obj = { ...props.data, ..._data, provider: 'custom' }
      const resp: any = await _save(obj).finally(() => {
          loading.value = false
        })
      if (resp?.status === 200) {
        onlyMessage('操作成功！')
        emit('save')
        formRef.value.resetFields()
      }
    })
    .catch((err: any) => {
      console.log('error', err)
    })
}
</script>