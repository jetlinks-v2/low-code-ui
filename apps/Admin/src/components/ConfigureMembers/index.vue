<template>
  <div>
    <j-button type="primary" @click="dialog.visible = true">选择成员</j-button>
    <!-- 列表 -->
    <ul>
      <li v-for="item in list" :key="item.key">
        {{ item.title }} 权重 {{ item.weights }}
      </li>
    </ul>
    <Dialog
      v-if="dialog.visible"
      :isNode="isNode"
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
    members: any[]
  }>(),
  {
    // isNode: false,
    isNode: true,
  },
)
const emits = defineEmits<{
  (e: 'update:members', data: DataSourceProps[]): void
}>()

const dialog = reactive({
  visible: false,
})

const list = ref<DataSourceProps[]>(props.members || [])
const getData = (data: DataSourceProps[], selectKey: string) => {
  // 暂存其他维度数据
  const newList = list.value.filter((item) => item.selectKey != selectKey)
  // 数组去重
  list.value = [...new Set([...data, ...newList])]
  emits('update:members', list.value)
}

provide('members', list)
</script>
<style scoped lang="less"></style>
