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
import { providerEnum } from '@/api/process/model'

type FormType = {
  id: string
  name: string
  classificationText: string
  icon: string
}

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
  (e: 'refresh'): void
}>()

const title = ref<string>('复制为模型')
const showIcon = ref<boolean>(false)
const formRef = ref<any>()
const form = reactive({
  id: props.data.id,
  name: `copy_${props.data.name}`,
  classificationText: props.data.classificationText,
} as FormType)

const { data: providerOptions } = useRequest(providerEnum)

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

const chooseIcon = () => {
  title.value = '选择图标'
  showIcon.value = true
}

const confirm = () => {
  if (showIcon.value) {
    // 选择图标
    form.icon ? (showIcon.value = false) : onlyMessage('请选择图标', 'error')
  } else {
    formRef.value?.validate().then((_data: any) => {
      run(form)
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
