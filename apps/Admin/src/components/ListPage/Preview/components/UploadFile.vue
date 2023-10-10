<template>
  <j-space align="end">
    <j-upload
      v-model:fileList="modelValue.upload"
      :action="_fileUpload"
      :headers="{
        'X-Access-Token': LocalStore.get(TOKEN_KEY),
      }"
      :maxCount="1"
      :showUploadList="false"
      @change="uploadChange"
      :accept="props?.file ? `.${props?.file}` : '.xlsx'"
      @before-upload="beforeUpload"
    >
      <j-button>
        <template #icon><AIcon type="UploadOutlined" /></template>
        文件上传
      </j-button>
    </j-upload>
  </j-space>
  <div style="margin-top: 20px" v-if="importLoading">
    <j-badge v-if="flag" status="processing" text="进行中" />
    <template v-else-if="importLoading">
      <j-space>
        <j-badge status="success" text="导入成功：" />
        <span>{{ successCount }}</span>
      </j-space>
      <br />
      <j-space>
        <j-badge status="error" text="导入失败：" />
        <span>{{ failCount }}</span>
        <j-button type="link" @click="downloadFail" v-if="failCount">下载</j-button>
      </j-space>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { _fileUpload } from '@/api/comm'
import { TOKEN_KEY } from '@jetlinks/constants'
import { LocalStore } from '@jetlinks/utils/src/storage'
import { onlyMessage } from '@jetlinks/utils'
import { _import } from '@/api/list'
import { PropType } from 'vue'
import { downloadFileByUrl } from '@jetlinks/utils'

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
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  projectId: {
    type: String,
    default: '',
  },
})

const importLoading = ref<boolean>(false)
const flag = ref<boolean>(false)
const count = ref<number>(0)
const successCount = ref(0)
const failCount = ref(0)
const errMessage = ref<string>('')
const failFileUrl = ref('')

const beforeUpload = (_file: any) => {
  const fileType = props?.file === 'csv' ? 'csv' : 'xlsx'
  const isCsv = _file.type === 'text/csv'
  const isXlsx =
    _file.type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isCsv && fileType !== 'xlsx') {
    onlyMessage('请上传.csv格式文件', 'warning')
  }
  if (!isXlsx && fileType !== 'csv') {
    onlyMessage('请上传.xlsx格式文件', 'warning')
  }
  return (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv')
}

const uploadChange = async (info: Record<string, any>) => {
  successCount.value = failCount.value = 0
  importLoading.value = true
  if (info.file.status === 'done') {
    const resp: any = info.file.response || { result: '' }
    flag.value = true
    const params = {
      file: resp.result?.accessUrl,
      format: props?.file,
    }
    _import(props.projectId, props.data.functions, props.data.command, params)
      .then((response: any) => {
        count.value = response.result.filter(item => item.success)?.length
        response.result.forEach(item => {
          if(item.success) {
            successCount.value++
          } else if(!item.success && item.type === 'data') {
            failCount.value++
          }
          failFileUrl.value = item.detailFile
        })
      })
      .catch((err) => {
        errMessage.value = err?.response?.data?.message || '导入失败'
      })
      .finally(() => {
        flag.value = false
      })
  }
}

const downloadFail = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  downloadFileByUrl(failFileUrl.value, `导入结果_${year}_${month}_${day}_${hours}_${minutes}_${seconds}`, 'xlsx')
}
</script>
