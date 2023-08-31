<template>
  <div>
    <a-upload-dragger
      v-model:file-list="fileList"
      :multiple="maxCount > 1"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      :before-upload="beforeUpload"
    >
      <div>
        <p class="ant-upload-drag-icon">
          <AIcon type="CloudUploadOutlined" />
        </p>
        <p class="ant-upload-hint">将文件拖动到此处，或点击上传</p>
      </div>
    </a-upload-dragger>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import type { UploadProps } from 'jetlinks-ui-components'

const props = defineProps({
  size: {
    type: Number,
    default: 2,
  },
  unit: {
    type: String,
    default: 'M',
  },
  accept: {
    type: String,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  headers: {
    type: Object,
    default: () => {}
  }
})

const fileList = ref([])

const beforeUpload = (file: UploadProps['fileList'][number]) => {
    // const isType = imageTypes.includes(file.type);
    // const maxSize = props.size || 2 // 最大值
    // if (!isType) {
    //     if (props.errorMessage) {
    //         onlyMessage(props.errorMessage, 'error');
    //     } else {
    //         onlyMessage(`请上传正确格式的图片`, 'error');
    //     }
    //     return false;
    // }
    // const isSize = file.size / 1024 / 1024 < maxSize;
    // if (!isSize) {
    //     onlyMessage(`图片大小必须小于${maxSize}M`, 'error');
    //     return false
    // }

    // getBase64(file, (base64Url) => {
    //   cropperImg.value = base64Url
    //   cropperVisible.value = true
    // })

    // return false;
};
</script>