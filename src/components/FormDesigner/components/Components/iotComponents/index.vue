<template>
  <div>
    <j-button type="primary" @click="visible = true" :disabled="disabled">{{
      type === 'product' ? '产品选择' : '设备选择'
    }}</j-button>
    <SelectModal
      v-if="visible"
      @close="closeModal"
      @save="updateData"
      :select="selectIds"
    ></SelectModal>
    <div class="select" v-if="selectData.length > 0">
      <div v-for="item in selectData" :key="item?.id" class="selectItem">
        <div v-if="item?.name">{{ item?.name }}</div>
        <div v-else>{{ item?.id }}</div>
        <div @click="cancelSelect(item?.id)">
          <AIcon type="CloseOutlined" class="selectItemIcon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectModal from './modal.vue'
import { queryProductNoPage, queryDeviceNoPage } from '@LowCode/api/form'
import { inject, ref, watch, computed } from 'vue'
import { map } from 'lodash-es'

const props = defineProps({
  value: {
    type: [Array, String],
    default: [] || '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const type = inject('type')
const mode = inject('mode')
const emit = defineEmits(['updateValue'])
const selectIds: any = ref([])
const visible = ref(false)
const dataMap = new Map()

const closeModal = () => {
  visible.value = false
}
const updateData = (data: any) => {
  visible.value = false
  mode === 'multiple'
    ? emit('updateValue', data)
    : emit('updateValue', data?.[0])
}
const cancelSelect = (id: string) => {
  if(props.disabled){
    return
  }
  const index = selectIds.value.findIndex((item: any) => item?.id === id)
  selectIds.value.splice(index, 1)
}
// 查询设备|产品接口获取对应id的名称 如果没有则显示id
const queryName = async (data: any) => {
  const params = {
    paging: false,
    terms: [
      {
        terms: [
          {
            type: 'or',
            value: data,
            termType: 'in',
            column: 'id',
          },
        ],
      },
    ],
  }
  let req
  if (type === 'product') {
    req = await queryProductNoPage(params)
  } else {
    req = await queryDeviceNoPage(params)
  }
  if (req.status === 200) {
    req.result.map(item => {
      dataMap.set(item.id, item)
    })
  }
}

const selectData = computed(() => {
  const arr = selectIds.value.map((item) => {
    return {
      id: item.id,
      name: dataMap.get(item.id)?.name || item?.name || item?.id,
    }
  })
  return arr
})

watch(
  () => props.value,
  async () => {
    if (props.value) {
      const __value = Array.isArray(props?.value)
        ? props.value || []
        : props.value && Object.keys(props.value)?.length
        ? [props.value]
        : []
      const __arr = __value.filter((i: any) => {
        return Object.keys(i)?.length && i
      })
      if (__arr?.length) {
        const arr = map(__arr, 'id').filter(i => {
          return !dataMap.get(i)
        })
        if(arr?.length){
          await queryName(arr)
        }
      }
      selectIds.value = __arr
    } else {
      selectIds.value = []
    }
  },
  { deep: true, immediate: true },
)
</script>
<style lang="less" scoped>
.select {
  margin: 8px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .selectItem {
    background-color: #f3f3f3;
    border: none;
    margin-bottom: 6px;
    border-radius: 8px;
    padding: 2px 8px;
    margin-right: 10px;
    color: #333333;
    font-size: 12px;
    display: flex;
    gap: 10px;
    .selectItemIcon {
      color: #333333;
      font-size: 10px;
    }
  }
}
</style>
