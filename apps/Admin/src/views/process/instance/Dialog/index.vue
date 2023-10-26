<!-- 复制为模型 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    :title="title"
    :width="552"
    @cancel="cancel"
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
      layout="vertical"
    >
      <j-form-item
        name="name"
        label="流程名称"
        :rules="[
          { required: true, message: '请输入流程名称' },
          {
            max: 64,
            message: '最多输入64个字符',
          },
        ]"
      >
        <j-input
          v-model:value="form.name"
          placeholder="请输入流程名称"
          style="width: 320px"
        />
      </j-form-item>
      <j-form-item
        name="classifiedId"
        label="流程分类"
        :rules="[{ required: true, message: '请选择流程分类' }]"
      >
        <a-select
          v-model:value="form.classifiedId"
          placeholder="请选择流程分类"
          :options="classified"
          style="width: 320px"
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
          <ProImage
            v-if="isImg(form.icon)"
            :width="40"
            :height="40"
            :src="form.icon"
            :preview="false"
          />
          <AIcon
            v-else
            :type="form.icon ?? 'PlusOutlined'"
            :style="{ fontSize: form.icon ? '16px' : '' }"
          />
        </div>
      </j-form-item>
    </j-form>
    <!-- 选择图标 -->
    <ChooseIcon ref="chooseIconRef" v-show="showIcon" :value="form.icon" />
  </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import ChooseIcon from './ChooseIcon.vue'
import { copy_api } from '@/api/process/instance'
import { useRequest } from '@jetlinks/hooks'
import { useClassified } from '@/hooks/useClassified'
import { isImg } from '@/utils/comm'

type FormType = {
  id: string
  name: string
  classifiedId: string
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

const { classified } = useClassified()
const chooseIconRef = ref()
const title = ref<string>('复制为模型')
const showIcon = ref<boolean>(false)
const formRef = ref<any>()
const form = reactive({
  id: props.data.id,
  name: `copy_${props.data.name}`,
  // classifiedId: props.data.classifiedId,
  // icon: props.data.icon,
} as FormType)

// const { data: providerOptions } = useRequest(providerEnum)

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
    if (chooseIconRef.value.selected) {
      form.icon = chooseIconRef.value.selected
      showIcon.value = false
    } else {
      onlyMessage('请选择图标', 'error')
    }
  } else {
    formRef.value?.validate().then((_data: any) => {
      run(form)
    })
  }
}
const cancel = () => {
  if (showIcon.value) {
    showIcon.value = false
  } else {
    emits('update:visible', false)
  }
}
</script>
<style scoped lang="less">
.upload-img-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: 1px dashed #dcdcdc;
  background: #eeeeee;
}
</style>
