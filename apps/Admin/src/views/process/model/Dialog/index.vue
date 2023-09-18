<!-- 新增统计指标 -->
<template>
  <j-modal
    visible
    :title="title"
    width="55%"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form
      ref="formRef"
      :model="form"
      autocomplete="off"
      :label-col="{ style: { width: '105px' } }"
    >
      <j-form-item
        name="name"
        label="流程名称"
        :rules="[{ required: true, message: '请输入流程名称' }]"
      >
        <j-input
          v-model:value="form.name"
          :maxlength="64"
          placeholder="请假申请"
        />
      </j-form-item>

      <j-form-item
        name="classificationText"
        label="流程分类"
        :rules="[{ required: true, message: '请选择流程分类' }]"
      >
        <a-select
          v-model:value="form.classificationText"
          placeholder="请选择流程分类"
          :options="providerOptions"
        >
          <template #notFoundContent>
            <div>
              <j-empty description="请前往数据字典页面配置"/>
              <!-- <div>请前往数据字典页面配置</div> -->
            </div>
          </template>
        </a-select>
      </j-form-item>

      <j-form-item
        name="icon"
        label="流程图标"
        :rules="[{ required: true, message: '请上传流程图标' }]"
      >
        <!-- <div :style="{width: '100px', height: '100px'}">
          <ImageUpload v-model:value="form.icon"
            :style="{width: '100px', height: '100px'}"
          ></ImageUpload>
        </div> -->
        <j-space>

          <div v-for="item of 4">
          
          图标{{ item }}</div>
          <j-upload
            :action="_fileUpload"
            :headers="uploader.headers"
            name="file"
            class="avatar-uploader"
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="uploader.beforeUpload"
            @change="uploader.handleChange"
          >
            <div class="upload-img-icon">
              <div v-if="form.icon" class="upload-image-mask">点击修改</div>
              <img v-if="form.icon" :src="form.icon" alt="" />
              <div v-else>
                <loading-outlined v-if="imgLoading"></loading-outlined>
                <AIcon type="PlusOutlined" />
                <!-- <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div> -->
              </div>
            </div>
          </j-upload>
        </j-space>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage, getToken } from '@jetlinks/utils'
import { saveProcess_api, providerEnum } from '@/api/process/model'
import { useRequest } from '@jetlinks/hooks'
import { _fileUpload } from '@/api/comm'
import { TOKEN_KEY, BASE_API } from '@jetlinks/constants'
// import { getToken, onlyMessage, getBase64ByImg } from "@jetlinks/utils";

type FormType = {
  id?: string
  key: string
  name: string
  model: string
  provider: string
  classificationText: string
  icon: string
}

const props = defineProps<{
  data: any
  visible: boolean
}>()

const emits = defineEmits(['refresh', 'update:visible'])

const { loading, run } = useRequest(saveProcess_api, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('操作成功')
      emits('update:visible', false)
      emits('refresh')
      // emit('ok', resp.result)
    }
  },
})

//生成随机字符串
const randomString = () => {
  return Math.random().toString(36).substring(2)
}

const providerOptions = ref([])
providerEnum().then((res) => {
  if (res.success) {
    providerOptions.value = res.result
  }
})

// const headers = { [TOKEN_KEY]: getToken() }
// const headers = {}
const imgLoading = ref(false)
const uploader = {
  headers: { [TOKEN_KEY]: getToken() },
  imageTypes: ['.jpg', '.png', '.jfif', '.pjp', '.pjpeg', '.jpeg'].toString(),
  iconTypes: ['image/x-icon'].toString(),
  beforeUpload: (file: File) => {
    const typeBool =
      uploader.imageTypes
        .split(',')
        .map((m: string) => m.split('.')[1])
        .filter((typeStr) => file.type.includes(typeStr)).length > 0
    const sizeBool = file.size / 1024 / 1024 < 4
    if (!typeBool) {
      onlyMessage(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`, 'error')
    } else if (!sizeBool) {
      onlyMessage(`图片大小必须小于4M`, 'error')
    }
    return typeBool && sizeBool
  },
  handleChange: (info) => {
    console.log(`output->info`,info)
    if (info.file.status === 'uploading') {
      imgLoading.value = true
    } else if (info.file.status === 'done') {
      info.file.url = info.file.response?.result.accessUrl
      imgLoading.value = false
      form.value.icon = info.file.response?.result.accessUrl
    } else if (info.file.status === 'error') {
      imgLoading.value = false
      onlyMessage('上传失败，请稍后再试', 'error')
    }
  },
}

const title = ref('新增')
// 表单相关
const formRef = ref<any>()
const form = ref<Partial<FormType>>({
  key: randomString(),
  // icon: `EyeOutlined`,
  model: '',
  provider: 'bpmn',
  classificationText: '分类1'
})

const confirm = () => {
  formRef.value?.validate().then(async (_data: any) => {
    run([form.value])
  })
}

const init = () => {
  title.value = '编辑'
  Object.assign(form.value, props.data)
}

watch(
  () => props.data.id,
  (val) => {
    if (val) {
      init()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.upload-img-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .upload-image-mask {
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0.35);
  }
  &:hover .upload-image-mask {
    display: flex;
  }
}
</style>
@/api/process/model