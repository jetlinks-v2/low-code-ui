<template>
  <div class="data-bind" :class="{ 'is-guide': open }" ref="dataBindRef">
    <div class="bind-button">
      <j-badge :count="errorList.length">
        <j-button type="primary" @click="visible = true" :disabled="open">数据绑定</j-button>
      </j-badge>
      <j-space>
        <j-form-item-rest>
          <j-button type="primary" @click="handleValid" :disabled="open">校验</j-button>
        </j-form-item-rest>
        <j-form-item-rest v-if="!open">
          <j-button type="primary" @click="emits('update:open', true)" :disabled="open">操作向导</j-button>
        </j-form-item-rest>
      </j-space>
    </div>
    <DataBindModal v-model:open="visible" :el-container="($refs.dataBindRef as any)" v-if="visible" :errorList="errorList"/>
  </div>
</template>

<script setup lang="ts" name="DataBind">
import DataBindModal from './components/dataBind.vue'
import { DATA_BIND } from '../keys'
import { validDataBind } from './utils/valid'
import { useFunctions } from '@/hooks/useFunctions'

const { functionOptions } = useFunctions()

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
})


const handleOk = () => {
  dataBind.filterBind = dataBind.columnBind = dataBind.data.command = dataBind.data.function  = null
  dataBind.filterAsync = dataBind.columnAsync = false
  visible.value = false
}

const errorList = ref<any[]>([])
const valid = () => {
  errorList.value = validDataBind(dataBind.data, functionOptions.value)
  return errorList.value.length ? [{message: '数据绑定配置错误'}] : []
}


defineExpose({
  valid,
  errorList
})
/**树形结构转一维数组 */
</script>

<style scoped lang="less">
.data-bind {
  padding: 0 20px;
  background-color: #ffffff;
  height: 70px;
  align-items: center;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-color: #D9D9D9;
  .bind-button {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.is-guide {
  margin: 0 20px;
  border-radius: 4px;
}
</style>
