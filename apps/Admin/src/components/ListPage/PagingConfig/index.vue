<template>
  <div class="paging-config">
    <j-drawer
      title="分页器配置"
      placement="top"
      :closable="false"
      :visible="open"
      @close="emits('update:open', false)"
    >
      <p>请配置分页器支持的单页数据量</p>
      <div style="display: flex; flex-flow: wrap;align-items: center;">
        <div v-for="(item, index) in pagingData" :key="index">
          <j-input-number
            style="margin: 10px"
            v-model:value="item.pageSize"
            :min="1"
            :precision="0"
            :max="9999"
            :step="1"
            @blur="blur()"
            @pressEnter="blur()"
          />
          <span v-if="index < pagingData.length - 1">,</span>
          
        </div>
        <span
            v-if="pagingData.length < 99"
          >
            <j-button type="text" @click="onAdd">+</j-button>
        </span>
      </div>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import { useAllListDataStore } from '@/store/listForm'
const pagingConfigStore = useAllListDataStore()
const pagingData = ref([
  { pageSize: 12 },
  { pageSize: 24 },
  { pageSize: 48 },
  { pageSize: 96 },
])

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
  },
})

const open = computed({
  get() {
    if (props.open) {
      pagingData.value = pagingConfigStore.getALLlistDataInfo(props.id).pagingData
      console.log(pagingConfigStore.getALLlistDataInfo(props.id));
      
    }
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})

const onAdd = () => {
  const value = pagingData.value[pagingData.value.length - 1]?.pageSize

  pagingData.value.push({
    pageSize: value ? value + 1 : 12,
  })
  blur()
}
//去重
const deWeightThree = () => {
  let map = new Map()
  for (let item of pagingData.value) {
    if (!map.has(item.pageSize) && item.pageSize !== null) {
      map.set(item.pageSize, item)
    }
  }
  return [...map.values()]
}

const blur = () => {
  pagingData.value = deWeightThree()
  pagingData.value?.sort((a, b) => {
    return a.pageSize - b.pageSize
  })
  pagingConfigStore.setALLlistDataInfo('pagingData',pagingData.value,props.id)
}

/**
 * 校验
 */
const errorList = ref<string[]>([])
const valid = () => {
  if(pagingData.value.length) {
    errorList.value = []
  } else {
    errorList.value = ['请配置分页器支持的单页数据量']
  }
  return errorList.value
}

defineExpose({
  valid,
  errorList
})
</script>
<style lang="less" scoped></style>
