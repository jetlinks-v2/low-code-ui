<!-- 新增统计指标 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    :title="title"
    :width="700"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form ref="formRef" :model="form" autocomplete="off" layout="vertical">
      <j-form-item
        name="name"
        label="流程名称"
        :rules="[
          { required: true, message: '请输入流程名称' },
          {
            max: 64,
            message: '最多输入64个字符',
          },
        ]"
      >
        <j-input
          v-model:value="form.name"
          placeholder="请假申请"
          style="width: 576px"
        />
      </j-form-item>

      <j-form-item
        name="classifiedId"
        label="流程分类"
        :rules="[{ required: true, message: '请选择流程分类' }]"
      >
        <a-select
          v-model:value="form.classifiedId"
          placeholder="请选择流程分类"
          :options="classified"
          style="width: 576px"
        >
          <template #notFoundContent>
            <div>
              <j-empty description="请前往数据字典页面配置" />
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
        <j-space :size="24">
          <div class="base-icon" v-for="(item, index) of baseIcon">
            <div class="upload-icon">
              <AIcon :type="item" />
            </div>
            <div>图标{{ index + 1 }}</div>
          </div>
          <div class="base-icon">
            <div class="upload-icon">
              <ImageUpload v-model:value="form.icon" :accept="accept">
                <template #content="{ imageUrl }">
                  <div v-if="imageUrl">
                    <ProImage
                      v-if="isImg(imageUrl)"
                      :src="imageUrl"
                      :width="48"
                      :preview="false"
                    />
                    <AIcon
                      v-else
                      :type="form.icon"
                      :style="{ fontSize: '16px' }"
                    />
                    <div class="upload-image-mask">更换</div>
                  </div>
                  <AIcon v-else type="PlusOutlined" style="font-size: 20px" />
                </template>
              </ImageUpload>
              <!-- <div>自定义</div> -->
            </div>
            <div>自定义</div>
          </div>
        </j-space>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage, randomString } from '@jetlinks/utils'
import { saveProcess_api } from '@/api/process/model'
import { useRequest } from '@jetlinks/hooks'
import { useClassified } from '@/hooks/useClassified'
import { isImg } from '@/utils/comm'

type FormType = {
  key: string
  name: string
  classifiedId: string
  icon: string
  model: string
  provider: string
}

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
  (e: 'refresh'): void
}>()

const { classified, getText } = useClassified()
const baseIcon = [
  'icon-shujumoni',
  'icon-tongzhiguanli',
  'icon-rizhifuwu',
  'icon-keshihua',
]

// 上传icon格式
const accept = '.jpg,.jpeg,.png'
const title = ref<string>('新增')
const formRef = ref<any>()
// 表单相关
const form = reactive<Partial<FormType>>({
  key: randomString(),
  model: '',
  provider: 'wflow',
})

// const { data: providerOptions } = useRequest(providerEnum)

const { loading, run } = useRequest(saveProcess_api, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('操作成功')
      emits('update:visible', false)
      emits('refresh')
    }
  },
})

const confirm = () => {
  formRef.value?.validate().then((_data: any) => {
    run([form])
  })
}

const init = () => {
  title.value = '编辑'
  Object.assign(form, props.data)
  getText(form.classifiedId) ? '' : form.classifiedId = ''
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
.base-icon {
  text-align: center;
}
.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  // font-size: 16px;
  border-radius: 4px;
  border: 1px dashed #dcdcdc;
  background: #eeeeee;

  :deep(.upload-image-content) {
    &:hover .upload-image-mask {
      display: flex;
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
      background-color: rgba(#000, 0.25);
    }
  }
}
</style>
