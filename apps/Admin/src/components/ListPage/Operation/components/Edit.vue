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
        <AIcon
          :type="activeBtn?.icon"
          v-if="iconType"
          style="border: 1px solid #d9d9d9; padding: 5px"
        />
        <UploadIcon v-model:modelValue="form.icon" v-else />
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
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</j-select-option
                >
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
            <j-select v-model:value="form.pages" placeholder="请选择调用页面">
              <j-select-option
                v-for="item in pagesOptions"
                :value="item.id"
                :key="item.id"
              >
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
import UploadIcon from './UploadIcon.vue'
import { FormInstance } from 'jetlinks-ui-components'
import { useProduct } from '@/store'
import EditorModal from '@/components/EditorModal'
import { activeBtnKey, errorListKey, editTypeKey } from '../keys'
import { providerEnum } from '@/components/ProJect'
import { ErrorItem } from '../..'
import { useFunctions } from '@/hooks/useFunctions'

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
const { functionOptions, commandOptions, handleFunction } = useFunctions()
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
    functionOptions!.value.find((item) => item.id === props.data.functions)
      ?.provider === providerEnum.Function
      ? ''
      : props.data.functions,
  pages: props.data.pages,
  command: props.data.command,
  style: props.data.style,
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

const submit = async () => {
  const valid = await formRef.value?.validate()
  return valid
    ? { ...form, children: activeBtn?.value.children || [] }
    : undefined
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
  form.command = commandOptions.value.find(item => item.id === form.type)?.id
})
defineExpose({
  submit,
})
</script>
<style scoped lang="less">
form {
  padding: 20px;
}
</style>
