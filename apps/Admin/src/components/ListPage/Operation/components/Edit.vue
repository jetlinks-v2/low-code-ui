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
          <AIcon :type="activeBtn?.icon" class="default-icon custom" />
        </div>
        <!-- <UploadIcon v-model:modelValue="form.icon" v-else /> -->
        <div class="custom-upload" v-else>
          <Upload
            v-model:value="form.icon"
            accept=".jpg,.jpeg,.png"
            :borderStyle="{ border: 'none' }"
            cropperTitle="自定义图标"
          >
            <template #content="{ imageUrl }">
              <template v-if="imageUrl">
                <div class="default-btn">
                  <img :src="imageUrl" class="upload-image" />
                </div>
              </template>
              <template v-else>
                <div class="default-btn">
                  <AIcon
                    v-if="type === 'columns'"
                    type="SettingOutlined"
                    class="default-icon"
                  />
                  <AIcon v-else type="PlusOutlined" class="default-icon" />
                </div>
              </template>
            </template>
          </Upload>
        </div>
      </j-form-item>
      <template v-if="activeBtn!.type !== 'customer'">
        <template v-if="activeBtn!.type !== 'Relation'">
          <j-row :gutter="20" v-if="activeBtn?.type !== 'Detail'">
            <j-col :span="12">
              <j-form-item label="调用功能" name="functions">
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
                      <img :src="getImages(item.type)" class="options-img" />
                      {{ item.title }}
                    </j-select-option>
                  </j-select>
                </ErrorItem>
              </j-form-item>
            </j-col>
            <j-col :span="12">
              <j-form-item label=" " name="command">
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
          <template
            v-if="
              activeBtn?.type === 'Add' ||
              activeBtn?.type === 'Update' ||
              activeBtn?.type === 'Detail'
            "
          >
            <j-form-item label="调用页面" name="pages">
              <ErrorItem :errorData="errorMessage['pages']">
                <j-select
                  v-model:value="form.pages"
                  placeholder="请选择调用页面"
                  @change="handlePages"
                >
                  <j-select-option
                    v-for="item in pagesOptions"
                    :value="item.id"
                    :key="item.id"
                  >
                    <img :src="getImages(item.type)" class="options-img" />
                    {{ item.name }}
                  </j-select-option>
                </j-select>
              </ErrorItem>
            </j-form-item>
            <j-form-item label="页面弹窗宽度" name="modalWidth">
              <j-input-number
                style="width: 100%"
                v-model:value="form.modalWidth"
                :min="limitValue?.[0]"
                :max="limitValue?.[1]"
                placeholder="页面弹窗宽度"
              >
                <template #addonAfter>
                  <j-select
                    v-model:value="form.modalWidthUnit"
                    style="width: 60px"
                    allowClear
                    @change="form.modalWidth = null"
                  >
                    <j-select-option value="%">%</j-select-option>
                    <j-select-option value="px">px</j-select-option>
                  </j-select>
                </template>
              </j-input-number>
            </j-form-item>
          </template>
        </template>
        <template v-else>
          <j-form-item label="关系对象类型" name="functions">
            <ErrorItem :errorData="errorMessage['functions']">
              <j-select
                v-model:value="form.relation"
                placeholder="请选择关系对象类型"
              >
                <j-select-option
                  v-for="item in crudFunctions"
                  :value="item.relationType"
                  :key="item.relationType"
                  :title="item.relationTypeName"
                >
                  {{ item.relationTypeName }}
                </j-select-option>
              </j-select>
            </ErrorItem>
          </j-form-item>
        </template>
      </template>

      <j-form-item label="自定义脚本">
        <EditorButton
          v-model:value="form.script"
          language="javascript"
          @errorChange="errorChangeJs"
          text="编写脚本"
        >
        </EditorButton>
      </j-form-item>
      <j-form-item label="自定义样式">
        <EditorButton
          v-model:value="form.style"
          language="css"
          @errorChange="errorChangeCss"
          text="编写css"
        >
        </EditorButton>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts" name="Edit">
import Upload from '@/components/Upload/Image/ImageUpload.vue'

import { FormInstance } from 'jetlinks-ui-components'
import { useProduct } from '@/store'
import EditorButton from '@/components/EditorModal/EditorButton.vue'
import { activeBtnKey, errorListKey, editTypeKey, typeKey } from '../keys'
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
const type = inject(typeKey)

const limitValue = computed(() => {
  if (form.modalWidthUnit === '%') {
    return [10, 100]
  } else {
    return [100, 9999]
  }
})

const productStore = useProduct()
const { info } = productStore
const { functionOptions, commandOptions, pagesOptions, handleFunction } =
  useFunctions()

const crudFunctions = computed(() => {
  return functionOptions.value.filter((item) => {
    return item.provider === providerEnum.CRUD && item.configuration?.relation?.enabled
  }).map(item => item.configuration?.relation)
})
const { getImages } = useImages()

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

const iconType = computed(() => {
  return activeBtn?.value.icon && activeBtn?.value.type !== 'customer'
})

const formRef = ref<FormInstance>()
const form = reactive({
  title: props.data.title,
  icon: props.data.icon,
  type: props.data.type,
  script: props.data.script || `//console.log('hello world')`,
  key: props.data.key,
  modalWidth: props.data.modalWidth || 520,
  modalWidthUnit: props.data.modalWidthUnit || 'px',
  functions:
    editType!.value === 'add' &&
    functionOptions!.value.find((item) => item.fullId === props.data.functions)
      ?.provider === providerEnum.Function
      ? null
      : props.data.functions,
  pages: props.data.pages,
  command:
    !props.data.functions ||
    functionOptions!.value.find((item) => item.fullId === props.data.functions)
      ?.provider === providerEnum.Function
      ? null
      : props.data.command,
  style:
    props.data.style ||
    `/* .test {
  color: red;
} */`,
  resource: props.data.resource,
  relation: props.data.relation,
})

const rules = {
  title: [
    {
      required: true,
      trigger: 'blur',
      validator: (_rule, value: string) => {
        if (!value || !value.length) {
          return Promise.reject('')
        }
        if (value.length > 8 || value.length < 2) {
          return Promise.reject('请输入2-8个字符')
        }
        return Promise.resolve()
      },
    },
  ],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  functions: [{ required: true, message: '', trigger: 'change' }],
  pages: [{ required: true, message: '', trigger: 'change' }],
}

const handlePages = (val: string) => {
  const data = pagesOptions.value.find((item) => item.id === val)
  form.resource = {
    ...pick(data, ['id', 'parentId', 'type']),
    projectId: info.id,
  }
  console.log(form.resource.parentId, form.resource.projectId)
  form.resource.parentId = `${
    form.resource.projectId == form.resource.parentId
      ? form.resource.parentId
      : form.resource.projectId + '.' + form.resource.parentId
  }`
}
const submit = async () => {
  return {
    ...form,
    children: activeBtn?.value.children || [],
    jsError: jsError.value,
    cssError: cssError.value,
  }
}

const jsError = ref()
const errorChangeJs = (v) => {
  jsError.value = v
}

const cssError = ref()
const errorChangeCss = (v) => {
  cssError.value = v
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

watch(
  () => commandOptions.value,
  () => {
    form.command = commandOptions.value?.find(
      (item) => item.id === form.type,
    )?.id
  },
)
defineExpose({
  submit,
})
</script>
<style scoped lang="less">
.edit-btn {
  .default-btn {
    width: 48px;
    height: 48px;
    background: #f0f1f4;
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
