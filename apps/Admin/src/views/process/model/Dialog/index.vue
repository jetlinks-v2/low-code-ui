<!-- 新增统计指标 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    :title="title"
    :width="700"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form ref="formRef" :model="form" autocomplete="off" layout="vertical">
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
          placeholder="请假申请"
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
              <!-- <div>请前往数据字典页面配置</div> -->
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
            <!-- <AIcon :type="typeStr" /> -->
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
            <ImageUpload
              class="upload"
              v-model:value="selected"
              :accept="accept"
              style="width: 60px; height: 60px"
            />
            <div>自定义</div>
          </j-radio-button>
        </j-radio-group>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage, randomString } from '@jetlinks/utils'
import { saveProcess_api } from '@/api/process/model'
import { useRequest } from '@jetlinks/hooks'
import { isImg } from '@/utils/comm'
import { providerEnum } from '@/api/process/model'
import { getImage } from '@jetlinks/utils'

type FormType = {
  key: string
  name: string
  classifiedId: string
  icon: string
  model: string
  provider: string
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

// const { classified, getText } = useClassified()
const baseIcon = [
  getImage(`/process/model/icon1.png`),
  getImage(`/process/model/icon2.png`),
  getImage(`/process/model/icon3.png`),
  getImage(`/process/model/icon4.png`),
]

// 上传icon格式
const accept = '.jpg,.jpeg,.png'
const title = ref<string>('新增')
const formRef = ref<any>()
const selected = ref<string>()
// 表单相关
const form = reactive<Partial<FormType>>({
  key: randomString(),
  model: '',
  provider: 'wflow',
})

const { data: classified } = useRequest(providerEnum, {
  immediate: true,
  onSuccess(res) {
    const op = res.result.map((item) => {
      return {
        label: item.value,
        value: item.id,
      }
    })
    op.some((i) => i.value === form.classifiedId)
      ? ''
      : (form.classifiedId = '')
    return op
  },
})

const { loading, run } = useRequest(saveProcess_api, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('操作成功')
      emits('update:visible', false)
      emits('refresh')
    }
  },
})

const confirm = () => {
  formRef.value?.validate().then((_data: any) => {
    run([form])
  })
}

const init = () => {
  title.value = '编辑'
  Object.assign(form, props.data)
  selected.value = baseIcon.some((i) => i === form.icon) ? '' : form.icon
}

watch(
  () => props.data.id,
  (val) => {
    if (val) {
      init()
    }
  },
  {
    immediate: true,
  },
)
watch(selected, (val) => {
  form.icon = val
})
</script>

<style lang="less" scoped>
.base-icon {
  text-align: center;
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
