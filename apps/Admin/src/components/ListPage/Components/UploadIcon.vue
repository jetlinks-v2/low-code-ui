<template>
  <div class="upload-image-warp">
    <div class="upload-image-border" :style="borderStyle">
      <j-upload
        name="file"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        v-bind="props"
      >
        <div class="upload-image-content">
          <template v-if="imageUrl">
            <img :src="imageUrl" class="upload-image" />
          </template>
          <template v-else>
            <AIcon type="PlusOutlined" style="font-size: 20px" />
          </template>
        </div>
      </j-upload>
    </div>
  </div>
  <ImageCropper
    v-if="cropperVisible"
    :img="cropperImg"
    @cancel="cropperVisible = false"
    @ok="saveImage"
    title="自定义图标"
  />
</template>

<script lang="ts" setup name="JProUpload">
import { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { onlyMessage } from '@/utils/comm'
import { CSSProperties } from 'vue'
import ImageCropper from '@/components/Upload/Image/CropperModal'

type Emits = {
  (e: 'update:modelValue', data: string): void
  (e: 'change', data: string): void
}
interface JUploadProps extends UploadProps {
  modelValue: string
  disabled?: boolean
  types?: string[]
  errorMessage?: string
  size?: number
  borderStyle?: CSSProperties
}

const emit = defineEmits<Emits>()

const props: JUploadProps = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: undefined,
  },
  borderStyle: {
    type: Object,
    default: undefined,
  },
})

const loading = ref<boolean>(false)
const imageUrl = ref<string>(props?.modelValue || '')
const imageTypes = props.types ? props.types : ['image/jpeg', 'image/png']

const cropperImg = ref()
const cropperVisible = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    imageUrl.value = newValue
  },
  {
    deep: true,
    immediate: true,
  },
)

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true
  }
  if (info.file.status === 'done') {
    imageUrl.value = info.file.response?.result
    loading.value = false
    emit('update:modelValue', info.file.response?.result)
    emit('change', info.file.response?.result)
  }
  if (info.file.status === 'error') {
    loading.value = false
    onlyMessage('上传失败', 'error')
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  debugger
  const isType = imageTypes.includes(file.type)
  const maxSize = props.size || 2 // 最大值
  if (!isType) {
    if (props.errorMessage) {
      onlyMessage(props.errorMessage, 'error')
    } else {
      onlyMessage(`请上传正确格式的图片`, 'error')
    }
    return false
  }
  const isSize = file.size / 1024 / 1024 < maxSize
  if (!isSize) {
    onlyMessage(`图片大小必须小于${maxSize}M`, 'error')
    return false
  }

  getBase64(file, (base64Url) => {
      cropperImg.value = base64Url;
      cropperVisible.value = true;
  });

  return false
}

const getBase64 = (img: File, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onload = (result: any) => {
    callback(result.target.result)
  }
}
const saveImage = (url: string) => {
  cropperVisible.value = false
  imageUrl.value = url
  emit('update:modelValue', url)
  emit('change', url)
}
</script>

<style lang="less" scoped>
@border: 1px dashed @border-color-base;
@mask-color: rgba(#000, 0.35);
@with: 96px;
@height: 96px;

.flex-center() {
  align-items: center;
  justify-content: center;
}

.upload-image-warp {
  display: flex;
  justify-content: flex-start;

  .upload-image-border {
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    :deep(.ant-upload-picture-card-wrapper) {
      width: 100%;
      height: 100%;
    }
    :deep(.ant-upload) {
      width: 100%;
      height: 100%;
    }

    :deep(.ant-upload-select-picture-card) {
      background: none !important;
      border: none !important;
    }

    .upload-image-content {
      .flex-center();
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 24px;
      height: 24px;
      background-color: rgba(#000, 0.06);
      cursor: pointer;
      // padding: 8px;

      .upload-image-mask {
        .flex-center();

        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        height: 100%;
        color: #fff;
        border-radius: 50%;
        font-size: 16px;
        background-color: @mask-color;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      &:hover .upload-image-mask {
        display: flex;
      }
    }
  }

  .upload-loading-mask {
    .flex-center();

    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: @mask-color;
  }
}
</style>
