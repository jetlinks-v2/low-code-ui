<template>
  <div>
    <j-button type="primary" @click="dialog.visible = true">选择成员</j-button>
    <!-- 列表 -->
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    <Dialog
      v-if="dialog.visible"
      v-model:visible="dialog.visible"
      @get-data="getData"
    />
  </div>
</template>
<script setup lang="ts">
import Dialog from './Dialog/index.vue'
import { DataSourceProps } from './types'
import { isArray, isObject, pick } from 'lodash-es'

const props = withDefaults(
  defineProps<{
    isNode?: boolean
    hasWeight?: boolean
    members: DataSourceProps[] | DataSourceProps
    nodeId?: string // 节点id
    supCancel?: boolean // 是否支持取消选中
  }>(),
  {
    isNode: true,
    hasWeight: true,
    supCancel: true
  },
)

const emits = defineEmits<{
  (e: 'update:members', data: DataSourceProps[] | DataSourceProps): void
}>()

const dialog = reactive({
  visible: false,
})

const list = ref<DataSourceProps[]>([])
const getData = (data: DataSourceProps[], type: string) => {
  // 暂存其他维度数据
  const newList = list.value.filter((item) => item.type != type)
  // 数组去重
  list.value = [...new Set([...data, ...newList])]
  props.isNode
    ? emits('update:members', groupedData(list.value, 'groupField'))
    : emits('update:members', list.value)
}
/**
 * 根据分组字段对数组进行分组
 * @param arr 要分组的数据
 * @param field 分类字段
 */
const groupedData = (arr: any[], field: string) => {
  return arr.reduce((acc, curr) => {
    let key = curr[field]
    if (!acc[key]) {
      acc[key] = []
    }
    const { others, ...rest } = curr
    acc[key].push({ ...rest, ...others })
    return acc
  }, {})
}

provide('infoState', {
  members: list,
  nodeId: props.nodeId,
  isNode: props.isNode,
  hasWeight: props.hasWeight,
  supCancel: props.supCancel,
})

watch(
  () => props.members,
  (val) => {
    if (isArray(val)) {
      list.value = val
    } else if (isObject(val)) {
      let arr = []
      Object.keys(val).forEach((i) => {
        console.log('444', i, val[i])
        arr = arr.concat(
          val[i]?.map((j) => ({
            ...pick(j, ['id', 'name', 'weight']),
            type: j.type || j.related?.objectType,
            groupField: i,
            others: {
              ...j,
            },
          })),
        )
      })
      list.value = arr
    }
  },
  { immediate: true },
)
</script>
<style scoped lang="less"></style>
