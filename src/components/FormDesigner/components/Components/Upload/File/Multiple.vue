<template>
  <div class="content">
    <a-upload-dragger
        v-model:file-list="fileList"
        :maxCount="maxCount"
        :action="_fileUpload"
        :headers="headers"
        :accept="accept"
        name="file"
        :multiple="maxCount > 1"
        :disabled="disabled"
        :before-upload="beforeUpload"
        @change="handleChange"
        @drop="handleDrop"
    >
      <div>
        <div class="ant-upload-drag-icon">
          <img src="/images/form-designer/upload-img.png" />
        </div>
        <p class="ant-upload-drag-tip">点击或将文件拖拽到此区域</p>
        <p class="ant-upload-drag-sub-tip">{{ text ? `支持格式:${text}` : `支持所有格式` }}</p>
      </div>
      <template #itemRender="{ file }">
        <div class="render">
          <j-input
              v-model:value="file.name"
              v-if="dbId === file.uid && dbRef"
              @blur="onBlur"
              class="render-left"
              ref="nameRef"
          ></j-input>
          <div class="render-left" @dblclick="onDbClick(file)" v-else>
            <div class="render-left-image">
              <img :src="imgTypeMap.get(file.type) || imgTypeMap.get('other')" :width="32" />
              <j-ellipsis>{{ file.name }}</j-ellipsis>
            </div>
            <j-progress :percent="file.percent.toFixed(2)" size="small" trailColor="#eaf2fe" v-if="file.status === 'uploading'"></j-progress>
          </div>
          <j-space>
            <j-button
                type="link"
                style="padding: 0"
                @click="onDelete(file)"
                :disabled="disabled"
                danger
            >
              <AIcon type="DeleteOutlined" />
            </j-button>
            <j-button
                type="link"
                style="padding: 0"
                @click="onLoad(file)"
            >
              <AIcon type="DownloadOutlined" />
            </j-button>
          </j-space>
        </div>
      </template>
    </a-upload-dragger>
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

const text = computed(()=>{
  let str = ''
  if(props.accept?.length!==0){
    str = str+ props.accept?.join('、')
  }
  if(props.noAccept?.length!==0){
    str = str +' 非'+ props.noAccept?.join('、非')
  }
  return str && str!=='undefined' ? str:''
})

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
    if(props.maxCount <= fileList.value?.length){
      onlyMessage(
          `上传图片数量不能超出最大上传数量${props.maxCount || 1}个`,
          'error',
      )
      return false
    } else if (maxSize < file.size) {
      onlyMessage(
          `该文件超过${props.fileSize}${props.unit}, 请重新上传`,
          'error',
      )
      return false
    } else if (!isType) {
      onlyMessage(`格式错误，请重新上传`, 'error')
      return false
    } else if(isNotType){
      onlyMessage(`格式错误，请重新上传`, 'error')
      return false
    }else {
      resolve(file)
    }
  })
}

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

const handleDrop = (e) => {
  // console.log(e, 'drop')
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
  & > span {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  :deep(.ant-upload.ant-upload-drag) {
    padding: 20px 0;
    background-color: #FFFFFF;
    width: calc(50% - 12px);
    min-width: 350px;
    border: 2px dashed rgba(224, 226, 233);
  }
  .ant-upload-drag-tip {
    color: #191C27;
    font-size: 16px;
    margin-top: 10px;
  }

  .ant-upload-drag-sub-tip {
    color: #6B6F7F;
    font-size: 12px;
  }
}

:deep(.ant-upload-list){
  width: calc(50% - 12px);
  min-width: 350px;
  overflow-y: auto;
  max-height: 256px;
  padding: 0 10px;
}

:deep(.ant-upload-list-text-container) {
  display: flex;
  width: 100%;
  margin-top: 0;
  margin-bottom: 12px;
  border: 1px solid #E0E2E9;
}

.render {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  width: 100%;
  height: 56px;

  .render-left {

    .render-left-image {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }
}
</style>
