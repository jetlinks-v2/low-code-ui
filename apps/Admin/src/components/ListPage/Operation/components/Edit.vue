<template>
  <div class="edit-btn">
    <j-form :model="form" layout="vertical" ref="formRef" :rules="rules">
      <j-form-item label="请输入按钮名称" v-if="activeBtn.type == 'customer'">
        <j-input v-model:value="form.title" :maxlength="8"></j-input>
      </j-form-item>
      <j-form-item label="图标">
        <AIcon
          :type="activeBtn.icon"
          v-if="activeBtn.icon && activeBtn.type !== 'customer'"
          style="border: 1px solid #d9d9d9; padding: 5px"
        />
        <UploadIcon v-model:modelValue="form.icon" v-else />
      </j-form-item>
      <template v-if="activeBtn.type !== 'customer'">
        <j-row :gutter="20">
          <j-col :span="12">
            <j-form-item label="调用功能">
              <j-select
                v-model:value="form.functions"
                placeholder="请选择调用功能"
              >
                <j-select-option
                  v-for="item in functions"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</j-select-option
                >
              </j-select>
            </j-form-item>
          </j-col>
          <j-col :span="12">
            <j-form-item label=" ">
              <j-select
                v-model:value="form.command"
                placeholder="请选择调用指令"
              >
                <j-select-option
                  v-for="item in commands"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</j-select-option
                >
              </j-select>
            </j-form-item>
          </j-col>
        </j-row>
        <j-form-item label="调用页面" v-if="activeBtn.type === 'add' || activeBtn.type === 'detail'">
          <j-select v-model:value="form.pages" placeholder="请选择调用页面">
            <j-select-option
              v-for="item in pages"
              :value="item.id"
              :key="item.id"
            >
              {{ item.title }}
            </j-select-option>
          </j-select>
        </j-form-item>
      </template>
      <j-form-item label="脚本">
        <EditorModal v-model:value="form.script" />
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts" name="Edit">
import UploadIcon from './UploadIcon.vue'
import { FormInstance } from 'jetlinks-ui-components'
import { useProduct } from '@/store'
import { omit } from 'lodash-es'
import EditorModal from '@/components/EditorModal';
interface Emit {
  (e: 'update:steps', value: string): void
}
const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>>,
    default: () => {},
  },
  steps: {
    type: String,
  },
})

const activeBtn = inject('activeBtn') as Record<string, any>
const productStore = useProduct()

const functions = ref<any[]>([])
const pages = ref<any[]>([])

/**树形结构转一维数组 */
const treeToArr = (data: any[]) => {
  data.forEach((item) => {
    if (item.functions && item.functions.length) {
      functions.value.push(...item.functions)
    }
    if(item.type == 'page-code') {
      pages.value.push(omit(item, 'children'))
    }
    if (item.children) {
      treeToArr(item.children)
    }
  })
}

treeToArr(productStore.data)

const commands = [
  { label: 'add', value: 'add' },
  { label: 'import', value: 'import' },
  { label: 'export', value: 'export' },
  { label: 'delete', value: 'delete' },
  { label: 'update', value: 'update' }
]

const visible = ref(false)
const handleIcon = () => {
  visible.value = true
}

const formRef = ref<FormInstance>()
const form = reactive({
  title: props.data.title,
  icon: props.data.icon,
  type: props.data.type,
  script: props.data.script,
  key: props.data.key,
  functions: props.data.functions,
  pages: props.data.pages,
  command: props.data.command,
})

const rules = {
  title: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
}
const submit = async () => {
  const valid = await formRef.value?.validate()
  return valid
    ? { ...form, children: activeBtn.value.children || [] }
    : undefined
}

defineExpose({
  submit,
})
</script>
<style scoped lang="less">
form {
  padding: 20px;
}
</style>
