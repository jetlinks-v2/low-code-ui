<template>
  <a-upload dragger name="file" v-model:file-list="fileList" list-type="picture-card" :max-count="maxCount" :headers="{
    'X-Access-Token': LocalStore.get(TOKEN_KEY)
  }"  :before-upload="beforeUpload">
    <div>
      <p class="ant-upload-drag-icon">
        <AIcon type="CloudUploadOutlined" />
      </p>
      <p class="ant-upload-hint">将图片拖动到此处，或点击上传</p>
    </div>


    <template #itemRender="{file,actions}">
      <div class="render" >
          <a-image :src="file.url">
            <template #previewMask>
              <AIcon type="EyeOutlined" />
              <AIcon type="DeleteOutlined" style="margin-left: 10px;" @click="actions.remove()"/>
            </template>
          </a-image>
          <div class='render-name' >
            <j-input v-model:value="file.name" v-if="dbId === file.uid && dbRef" @blur="onBlur" ref="nameRef"></j-input>
            <div @dblclick="onDbClick(file)" v-else>  <j-ellipsis > {{ file.name }}</j-ellipsis></div>
          </div>
      </div>
    </template>
  </a-upload>
  <!-- <a-modal :visible="previewRef.previewVisible" :title="previewRef.previewTitle" :footer="null"  :width="400" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewRef.previewImage" />
  </a-modal> -->

  <CropperModal v-if="cropper.visible" :img="cropper.img" title="图片剪切" @cancel="cropper.visible = false" :openServer="false" @ok="saveImage" />
</template>
    
<script lang="ts" setup>
import { ref } from 'vue'
import { fileUpload } from '@/api/comm'
import { TOKEN_KEY } from '@jetlinks/constants';
import { LocalStore } from '@jetlinks/utils/src/storage';
import CropperModal from '@/components/Upload/Image/CropperModal'
import { getBase64ByImg, onlyMessage, randomString } from '@jetlinks/utils';
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
})

const cropper = reactive({
  visible: false,
  img: ''
})
const imageUrl = ref<string | undefined>('')
const fileToUpload = ref<any>(null);
const fileList = ref<any>([])


const dbRef = ref<boolean>(false)
const dbId = ref<string>('')
const nameRef =ref()




const saveImage = async (url: string) => {
  cropper.visible = false
  imageUrl.value = url
  const file = new File([url], fileToUpload.value.name, { type: fileToUpload.value.type })
  const formData = new FormData()
  formData.append('file', file)
  const res = await fileUpload(formData)
  if (res.status === 200) {
    // console.log('---------res', res.result)
    getBase64ByImg(file, base64Url => {
      fileList.value.push({
        file,
        response: res.result,
        url: base64Url,
        name:file.name,
        uid:randomString(16)
      })
    })
  }
}


const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const maxSize = props.unit === 'M' ? props.fileSize * 1024 * 1024 : props.fileSize * 1024
  const arr = file.name.split('.')
  const isType = props.accept?.length ? props.accept?.join('').includes(arr[arr.length - 1]) : true


  fileToUpload.value = file
  getBase64ByImg(file, base64Url => {
    cropper.img = base64Url
    cropper.visible = true
  })
  // return false
  return new Promise((resolve) => {
    if (maxSize < file.size) {
      onlyMessage(`文件大小必须小于${props.fileSize}${props.unit}`, 'error')
      return false
    } else if (!isType) {
      onlyMessage(`格式错误，请重新上传`, 'error')
      return false
    } else {
      return false
      // resolve(file)
    }
  })
};

const onDbClick = (file) => {
  dbId.value = file.uid
  dbRef.value = true
  nextTick(()=>{
    nameRef.value.focus()
  })
  
}

const onBlur = () => {
  dbId.value = ''
  dbRef.value = false
  console.log(fileList.value)
}


// const handleChange = async (info: UploadChangeParam) => {
//   console.log('------------', info)
//   if (!info.file.status) return
//   if (info.file.status === 'done') {
//     console.log('info', info)
//   }
// };

// const handleCancel = ()=>{
//   previewRef.previewVisible = false
//   previewRef.previewTitle = ''
// }

// const handlePreview = (file) => {
//   console.log('----', fileList.value)
//   previewRef.previewVisible = true
//   previewRef.previewTitle = file.response.name
//   previewRef.previewImage = file.response.accessUrl
// }


</script>

<style scoped lang='less'>

.render {
  padding: 8px;
  border: 1px solid #d9d9d9;
  height: 100%;
  .render-name{
    margin-top: 10px;
    width: 100%;
  }
}
</style>