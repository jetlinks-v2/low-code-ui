<template>
  <div class="box">
    <div class="left" v-if="model !== 'preview'"><Filed /></div>
    <div class="right"><Canvas></Canvas></div>
  </div>
</template>

<script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import Filed from './components/Panels/Filed/index.vue'
import { provide, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { appendChildItem } from './utils/utils'

const initData = {
  type: 'root',
  key: 'root',
  componentProps: {},
  children: [],
}

const props = defineProps({
  data: {
    type: Object,
  },
})

const emits = defineEmits(['saveData', 'back'])
const model = ref<'preview' | 'edit'>('edit') // 预览；编辑
const pageData = ref<any>(initData) // 表单数据
const isShowConfig = ref<boolean>(false) // 是否展示配置
const selected = ref<any[]>([]) // 被选择数据,需要多选

// 设置数据被选中
const setSelection = (node: any) => {
  selected.value = node
}

const setModel = (_type: 'preview' | 'edit') => {
  model.value = _type
}

// 添加子组件
const onAddChild = (
  newData: any,
  parent: any,
) => {
  const arr = appendChildItem(pageData.value?.children, newData, parent)
  pageData.value = {
    ...pageData.value,
    children: arr || [],
  }
  setSelection(newData || 'root')
}

provide('FormDesigner', {
  model,
  pageData,
  isShowConfig,
  selected,
  setSelection,
  setModel,
  onAddChild
})

watch(
  () => props.data,
  (newVal) => {
    pageData.value =
      newVal && Object.keys(newVal)?.length
        ? cloneDeep(newVal)
        : cloneDeep(initData)
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.box {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  gap: 12px;
  .left {
    width: 200px;
    height: 100%;
    background-color: #fff;
  }
  .right {
    flex: 1;
    height: 100%;
  }
}
</style>

