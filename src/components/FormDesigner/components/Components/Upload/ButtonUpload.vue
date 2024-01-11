<template>
  <a-upload name="file" v-model:file-list="fileList" :max-count="maxCount" :headers="{
        [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
    }" :before-upload="beforeUpload" :accept="accept" :disabled="fileList.length >= maxCount || disabled"
            @change="handleChange" :action="listType ==='text' ? _fileUpload : ''">
    <j-button :disabled="fileList.length >= maxCount || disabled">
      <template #icon>
        <AIcon type="UploadOutlined"></AIcon>
      </template>
      上传文件
    </j-button>
    <template #itemRender="{ file }">
      <div class="render">
        <div class="render-left">
          <j-input
              v-model:value="file.name"
              v-if="dbId === file.uid && dbRef"
              @blur="onBlur"
              ref="nameRef"
          ></j-input>
          <div v-else class="render-left-image">
            <img :src="imgTypeMap.get(file.type) || imgTypeMap.get('other')" :width="32"/>
            <j-ellipsis @dblclick="onDbClick(file)">{{ file.name }}</j-ellipsis>
          </div>
        </div>
        <j-space>
          <j-button danger type="link" @click="onDelete(file)">
            <AIcon type="DeleteOutlined"/>
          </j-button>
        </j-space>
      </div>
    </template>
  </a-upload>
  <CropperModal v-if="cropper.visible" :img="cropper.img" title="图片剪切" @cancel="cropper.visible = false"
                :openServer="false" @ok="saveImage"/>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue'
import {fileUpload} from '@LowCode/api/comm'
import {_fileUpload} from '@LowCode/api/comm'
import {TOKEN_KEY} from '@jetlinks-web/constants'
import {LocalStore} from '@jetlinks-web/utils/src/storage'
import CropperModal from '@LowCode/components/Upload/Image/CropperModal'
import {getBase64ByImg, onlyMessage, randomString} from '@jetlinks-web/utils'
import type {UploadProps, UploadChangeParam} from 'jetlinks-ui-components'
import {imgTypeMap} from "./data";

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
  listType: {
    type: String,
    default: 'picture',
  },
  value: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['change'])

const cropper = reactive({
  visible: false,
  img: '',
})
const imageUrl = ref<string | undefined>('')
const fileToUpload = ref<any>(null)
const fileList = ref<any>([])

const dbRef = ref<boolean>(false)
const dbId = ref<string>('')
const nameRef = ref()

const saveImage = async (url: string) => {
  cropper.visible = false
  imageUrl.value = url
  const file = new File([url], fileToUpload.value.name, {
    type: fileToUpload.value.type,
  })
  const formData = new FormData()
  formData.append('file', file)
  const res = await fileUpload(formData)
  if (res.status === 200) {
    fileList.value.push({
      url: res.result?.accessUrl,
      name: res.result?.name,
      uid: res.result.id || randomString(16),
      type: item.extension || item.name?.split('.')?.pop()
    })
    emits('change', fileList.value)
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const maxSize =
      props.unit === 'M' ? props.fileSize * 1024 * 1024 : props.fileSize * 1024
  const arr = file.name.split('.')
  const imgType = ['image/jpeg', 'image/png', 'image/jpg']
  const isType = props.accept?.length
      ? props.accept?.join('').includes(arr[arr.length - 1])
      : props.listType === 'picture' ? imgType.includes(file.type) : true
  return new Promise((resolve) => {
    if(props.maxCount <= fileList.value?.length){
      onlyMessage(
          `上传图片数量不能超出最大上传数量${props.maxCount || 1}个`,
          'error',
      )
      return false
    } else  if (maxSize < file.size) {
      onlyMessage(
          `该文件超过${props.fileSize}${props.unit}, 请重新上传`,
          'error',
      )
      return false
    } else if (!isType) {
      onlyMessage(`格式错误，请重新上传`, 'error')
      return false
    } else if (props.listType === 'picture') {
      fileToUpload.value = file
      getBase64ByImg(file, (base64Url) => {
        cropper.img = base64Url
        cropper.visible = true
      })
      return false
      // resolve(file)
    } else {
      resolve(true)
    }
  })
}

const handleChange = async (info: UploadChangeParam) => {
  if (props.listType === 'text') {
    if (!info.file.status) return
    if (info.file.status === 'done') {
      // console.log(fileList.value)
      const arr = fileList.value.map((item) => ({
        name: item.name,
        url: item.response?.result?.accessUrl || item.url,
        uid: item.uid,
      }))
      emits('change', arr)
      onlyMessage('上传成功！', 'success')
    }
  }
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
  emits('change', fileList.value)
}

const onDelete = (file: any) => {
  const _index = fileList.value.findIndex(item => item.uid === file?.uid)
  if (_index !== -1) {
    fileList.value.splice(_index, 1)
    emits('change', fileList.value)
  }
}

watch(
    () => props.value,
    (val) => {
      try {
        fileList.value = val || []
      } catch (error) {
        console.error(error)
      }
    },
    {
      immediate: true,
    },
)
</script>

<style scoped lang='less'>
:deep(.ant-upload-list) {
  min-width: 500px;
  overflow-y: auto;
  max-height: 256px;
}

:deep(.ant-upload-list-text-container) {
  display: flex;
  width: 100%;
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
