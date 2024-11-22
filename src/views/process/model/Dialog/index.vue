<!-- 新增统计指标 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    :title="title"
    :width="700"
    @cancel="cancel"
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
          showSearch
          v-model:value="form.classifiedId"
          placeholder="请选择流程分类"
          :options="classified"
          :filterOption="filterOption"
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
        name="key"
        :rules="keyRules"
        validateFirst
      >
        <template #label>
          <span style="padding-right: 8px">流程标识</span>
          <j-tooltip
            title="根据标识调用流程模型/实例"
          >
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-input
          v-model:value="form.key"
          placeholder="请输入流程标识"
          style="width: 576px"
        />
      </j-form-item>
      <j-form-item
        name="icon"
        label="流程图标"
        :rules="[{ required: true, message: '请上传流程图标' }]"
      >
        <j-radio-group v-model:value="form.icon" class="radio">
          <j-radio-button
            v-for="(item, index) of baseIcon"
            :value="item"
            :key="item"
            :class="{ active: form.icon === item }"
          >
            <!-- <AIcon :type="typeStr" /> -->
            <ProImage
              style="border: 1px dashed #dcdcdc"
              :src="item"
              :width="44"
              :preview="false"
            />
            <div>图标{{ index + 1 }}</div>
          </j-radio-button>
          <j-radio-button
            :value="selected"
            :class="{ active: form.icon === selected }"
          >
          <div class="upload-img-icon">
            <div class="upload-icon">
              <ImageUpload v-model:value="selected" :accept="accept">
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
                      :type="selected"
                      :style="{ fontSize: '16px' }"
                    />
                    <div class="upload-image-mask">更换</div>
                  </div>
                  <AIcon v-else type="PlusOutlined" style="font-size: 20px" />
                </template>
              </ImageUpload>
            </div>
          </div>
            <div>自定义</div>
          </j-radio-button>
        </j-radio-group>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage, regular } from '@jetlinks-web/utils'
import {saveProcess_api, getProcess_api, update_api} from '@LowCode/api/process/model'
import { useRequest } from '@jetlinks-web/hooks'
import { isImg } from '@LowCode/utils/comm'
import { providerEnum } from '@LowCode/api/process/model'
import { getImage } from '@jetlinks-web/utils'
import { ImageUpload ,  ProImage } from '@LowCode/components/index'

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
  isDeploy: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
  (e: 'refresh'): void
  (e: 'cancel'): void
}>()

// const { classified, getText } = useClassified()
const baseIcon = [
  getImage(`/process/model/icon1.png`),
  getImage(`/process/model/icon2.png`),
  getImage(`/process/model/icon3.png`),
  getImage(`/process/model/icon4.png`),
]

// 上传icon格式
const accept = '.jpg,.jpeg,.png'
const title = ref<string>('新增')
const formRef = ref<any>()
const selected = ref<string>()
// 表单相关
const form = reactive<Partial<FormType>>({
  key: '',
  model: '',
  provider: 'wflow',
  classifiedId: undefined
})

const keyRules = [
  { required: true, message: '请输入流程标识' },
  {
    validator: async (_: any, value: string) => {
      if (value && !props.data.id) {

        if (!regular.isEnglishOrNumber(value)) {
          return Promise.reject('只允许输入英文或者数字')
        }

        // const res = await getProcess_api({ terms:[{ column: 'key', termType: 'eq', value: value}]})
        //
        // if (res.success && res.result && res.result.total > 0) {
        //   return Promise.reject('流程标识重复')
        // }
        return Promise.resolve()
      }
      return Promise.resolve()
    },
    trigger: 'blur'
  },
  {
    max: 64,
    message: '最多输入64个字符',
  },
]

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const { data: classified } = useRequest(providerEnum, {
  immediate: true,
  onSuccess(res) {
    const op = res.result.map((item) => {
      return {
        label: item.text,
        value: item.id,
      }
    })
    op.some((i) => i.value === form.classifiedId)
      ? ''
      : (form.classifiedId = undefined)
    return op
  },
})

const { loading, run } = useRequest(props.data.id ? update_api : saveProcess_api, {
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
    run(form)
  })
}

const init = () => {
  title.value = props.isDeploy ? '部署' : '编辑'
  Object.assign(form, props.data)
  selected.value = baseIcon.some((i) => i === form.icon) ? '' : form.icon
}

const cancel = () => {
  emits('update:visible', false)
  emits('cancel')
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
watch(selected, (val) => {
  form.icon = val
  formRef.value?.validateFields(['icon'])
})
</script>

<style lang="less" scoped>
.base-icon {
  text-align: center;
}
.radio {
  display: flex;
  gap: 24px;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    text-align: center;

    border: 2px solid #efefef;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: #415ed1;
      border-color: #415ed1;
    }
    :deep(.upload-image-content) {
      width: 44px !important;
      height: 44px !important;
      padding: 0;
      background: #fff;
    }
    :deep(.ant-upload.ant-upload-select-picture-card) {
      margin: 0;
    }
  }
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
