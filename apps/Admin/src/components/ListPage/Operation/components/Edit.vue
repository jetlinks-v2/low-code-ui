<template>
  <div class="edit-btn">
    <j-form :model="form" layout="vertical" ref="formRef" :rules="rules">
      <j-form-item
        label="请输入按钮名称"
        v-if="activeBtn!.type == 'customer'"
        name="title"
      >
        <ErrorItem :errorData="errorMessage['title']">
          <j-input v-model:value="form.title" :maxlength="8"></j-input>
        </ErrorItem>
      </j-form-item>
      <j-form-item :label="iconType ? '图标' : '自定义图标'">
        <div class="default-btn" v-if="iconType">
            <AIcon
            :type="activeBtn?.icon"
            class="default-icon custom"
          />
        </div>
        <!-- <UploadIcon v-model:modelValue="form.icon" v-else /> -->
        <div class="custom-upload" v-else>
          <Upload v-model:value="form.icon" accept=".jpg,.jpeg,.png" :borderStyle="{border: 'none'}" cropperTitle="自定义图标">
            <template #content="{imageUrl}">
              <template v-if="imageUrl">
                <div class="default-btn">
                  <img :src="imageUrl" class="upload-image" />
                </div>
              </template>
              <template v-else>
                <div class="default-btn">
                  <AIcon type="PlusOutlined"  class="default-icon"/>
                </div>
              </template>
            </template>
          </Upload>
        </div>
      </j-form-item>
      <template v-if="activeBtn!.type !== 'customer'">
        <j-row :gutter="20" v-if="activeBtn?.type !== 'Detail'">
          <j-col :span="12">
            <j-form-item
              label="调用功能"
              name="functions"
            >
              <ErrorItem :errorData="errorMessage['functions']">
                <j-select
                v-model:value="form.functions"
                placeholder="请选择调用功能"
              >
                <j-select-option
                  v-for="item in functionOptions"
                  :value="item.fullId"
                  :key="item.id"
                  :title="item.title"
                >
                  <img :src="getImages(item.type)" class="options-img">
                  {{ item.title }}
                </j-select-option>
              </j-select>
              </ErrorItem>
            </j-form-item>
          </j-col>
          <j-col :span="12">
            <j-form-item
              label=" "
              name="command"
            >
              <ErrorItem :errorData="errorMessage['command']">
                <j-select
                  v-model:value="form.command"
                  placeholder="当前功能下无可用接口"
                  disabled
                >
                  <j-select-option
                    v-for="item in commandOptions"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.name }}</j-select-option
                  >
                </j-select>
              </ErrorItem>
            </j-form-item>
          </j-col>
        </j-row>
        <j-form-item
          label="调用页面"
          v-if="
            activeBtn?.type === 'Add' ||
            activeBtn?.type === 'Update' ||
            activeBtn?.type === 'Detail'
          "
          name="pages"
        >
          <ErrorItem :errorData="errorMessage['pages']">
            <j-select v-model:value="form.pages" placeholder="请选择调用页面" @change="handlePages">
              <j-select-option
                v-for="item in pagesOptions"
                :value="item.id"
                :key="item.id"
              >
                <img :src="getImages(item.type)" class="options-img">
                {{ item.name }}
              </j-select-option>
            </j-select>
          </ErrorItem>
        </j-form-item>
      </template>
      <j-form-item label="自定义脚本">
        <j-select style="width: 100%;" v-model:value="language">
            <j-select-option value="javascript">JS</j-select-option>
            <j-select-option value="css">CSS</j-select-option>
        </j-select>
        <EditorModal v-if="language==='javascript'" v-model:value="form.script" language="javascript"/>
        <EditorModal v-else v-model:value="form.style" language="css"/>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts" name="Edit">
import Upload from '@/components/Upload/Image/ImageUpload.vue'

import { FormInstance } from 'jetlinks-ui-components'
import { useProduct } from '@/store'
import EditorModal from '@/components/EditorModal'
import { activeBtnKey, errorListKey, editTypeKey } from '../keys'
import { providerEnum } from '@/components/ProJect'
import { ErrorItem } from '../..'
import { useFunctions } from '@/hooks/useFunctions'
import { useImages } from '../../hooks/useImages'
import { pick } from 'lodash-es'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  steps: {
    type: String,
  },
})

const activeBtn = inject(activeBtnKey)
const editType = inject(editTypeKey)
const errorList = inject(errorListKey)

const productStore = useProduct();
const { info } = productStore
const { functionOptions, commandOptions, handleFunction } = useFunctions()
const { getImages } = useImages();

const functionName = computed(() => {
  return (title: string, moduleId: string) => {
    if(moduleId) {
      const moduleIdArr = moduleId.split('.')
      return `${moduleIdArr[moduleIdArr.length - 1]}-${title}`
    } else {
      return title
    }
  }
})
const errorMessage = computed(() => {
  let data = {}
  let result = errorList!.value?.filter(
    (item) => item.key === activeBtn?.value.key,
  )
  if (result) {
    result.forEach((item) => {
      data[item.errorKey] = item
    })
  }
  return data
})

const pagesOptions = computed(() => {
  let arr: any[] = [];
  productStore.getDataMap()?.forEach((value) => {
    if(value.type === providerEnum.HtmlPage || value.type === providerEnum.FormPage) {
      arr.push(value)
    }
  })
  return arr;
})

const iconType = computed(() => {
  return activeBtn?.value.icon && activeBtn?.value.type !== 'customer'
})

const formRef = ref<FormInstance>()
const form = reactive({
  title: props.data.title,
  icon: props.data.icon,
  type: props.data.type,
  script: props.data.script,
  key: props.data.key,
  functions:
    editType!.value === 'add' &&
    functionOptions!.value.find((item) => item.fullId === props.data.functions)
      ?.provider === providerEnum.Function
      ? null
      : props.data.functions,
  pages: props.data.pages,
  command: !props.data.functions || functionOptions!.value.find((item) => item.fullId === props.data.functions)
      ?.provider === providerEnum.Function
      ? null
      : props.data.command,
  style: props.data.style,
  resource: props.data.resource
})

const rules = {
  title: [{ required: true, trigger: 'blur',validator: (_rule, value: string) => {
    if(!value || !value.length) {
      return Promise.reject('请输入按钮名称')
    }
    if(value.length > 8 || value.length < 2) {
      return Promise.reject('请输入2-8个字符')
    }
    return Promise.resolve()
  }}],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  functions: [{ required: true, message: '请选择功能', trigger: 'blur' }],
  command: [{ required: true, message: '请选择调用指令', trigger: 'blur' }],
  pages: [{ required: true, message: '请选择调用页面', trigger: 'blur' }],
}

const handlePages = (val: string) => {
  const data = pagesOptions.value.find(item => item.id === val)
  console.log(pagesOptions);
  form.resource = {...pick(data, ['id', 'parentId', 'type']), projectId: info.id}
  form.resource.parentId = `${form.resource.projectId}.${form.resource.parentId}`
}
const submit = async () => {
  return { ...form, children: activeBtn?.value.children || [] }
}

const language = ref('javascript')
watch(
  () => form.functions,
  () => {
    if (form.functions && form.functions !== '') {
      handleFunction(form.functions)
    }
  },
  { immediate: true },
)

watch(() => commandOptions.value, () => {
  form.command = commandOptions.value?.find(item => item.id === form.type)?.id
})
defineExpose({
  submit,
})
</script>
<style scoped lang="less">
.edit-btn {
  .default-btn{
    width: 48px;
    height: 48px;
    background: #F0F1F4;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    .custom {
      cursor: not-allowed;
    }
    .default-icon {
      border: 1px dashed #d9d9d9;
      padding: 5px;
    }
  }
  form {
    padding: 20px;
  }
  .custom-upload {
    width: 48px;
    height: 48px;
    .upload-image {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
