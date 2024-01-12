<template>
  <div class="content">
    <div class="ant-upload-image">
      <img v-if="!fileList?.length" src="/images/form-designer/upload-single-img.png" :width="32" />
      <img v-else :src="imgTypeMap.get(fileList.value?.[0]?.type) || imgTypeMap.get('other')" :width="32" />
    </div>
    <j-upload
        v-model:file-list="fileList"
        :maxCount="maxCount"
        :action="_fileUpload"
        :headers="headers"
        :accept="accept"
        name="file"
        :multiple="false"
        :disabled="disabled"
        :before-upload="beforeUpload"
        @change="handleChange"
    >
      <j-button v-if="!fileList?.length" :disabled="disabled">选择文件</j-button>
      <template #itemRender="{ file }">
        <j-input
            v-model:value="file.name"
            v-if="dbId === file.uid && dbRef"
            @blur="onBlur"
            class="render-left"
            ref="nameRef"
        ></j-input>
        <j-ellipsis v-else @dblclick="onDbClick(file)">{{ file.name }}</j-ellipsis>
      </template>
    </j-upload>
    <p v-if="!fileList?.length" class="ant-upload-drag-sub-tip">{{ text ? `支持格式:${text}` : `支持所有格式` }}</p>
    <j-button style="color: #6B6F7F;" v-else size="small" @click="onDelete(fileList?.[0])" :disabled="disabled">删除</j-button>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import type { UploadProps, UploadChangeParam } from 'jetlinks-ui-components'
import { _fileUpload } from '@LowCode/api/comm'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { LocalStore } from '@jetlinks-web/utils/src/storage'
import {downloadFileByUrl, onlyMessage} from '@jetlinks-web/utils'
import { downloadFile } from '@LowCode/api/form'
import {imgTypeMap} from "../data";

const props = defineProps({
  fileSize: {
    type: Number,
    default: 2,
  },
  unit: {
    type: String,
    default: 'M',
  },
  accept: {
    type: Array,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  headers: {
    type: Object,
    default: {
      [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
    },
  },
  value: Array,
  disabled: {
    type: Boolean,
    default: false,
  },
  noAccept:{
    type:Array,
    // default:['.exe','.xlsx']
    default:[]
  }
})

const emits = defineEmits(['change'])

const fileList = ref<any[]>([])
const dbRef = ref<boolean>(false)
const dbId = ref<string>('')
const nameRef = ref()
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const maxSize =
      props.unit === 'M' ? props.fileSize * 1024 * 1024 : props.fileSize * 1024
  const arr = file.name.split('.')
  const isType = props.accept?.length
      ? props.accept?.join('').includes(arr[arr.length - 1])
      : true
  const isNotType= props.noAccept?.length
      ? props.noAccept?.join('').includes(arr[arr.length - 1])
      : false

  return new Promise((resolve) => {
    if (maxSize < file.size) {
      onlyMessage(
          `该文件超过${props.fileSize}${props.unit}, 请重新上传`,
          'error',
      )
      return false
    } else if (!isType) {
      onlyMessage(`格式错误,支持${text.value}格式，请重新上传`, 'error')
      return false
    }else if (isNotType) {
      onlyMessage(`格式错误,支持${text.value}格式，请重新上传`, 'error')
      return false
    } else {
      resolve(file)
    }
  })
}

const text = computed(()=>{
  let str = ''
  if(props.accept?.length!==0){
    str = str + props.accept?.join('、')
  }
  if(props.noAccept?.length!==0){
    str = str +' 非'+ props.noAccept?.join('、非')
  }
  return str &&str!=='undefined' ? str:''
})

const handleChange = async (info: UploadChangeParam) => {
  if (!info.file.status) return
  if (info.file.status === 'done') {
    const arr = fileList.value.map((item) => ({
      name: item.name,
      url: item.response?.result?.accessUrl || item.url,
      uid: item.uid,
      type: item.extension || item.name?.split('.')?.pop()
    }))
    emits('change', arr)
    onlyMessage('上传成功！', 'success')
  }
}

const onDelete = (file: any) => {
  const _index = fileList.value.findIndex((item) => item.uid === file?.uid)
  if (_index !== -1) {
    fileList.value.splice(_index, 1)
    emits('change', fileList.value)
  }
}

const onLoad = (_file: any) => {
  downloadFile(_file?.url).then(resp => {
    const blob = new Blob([resp.data]);
    const _url = URL.createObjectURL(blob);
    downloadFileByUrl(_url, _file?.name)
  })
}

const onDbClick = (file) => {
  if(props.disabled){
    return
  }
  dbId.value = file.uid
  dbRef.value = true
  nextTick(() => {
    nameRef.value.focus()
  })
}

const onBlur = () => {
  dbId.value = ''
  dbRef.value = false
}

watch(
    () => props.value,
    (val) => {
      fileList.value = val || []
    },
    {
      immediate: true,
    },
)
</script>

<style scoped lang='less'>
.content {
  width: 240px;
  height: 184px;
  border: 1px solid #E7E9EF;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  .ant-upload-drag-sub-tip {
    color: #6B6F7F;
    font-size: 12px;
  }
}

:deep(.ant-upload){
  display: flex !important;
  justify-content: center;
}

:deep(.ant-upload-list){
  width: 180px;
}

:deep(.ant-upload-list-text-container) {
  margin-top: 0;
  width: 100%;
  border: none;
  height: 30px;
}
</style>
