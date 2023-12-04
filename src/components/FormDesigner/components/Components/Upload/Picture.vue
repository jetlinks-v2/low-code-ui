<template>
  <div :class="{content:maxCount ===1}" :style="{width: maxCount ===1 ?  width + 'px' : '100%', height:  maxCount ===1 ?  width + 'px' : '100%'}">
    <a-upload
    dragger
    name="file"
    v-model:file-list="fileList"
    list-type="picture-card"
    :max-count="maxCount"
    :headers="{
      [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
    }"
    :before-upload="beforeUpload"
    :accept="accept"
    :disabled="fileList.length >= maxCount || disabled"
  >
      <div v-if="(maxCount > 1 || fileList.length < maxCount) && !uploading ">
        <p class="icon">
          <AIcon type="CloudUploadOutlined" />
        </p>
        <p>将图片拖动到此处，或点击上传</p>
      </div>
      <div class="uploading" v-if="uploading" >
          <div class="loadingContainer">
            <AIcon type="LoadingOutlined" class="loading"/>
            <span>{{ `上传中${percent}%` }}</span>
          </div>
      </div>
    <template #itemRender="{ file }">
      <div class="render">
        <a-image :src="file.url" class="image"> 
          <template #previewMask>
            <AIcon type="EyeOutlined" />
            <AIcon
              v-if="!disabled"
              type="DeleteOutlined"
              style="margin-left: 10px"
              @click="onDelete(file)"
            />
          </template>
        </a-image>
        <!-- <div class="render-name">
          <j-input
            v-model:value="file.name"
            v-if="dbId === file.uid && dbRef"
            @blur="onBlur"
            ref="nameRef"
          ></j-input>
          <div @dblclick="onDbClick(file)" v-else>
            <j-ellipsis> {{ file.name }}</j-ellipsis>
          </div>
        </div> -->
      </div>
    </template>
    </a-upload>
  </div>
  <!-- <div class="bottom">单个大小限制{{ fileSize }}{{ unit }}</div> -->
  <!-- <a-modal :visible="previewRef.previewVisible" :title="previewRef.previewTitle" :footer="null"  :width="400" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewRef.previewImage" />
  </a-modal> -->
  <CropperModal
    v-if="cropper.visible"
    :img="cropper.img"
    title="图片剪切"
    @cancel="cropper.visible = false"
    :openServer="false"
    @ok="saveImage"
  />
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { fileUpload } from '@LowCode/api/comm'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { LocalStore } from '@jetlinks-web/utils/src/storage'
import CropperModal from '@LowCode/components/Upload/Image/CropperModal'
import { getBase64ByImg, onlyMessage, randomString } from '@jetlinks-web/utils'
import type { UploadProps } from 'jetlinks-ui-components'

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
  value: Array,
  disabled:{
    type:Boolean,
    default:false
  },
  width:{
    type:Number,
  }
})

const emits = defineEmits(['change'])

const cropper = reactive({
  visible: false,
  img: '',
})
const imageUrl = ref<string | undefined>('')
const fileToUpload = ref<any>(null)
const fileList = ref<any>([])
const percent = ref<any>(0)
const uploading = ref<Boolean>(false)
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
  const timer = setInterval(()=>{
    percent.value = percent.value + Math.floor(Math.random()*10)
  },300)
  if(percent.value > 90){
    clearInterval(timer)
  }
  uploading.value = true
  const res = await fileUpload(formData)
  if (res.status === 200) {
    if(timer){
      clearInterval(timer)
    }
    fileList.value.push({
      url: res.result?.accessUrl,
      name: res.result?.name,
      uid: res.result.id || randomString(16),
    })
    emits('change',fileList.value)
    uploading.value = false
    percent.value = 0
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const maxSize =
    props.unit === 'M' ? props.fileSize * 1024 * 1024 : props.fileSize * 1024
  const arr = file.name.split('.')
  const imgType = ['image/jpeg', 'image/png', 'image/jpg']
  const isType = props.accept?.length
    ? props.accept?.join('').includes(arr[arr.length - 1])
    : imgType.includes(file.type)
  // return false
  return new Promise(() => {
    if (maxSize < file.size) {
      onlyMessage(
        `该文件超过${props.fileSize}${props.unit}, 请重新上传`,
        'error',
      )
      return false
    } else if (!isType) {
      onlyMessage(`格式错误，请重新上传`, 'error')
      return false
    } else {
      fileToUpload.value = file
      getBase64ByImg(file, (base64Url) => {
        cropper.img = base64Url
        cropper.visible = true
      })
      return false
      // resolve(file)
    }
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
  // console.log(fileList.value)
}

const onDelete = (file: any) => {
  const _index = fileList.value.findIndex(item => item.uid === file?.uid)
  if(_index !== -1){
    fileList.value.splice(_index, 1)
    emits('change', fileList.value)
  }
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
.content{
  :deep(.ant-upload-picture-card-wrapper){
    height: 100%;
    width: 100%;
  }
  :deep(.ant-upload-list){
    height: 100%;
    width: 100%;
  }
  :deep(.ant-upload){
    height:100%;
    width:100%
  }
  :deep(.ant-upload-list-picture-card-container){
    height:100%;
    width:100%
  }
}
.uploading{
  height: 100%;
}
.render {
  padding: 8px;
  border: 1px solid #d9d9d9;
  height: 100%;

  .render-name {
    margin-top: 10px;
    width: 100%;
  }
}
.bottom {
  margin-top: 20px;
  color: #9c9c9c;
}
.loadingContainer{
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  .loading{
    color:blue;
    font-size:20px
  }
}

</style>
