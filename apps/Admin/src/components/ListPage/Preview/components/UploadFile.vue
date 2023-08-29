<template>
  <j-space align="end">
    <j-upload
      v-model:fileList="modelValue.upload"
      name="file"
      :maxCount="1"
      :showUploadList="true"
      :accept="props?.file ? `.${props?.file}` : '.xlsx'"
      :before-upload="beforeUpload"
      @remove="handleRemove"
    >
      <j-button>
        <template #icon><AIcon type="UploadOutlined" /></template>
        文件上传
      </j-button>
    </j-upload>
  </j-space>
  <div style="margin-top: 20px" v-if="importLoading">
    <j-badge v-if="flag" status="processing" text="进行中" />
    <j-badge v-else status="success" text="已完成" />
    <span>总数量：{{ count }}</span>
    <p style="color: red">{{ errMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

type Emits = {
  (e: 'update:modelValue', data: string[]): void
}
const emit = defineEmits<Emits>()

const props = defineProps({
  // 组件双向绑定的值
  modelValue: {
    type: Array,
    default: () => [],
  },
  product: {
    type: String,
    default: '',
  },
  file: {
    type: String,
    default: 'xlsx',
  },
  importUrl: {
    type: Function,
    default: undefined,
  },
})

const importLoading = ref<boolean>(true)
const flag = ref<boolean>(false)
const count = ref<number>(0)
const errMessage = ref<string>('')

const downFile = async (type: string) => {
  message.success(`下载成功`)
}

const beforeUpload = (_file: any) => {
  const fileType = props?.file === 'csv' ? 'csv' : 'xlsx'
  const isCsv = _file.type === 'text/csv'
  const isXlsx = _file.type === 'xlsx'
  if (!isCsv && fileType !== 'xlsx') {
    return message.warning('请上传.csv格式文件')
  }
  if (!isXlsx && fileType !== 'csv') {
    return message.warning('请上传.xlsx格式文件')
  }

  submitData(_file)
  return false
}
console.log(props.product)
const submitData = async (fileUrl: string) => {
  if (!!fileUrl && props?.importUrl) {
    props?.importUrl(fileUrl)
  } else {
    message.error('请先上传文件')
  }
}

const handleRemove = async () => {
  if (props.importUrl) {
    props?.importUrl('')
  }
  return new Promise((resolve) => resolve(true))
}
</script>
