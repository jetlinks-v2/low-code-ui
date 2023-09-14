<template>
  <div class="paging-config" ref="pagingConfig">
    <img class="modal-config-img" :src="getImage('/list-page/pagination.png')" v-if="open">
    <j-drawer
      title="分页器配置"
      placement="right"
      width="560px"
      :closable="false"
      :visible="open"
      :getContainer="() => $refs.pagingConfig"
      :destroyOnClose="true"
      :wrap-style="{ position: 'absolute' }"
      @close="emits('update:open', false)"
    >
      <p>请配置分页器支持的单页数据量</p>
      <ErrorItem :errorData="errorData('pageList')">
        <div style="display: flex; flex-flow: wrap;align-items: center;">
          <div v-for="(item, index) in pagingData" :key="index">
            <j-input-number
              class="input-number"
              v-model:value="item.pageSize"
              :min="1"
              :precision="0"
              :max="9999"
              :step="1"
              :controls="false"
              @blur="blur()"
              @pressEnter="blur()"
            />
            <span v-if="index < pagingData.length - 1">,</span>
            
          </div>
          <span
              v-if="pagingData.length < 99"
            >
              <j-button type="text" @click="onAdd" class="add-pagination">+</j-button>
          </span>
        </div>
      </ErrorItem>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import { ErrorItem } from '../index'
import { PropType } from 'vue';
import { getImage } from '@jetlinks/utils';
const pagingData = computed({
  get() {
    return props.pagingData
  },
  set(val) {
    emits('update:pagingData', val)
  }
})

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:pagingData', value: any): void
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

  pagingData: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  }
})

const errorData = computed(() => {
  return (val: string) => {
    return errorList.value?.find((item: any) => item.key === val)
  }
})
const open = computed({
  get() {
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
}

/**
 * 校验
 */
const errorList = ref<any[]>([])
const valid = () => {
  return new Promise((resolve, reject) => {
    errorList.value = pagingData.value.length ? [] : [{key: 'pageList', message: '请配置分页器支持的单页数据量'}]
    if(errorList.value.length) reject(errorList.value)
    else resolve([])
  })
}

defineExpose({
  valid,
  errorList
})
</script>
<style lang="less" scoped>
.input-number {
  margin: 10px;
  width: 56px;
}
.add-pagination{
  width: 24px;
  height: 24px;
  border: 1px dashed #dcdcdc;
  padding: 0;
}
</style>
