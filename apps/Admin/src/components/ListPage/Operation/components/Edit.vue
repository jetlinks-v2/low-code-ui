<template>
  <div class="edit-btn">
    <j-form :model="form" layout="vertical" ref="formRef" :rules="rules">
      <j-form-item
        label="请输入按钮名称"
        v-if="activeBtn!.type == 'customer'"
        :validateStatus="errorMessage['title'] ? 'error' : 'success'"
      >
        <template #extra v-if="errorMessage['title']">
          <span style="color: red">{{ errorMessage['title'] }}</span>
        </template>
        <j-input v-model:value="form.title" :maxlength="8"></j-input>
      </j-form-item>
      <j-form-item label="图标">
        <AIcon
          :type="activeBtn?.icon"
          v-if="activeBtn?.icon && activeBtn?.type !== 'customer'"
          style="border: 1px solid #d9d9d9; padding: 5px"
        />
        <UploadIcon v-model:modelValue="form.icon" v-else />
      </j-form-item>
      <template v-if="activeBtn!.type !== 'customer'">
        <j-row :gutter="20" v-if="activeBtn?.type !== 'Detail'">
          <j-col :span="12">
            <j-form-item
              label="调用功能"
              :validateStatus="errorMessage['functions'] ? 'error' : 'success'"
            >
              <template #extra v-if="errorMessage['functions']">
                <span style="color: red">{{ errorMessage['functions'] }}</span>
              </template>
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
            <j-form-item
              label=" "
              :validateStatus="errorMessage['command'] ? 'error' : 'success'"
            >
              <template #extra v-if="errorMessage['command']">
                <span style="color: red">{{ errorMessage['command'] }}</span>
              </template>
              <j-select
                v-model:value="form.command"
                placeholder="请选择调用指令"
              >
                <j-select-option
                  v-for="item in commands"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</j-select-option
                >
              </j-select>
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
          :validateStatus="errorMessage['pages'] ? 'error' : 'success'"
        >
          <template #extra v-if="errorMessage['pages']">
            <span style="color: red">{{ errorMessage['pages'] }}</span>
          </template>
          <j-select v-model:value="form.pages" placeholder="请选择调用页面">
            <j-select-option
              v-for="item in pages"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
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
import EditorModal from '@/components/EditorModal'
import { activeBtnKey, errorListKey, editTypeKey } from '../keys'
import { queryCommand } from '@/api/project'
import { providerEnum } from '@/components/ProJect'
import { functionsKey, pagesKey } from '../../keys'
interface Emit {
  (e: 'update:steps', value: string): void
}
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
const functions = inject(functionsKey)
const pages = inject(pagesKey)
const errorMessage = computed(() => {
  let data = {}
  let result = errorList!.value?.filter(
    (item) => item.key === activeBtn?.value.key,
  )
  console.log(result)
  if (result) {
    result.forEach((item) => {
      data[item.errorKey] = item.message
    })
  }
  return data
})
const productStore = useProduct()

const commands = ref()

/**查询功能下的指令 */
const findCommand = async () => {
  const params = {
    modules: [
      {
        id: productStore.data?.[0].id,
        name: productStore.data?.[0].name,
        functions: [
          functions!.value?.find((item) => item.id === form.functions),
        ],
      },
    ],
  }
  const res = await queryCommand(params)
  if (res.success) {
    commands.value = res.result?.[0].command
  }
}

const formRef = ref<FormInstance>()
const form = reactive({
  title: props.data.title,
  icon: props.data.icon,
  type: props.data.type,
  script: props.data.script,
  key: props.data.key,
  functions:
    editType!.value === 'add' &&
    functions!.value.find((item) => item.id === props.data.functions)
      ?.provider === providerEnum.SQL
      ? ''
      : props.data.functions,
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
    ? { ...form, children: activeBtn?.value.children || [] }
    : undefined
}

watch(
  () => form.functions,
  () => {
    if (form.functions && form.functions !== '') {
      findCommand()
    }
  },
  { immediate: true },
)
defineExpose({
  submit,
})
</script>
<style scoped lang="less">
form {
  padding: 20px;
}
</style>
