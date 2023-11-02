<!-- 复制为模型 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    :title="title"
    :width="!showIcon ? 700 : '50%'"
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
          style="width: 576px"
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
          style="width: 576px"
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
      <j-radio-group v-model:value="form.icon" class="radio">
          <j-radio-button
            v-for="(item, index) of baseIcon"
            :value="item"
            :key="item"
            :class="{ active: form.icon === item }"
          >
            <ProImage
              style="border: 1px dashed #dcdcdc"
              :src="item"
              :width="44"
              :preview="false"
            />
            <div>图标{{ index + 1 }}</div>
          </j-radio-button>
          <j-radio-button
            :value="selected"
            :class="{ active: form.icon === selected }"
          >
          <div class="upload-img-icon" @click="chooseIcon">
              <ProImage
                v-if="isImg(selected)"
                :width="40"
                :height="40"
                :src="selected"
                :preview="false"
              />
              
              <AIcon
                v-else
                :type="selected || 'PlusOutlined'"
                :style="{ fontSize: form.icon ? '16px' : '' }"
              />
              {{ selected }}
            </div>
            <div>自定义</div>
          </j-radio-button>
        </j-radio-group>
        <!-- <div class="upload-img-icon" @click="chooseIcon">
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
        </div> -->
      </j-form-item>
    </j-form>
    <!-- 选择图标 -->
    <ChooseIcon ref="chooseIconRef" v-show="showIcon" :value="form.icon" />
  </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage, getImage } from '@jetlinks/utils'
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

const baseIcon = [
  getImage(`/process/model/icon1.png`),
  getImage(`/process/model/icon2.png`),
  getImage(`/process/model/icon3.png`),
  getImage(`/process/model/icon4.png`),
]

const { classified } = useClassified()
const selected = ref<string>('')
const chooseIconRef = ref()
const title = ref<string>('复制为模型')
const showIcon = ref<boolean>(false)
const formRef = ref<any>()
const form = reactive({
  id: props.data.id,
  name: `copy_${props.data.name}`,
  classifiedId: props.data.classifiedId,
  icon: props.data.icon,
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
      selected.value = chooseIconRef.value.selected
      form.icon = selected.value
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
watch(() => form.icon, (val)=>{
  console.log(`output->baseIcon`,baseIcon)
  console.log(`output->val`,val)
  // props.data.icon
  selected.value = baseIcon.some((i) => i === form.icon) ? '' : form.icon
},{immediate: true})
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
.radio {
  display: flex;
  gap: 24px;
  // display: grid;
  // grid-gap: 20px;
  // grid-template-columns: repeat(6, 1fr);
  // max-height: 500px;
  // overflow-y: auto;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    text-align: center;

    border: 2px solid #efefef;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: #415ed1;
      border-color: #415ed1;
    }
    :deep(.upload-image-content) {
      width: 44px !important;
      height: 44px !important;
      padding: 0;
      background: #fff;
    }
    :deep(.ant-upload.ant-upload-select-picture-card) {
      margin: 0;
    }
  }
}
</style>
