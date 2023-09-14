<template>
  <div class="data-bind" :class="{ 'is-guide': open }">
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
              {{ item.title }}
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
      <j-button type="link" @click="handleModify">变更</j-button>
    </j-form>
    <j-space>
      <j-form-item-rest>
        <j-button type="primary" @click="handleValid">校验</j-button>
      </j-form-item-rest>
      <j-form-item-rest v-if="!open">
        <j-button type="primary" @click="emits('update:open', true)">操作向导</j-button>
      </j-form-item-rest>
    </j-space>
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
  dataBind.filterBind = dataBind.columnBind =
    functionOptions!.value.find((item) => item.fullId === val)?.configuration?.columns ||
    dataBind.filterBind
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
  dataBind.filterBind = dataBind.columnBind = dataBind.data.command = dataBind.data.function  = null
  visible.value = false
}

const errorList = ref<any[]>([])
const valid = () => {
  errorList.value = validDataBind(dataBind.data, functionOptions.value)
  return errorList.value.length ? [{message: '数据绑定配置错误'}] : []
}

watch(
  () => dataBind.data.function,
  () => {
    if (dataBind.data.function) {
      console.log(`output->dataBind.data.function`,dataBind.data.function)
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
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
  margin-bottom: 5px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.is-guide {
    margin: 0 20px;
    border-radius: 4px;
  }
.text {
  text-align: center;
}
</style>
