<template>
  <div class="content">
    <a-upload-dragger v-model:file-list="fileList" :maxCount="maxCount" :action="_fileUpload" :headers="headers"
      :accept="accept" :before-upload="beforeUpload" @change="handleChange">
      <div>
        <p class="ant-upload-drag-icon">
          <AIcon type="CloudUploadOutlined" />
        </p>
        <p class="ant-upload-hint">将文件拖动到此处，或点击上传</p>
      </div>
      <template #itemRender="{ file, actions }">
        <div class="render">
          <j-input v-model:value="file.name" v-if="dbId === file.uid && dbRef" @blur="onBlur" ref="nameRef"></j-input>
          <div @dblclick="onDbClick(file)" v-else>{{ file.name }}</div>
          <j-button type="link" style="width: 10%;" @click="actions.remove">
            <AIcon type="DeleteOutlined" />
          </j-button>
        </div>
      </template>
    </a-upload-dragger>
    <div class="bottom">单个大小限制{{ fileSize }}{{ unit }}</div>
  </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadProps, UploadChangeParam } from 'jetlinks-ui-components'
import { _fileUpload } from '@/api/comm'
import { onlyMessage } from '@/utils/comm';
import { TOKEN_KEY } from '@jetlinks/constants';
import { LocalStore } from '@jetlinks/utils/src/storage';


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
      [TOKEN_KEY]: LocalStore.get(TOKEN_KEY)
    }
  },
  value:Array
})

const emits = defineEmits(['change'])

const fileList = ref<any>([])
const dbRef = ref<boolean>(false)
const dbId = ref<string>('')
const nameRef =ref()


const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // console.log('props.accept----', props.accept, file)
  const maxSize = props.unit === 'M' ? props.fileSize * 1024 * 1024 : props.fileSize * 1024
  const arr = file.name.split('.')
  const isType =props.accept?.length? props.accept?.join('').includes(arr[arr.length - 1]):true

  return new Promise((resolve) => {
    if (maxSize < file.size) {
      onlyMessage(`该文件超过${props.fileSize}${props.unit}, 请重新上传`, 'error')
      // reject(file)
      return false
    } else if (!isType) {
      onlyMessage(`格式错误，请重新上传`, 'error')
        return false
    }
    else {
      resolve(file)
    }
  })
};

const handleChange = async (info: UploadChangeParam) => {
  if (!info.file.status) return
  if (info.file.status === 'done') {
    // console.log(fileList.value)
    const arr = fileList.value.map(item=>({
      name:item.name,
      url:item.response?.result?.accessUrl || item.url,
      uid:item.uid
    }))
    emits('change',arr)
    onlyMessage('上传成功！', 'success');
  }
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
}


watch(
  ()=>props.value,
  (val)=>{
    // console.log('val',val)
    if(val){
      fileList.value = val
    }
   
  }
)

</script>

<style scoped lang='less'>
.content {
  &>span {
    display: flex;
    flex-direction: column-reverse;
  }

  :deep(.ant-upload.ant-upload-drag) {
    margin-top: 10px;
  }
  .bottom{
    margin-top: 20px;
    color: #9c9c9c;
  }
}

:deep(.ant-upload-list-text-container) {
  display: flex;
}

.render {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
</style>