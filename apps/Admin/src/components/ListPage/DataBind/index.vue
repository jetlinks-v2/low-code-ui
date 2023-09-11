<template>
  <div class="data-bind">
    <j-form :model="dataBind" layout="inline">
      <j-form-item label="数据绑定">
        <ErrorItem :errorData="errorData('function')">
          <j-select
            v-model:value="dataBind.data.function"
            style="width: 200px"
            :disabled="functionDisabled"
            placeholder="请选择功能"
          >
            <j-select-option
              v-for="item in functionOptions"
              :value="item.fullId"
              :key="item.id"
            >
              {{ item.name }}
            </j-select-option>
          </j-select>
        </ErrorItem>
      </j-form-item>
      <j-form-item v-if="showCommand">
        <ErrorItem :errorData="errorData('command')">
          <j-select
            v-model:value="dataBind.data.command"
            :disabled="commandDisabled"
            style="width: 200px"
          >
            <j-select-option
              v-for="item in commandOptions"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </j-select-option>
          </j-select>
        </ErrorItem>
      </j-form-item>
      <j-form-item>
        <j-button type="link" @click="handleModify">变更</j-button>
      </j-form-item>
      <j-form-item>
        <j-button type="link" @click="handleValid">校验</j-button>
      </j-form-item>
      <j-form-item v-if="!open">
        <j-button @click="emits('update:open', true)">操作向导</j-button>
      </j-form-item>
    </j-form>
    <j-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p class="text">
        变更后将清空筛选组件及数据列表的所有数据<br />确认变更？
      </p>
    </j-modal>
  </div>
</template>

<script setup lang="ts" name="DataBind">
import { ErrorItem } from '../index'
import { DATA_BIND } from '../keys'
import { validDataBind } from './utils/valid'
import { useFunctions } from '@/hooks/useFunctions'

const { functionOptions, commandOptions, handleFunction } = useFunctions()

const visible = ref(false)
const handleValid = () => {
  emits('valid')
}

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'valid'): void
}

const errorData = computed(() => {
  return (key: string): any => {
    return errorList.value.find((item) => item.key === key)
  }
})
const emits = defineEmits<Emit>()
const dataBind = inject(DATA_BIND)
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

const handleChangeFunction = (val: string) => {
  dataBind.functionInfo =
    functionOptions!.value.find((item) => item.fullId === val) ||
    dataBind.functionInfo
  handleFunction(val)
}
const functionDisabled = computed(() => {
  return dataBind.data.function && dataBind.data.function !== ''
})

const commandDisabled = computed(() => {
  return dataBind.data.command && dataBind.data.command !== ''
})

const showCommand = computed(() => {
  return ['rdb-sql-query', 'rdb-crud'].includes(
    functionOptions!.value.find((item) => item.fullId === dataBind.data.function)
      ?.provider || '',
  )
})

const handleModify = () => {
  visible.value = dataBind.data && dataBind.data.function
}

const handleOk = () => {
  dataBind.data.function = null
  dataBind.data.command = null
  dataBind.functionInfo = null
  visible.value = false
}

const errorList = ref<any[]>([])
const valid = () => {
  console.log(`output->dataBind.data`, dataBind)
  return new Promise((resolve, reject) => {
    errorList.value = validDataBind(dataBind.data, functionOptions.value)
    if (errorList.value.length) reject(errorList.value)
    else resolve([])
  })
}

watch(
  () => JSON.stringify(dataBind),
  () => {
    if (dataBind.data.function) {
      handleChangeFunction(dataBind.data.function)
    }
  },
)

defineExpose({
  valid,
})
/**树形结构转一维数组 */
</script>

<style scoped lang="less">
.data-bind {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
  margin-bottom: 5px;
  height: 8vh;
}
.text {
  text-align: center;
}
</style>
