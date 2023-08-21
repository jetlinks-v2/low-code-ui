<template>
  <div class="container">
    <Header />
    <div class="box">
      <div class="left"><Filed /></div>
      <div class="right">
        <Canvas :data="formData"></Canvas>
      </div>
      <div class="config" v-if="isShowConfig"><Config /></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header/index.vue'
import Canvas from './components/Panels/Canvas/index'
import Config from './components/Panels/Config/index.vue'
import Filed from './components/Panels/Filed/index'
import { provide, ref } from 'vue'
import { ISchema } from './typings'

const initData = {
  type: 'root',
  key: 'root',
  componentProps: {
    layout: 'horizontal',
  },
  children: [],
}

const props = defineProps({
  // inlineMax: { // inline横排最多展示的组件个数
  //   type: Number,
  //   default: 4,
  // },
  // fileUploadURI: { // 上传组件的action
  //   type: String,
  // },
  value: {
    type: Object,
    default: () => {},
  },
})

const model = ref<'preview' | 'edit'>('edit') // 预览；编辑
const formData = ref<ISchema>(initData) // 表单数据
const isShowConfig = ref<boolean>(false) // 是否展示配置
const selected = ref<ISchema>() // 被选择数据

// 设置数据被选中
const setSelection = (node: any) => {
  let result: any = {}
  if (node === 'root') {
    result = initData
  } else {
    if (Array.isArray(node)) {
      result = node?.[0]
    } else {
      result = node
    }
  }
  selected.value = result
  isShowConfig.value = selected.value?.key === result?.key
}

const setModel = (_type: 'preview' | 'edit') => {
  model.value = _type
}

provide('FormDesigner', {
  model,
  formData,
  isShowConfig,
  selected,
  setSelection,
  setModel,
})
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: calc(100vh - 125px);
  .box {
    display: flex;
    width: 100%;
    height: calc(100% - 50px);

    .left {
      width: 300px;
      height: 100%;
    }

    .right {
      flex: 1;
    }

    .config {
      width: 300px;
    }
  }
}
</style>