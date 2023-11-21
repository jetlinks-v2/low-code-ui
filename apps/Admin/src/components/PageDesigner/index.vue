<template>
  <div class="container">
    <Header />
    <div class="box">
      <div class="left" v-if="model !== 'preview'"><Filed /></div>
      <div class="center"><Canvas></Canvas></div>
      <div class="right" v-if="isShowConfig && model !== 'preview'">
        <Config></Config>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import Filed from './components/Panels/Filed/index.vue'
import Config from './components/Panels/Config/index.vue'
import Header from './components/Header/index.vue'
import { provide, ref, watch } from 'vue'
import { cloneDeep, debounce } from 'lodash-es'
import { appendChildItem, deleteDataByKey } from './utils/utils'
import { Modal } from 'jetlinks-ui-components'

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
const delVisible = ref<boolean>(false)

// 设置数据被选中
const setSelection = (node: any) => {
  if (node === 'root') {
    selected.value = [pageData.value]
  } else {
    selected.value = [node]
  }
  isShowConfig.value = true
}

const setModel = (_type: 'preview' | 'edit') => {
  model.value = _type
}

// 添加子组件
const onAddChild = (newData: any, parent: any) => {
  const arr = appendChildItem(pageData.value?.children, newData, parent)
  pageData.value = {
    ...pageData.value,
    children: arr || [],
  }
  setSelection(newData || 'root')
}

// 删除
const onDelete = debounce(() => {
  const arr = selected.value || []
  if (!arr?.length) return
  delVisible.value = true
  Modal.confirm({
    title: '确定删除组件及其配置？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      delVisible.value = false
      // 删除数据
      const _data = deleteDataByKey(pageData.value.children, selected.value)
      pageData.value = {
        ...pageData.value,
        children: _data?.arr || [],
      }
      setSelection(_data?.data || 'root')
    },
    onCancel() {
      delVisible.value = false
    },
  })
}, 200)

// 复制
const onCopy = () => {
  // const list = cloneDeep(selected.value).filter((item) => {
  //   return ![
  //     'collapse-item',
  //     'tabs-item',
  //     'grid-item',
  //     'table-item',
  //     'space-item',
  //   ].includes(item.type)
  // })
  // if (unref(isSelectedRoot) || focused.value) return
  // formDesigner.setCopyData(props.data?.id, list || [])
}

provide('FormDesigner', {
  model,
  pageData,
  isShowConfig,
  selected,
  setSelection,
  setModel,
  onAddChild,
  onDelete,
  onCopy,
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
.container {
  height: 100vh;
  .box {
    display: flex;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    gap: 6px;
    height: calc(100% - 50px);
    .left {
      width: 200px;
      height: 100%;
      background-color: #fff;
    }

    .center {
      flex: 1;
      height: 100%;
    }
    .right {
      width: 300px;
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>

