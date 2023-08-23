<template>
  <div class="data-bind">
    <j-form :model="dataBind" layout="inline">
      <j-form-item label="数据绑定">
        <j-select
          v-model:value="dataBind.data.function"
          style="width: 200px"
          :disabled="dataBind.data.function !== ''"
        >
          <j-select-option
            v-for="item in functions"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item v-if="functions.find(item => item.id === dataBind.data.function)?.provider === 'rdb-sql-query'">
        <j-select
          v-model:value="dataBind.data.command"
          style="width: 200px"
        ></j-select>
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
import { useProduct } from '@/store'
import { storeToRefs } from 'pinia'

const visible = ref(false)
const handleValid = () => {
  emits('valid')
}

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'valid'): void
  (e: 'modify'): void
}

const emits = defineEmits<Emit>()
const dataBind: any = inject('dataBind')
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const { data } = storeToRefs(useProduct())

const functions = computed(() => {
  let arr: any[] = []
  const treeToArr = (data: any[]) => {
    data.forEach((item) => {
      if (item.functions && item.functions.length) {
        arr.push(...item.functions)
      }
      if (item.children) {
        treeToArr(item.children)
      }
    })
  }
  treeToArr(data.value)
  return arr
})

const handleModify = () => {
  if(dataBind.value.data.function && dataBind.value.data.function !== ''){
    visible.value = true
  }
}

const handleOk = () => {
  emits('modify')
  visible.value = false
}
/**树形结构转一维数组 */
</script>

<style scoped lang="less">
.data-bind {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
}
.text {
  text-align: center;
}
</style>
