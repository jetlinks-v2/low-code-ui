<!-- 复制为模型 -->
<template>
  <j-modal
    visible
    :title="title"
    width="55%"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form
      v-show="!showIcon"
      ref="formRef"
      :model="form"
      autocomplete="off"
      :label-col="{ style: { width: '105px' } }"
      layout="vertical"
    >
      <j-form-item
        name="name"
        label="流程名称"
        :rules="[{ required: true, message: '请输入流程名称' }]"
      >
        <j-input
          v-model:value="form.name"
          :maxlength="64"
          :placeholder="`copy_${data.name}`"
        />
      </j-form-item>
      <j-form-item
        name="classificationText"
        label="流程分类"
        :rules="[{ required: true, message: '请选择流程分类' }]"
      >
        <a-select
          v-model:value="form.classificationText"
          placeholder="请选择流程分类"
          :options="providerOptions"
        >
          <template #notFoundContent>
            <div>
              <j-empty description="请前往数据字典页面配置" />
            </div>
          </template>
        </a-select>
      </j-form-item>
      <j-form-item
        name="icon"
        label="流程图标"
        :rules="[{ required: true, message: '请上传流程图标' }]"
      >
        <div class="upload-img-icon" @click="chooseIcon">
          <AIcon
            :type="form.icon ?? 'PlusOutlined'"
            :style="{ fontSize: form.icon ? '40px' : '' }"
          />
        </div>
      </j-form-item>
    </j-form>
    <!-- 选择图标 -->
    <ChooseIcon v-show="showIcon" v-model="form.icon"></ChooseIcon>
  </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import ChooseIcon from './ChooseIcon.vue'
import { copy_api } from '@/api/process/instance'
import { useRequest } from '@jetlinks/hooks'

type FormType = {
  id: string
  name: string
  classificationText: string
  icon: string
}

const props = defineProps<{
  data: any
  visible: boolean
}>()
const emits = defineEmits(['refresh', 'update:visible'])

const { loading, run } = useRequest(copy_api, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('操作成功')
      emits('update:visible', false)
      emits('refresh')
    }
  },
})

const title = ref('复制为模型')
const showIcon = ref(false)
const formRef = ref()
const form = ref<Partial<FormType>>({
  id: props.data.id,
  name: `copy_${props.data.name}`,
  classificationText: props.data.classificationText,
})

const chooseIcon = () => {
  title.value = '选择图标'
  showIcon.value = true
}

const confirm = () => {
  if (showIcon.value) {
    // 选择图标
    form.value.icon
      ? (showIcon.value = false)
      : onlyMessage('请选择图标', 'error')
  } else {
    formRef.value?.validate().then(async (_data: any) => {
      run(form.value)
    })
  }
}
</script>
<style scoped lang="less">
.upload-img-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px solid #d9d9d9;
}
</style>
