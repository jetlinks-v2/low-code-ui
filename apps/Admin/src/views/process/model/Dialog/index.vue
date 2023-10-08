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
        name="classifiedId"
        label="流程分类"
        :rules="[{ required: true, message: '请选择流程分类' }]"
      >
        <a-select
          v-model:value="form.classifiedId"
          placeholder="请选择流程分类"
          :options="providerOptions"
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
        <j-space>
          <div class="upload-icon" v-for="item of baseIcon">
            <AIcon :type="item" />
          </div>
          <div class="upload-icon">
            <ImageUpload v-model:value="form.icon" :accept="accept" />
          </div>
        </j-space>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage, randomString } from '@jetlinks/utils'
import { saveProcess_api, providerEnum } from '@/api/process/model'
import { useRequest } from '@jetlinks/hooks'
import { _fileUpload } from '@/api/comm'

type FormType = {
  id?: string
  key: string
  name: string
  icon: string
  classifiedId: string
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

const { data: providerOptions } = useRequest(providerEnum)

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
.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  font-size: 40px;
  border: 1px dashed #ccc;
}
</style>
