<template>
  <div>
    <j-button type="primary" @click="dialog.visible = true">选择成员</j-button>
    <!-- 列表 -->
    <ul>
      <li v-for="item in list" :key="item.id">
        <!-- {{ item.title }} 权重 {{ item.weights }} -->
        {{ item }}
      </li>
    </ul>
    <Dialog
      v-if="dialog.visible"
      :isNode="isNode"
      :hasWeight="hasWeight"
      v-model:visible="dialog.visible"
      @get-data="getData"
    ></Dialog>
  </div>
</template>
<script setup lang="ts">
import Dialog from './Dialog/index.vue'
import { DataSourceProps } from './types'

const props = withDefaults(
  defineProps<{
    isNode?: boolean
    hasWeight?: boolean
    members: any[]
  }>(),
  {
    isNode: true,
    hasWeight: true
  },
)
const emits = defineEmits<{
  (e: 'update:members', data: DataSourceProps[]): void
}>()

const dialog = reactive({
  visible: false,
})

const list = ref<DataSourceProps[]>(props.members || [])
const getData = (data: DataSourceProps[], type: string) => {
  // 暂存其他维度数据
  const newList = list.value.filter((item) => item.type != type)
  // 数组去重
  list.value = [...new Set([...data, ...newList])]
  emits('update:members', list.value)
}
// /**
//  * 根据分组字段对数组进行分组
//  * @param arr 要分组的数据
//  * @param field 分类字段
//  */
// const groupedData = (arr: any[], field: string) => {
//   return arr.reduce((acc, curr) => {
//     let key = curr[field]
//     if (!acc[key]) {
//       acc[key] = []
//     }
//     acc[key].push(curr)
//     return acc
//   }, {})
// }

provide('members', list)

// watch(
//   () => props.members,
//   (val) => {
//     let arr = []
//     Object.keys(val).forEach((i) => {
//       arr = arr.concat(val[i])
//     })
//     list.value = arr
//   },
//   { immediate: true },
// )
</script>
<style scoped lang="less"></style>
