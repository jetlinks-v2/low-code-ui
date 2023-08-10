<template>
  <div class="container">
    <Header />
    <div class="box">
      <div class="left"><Filed /></div>
      <div class="right"><Canvas :data="state.store" /></div>
      <!-- <div class="config"><Config /></div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@jetlinks/utils'
import { cloneDeep } from 'lodash-es'
import { nextTick, onMounted, reactive, ref } from 'vue'
import Header from './components/Header/index.vue'
import { Filed, Canvas, Config } from './components/Panels/index'
import {
  checkIdExistInLogic,
  checkIsField,
  generateOptions,
  removeLogicDataById,
} from './utils/utils'
import generatorData from './utils/generatorData'
import { useFormDesignerStore } from '@/store/designer'

const emit = defineEmits(['listener'])
const props = defineProps({
  inlineMax: { // inline横排最多展示的组件个数
    type: Number,
    default: 4,
  },
  fileUploadURI: { // 上传组件的action
    type: String,
  },
})

const designer = useFormDesignerStore()

const state = reactive({
  store: [],
  selected: {}, // 被选择数据
  mode: 'edit',
  children: [],
  previewVisible: false,
  widthScaleLock: false,
  data: {},
  validateStates: [],
  fields: [],
  logic: {},
})

const isShow = ref(true) // 展示画板
const isShowConfig = ref(true) // 展示config

const canvasScrollRef = ref()

// 选中组件
const setSelection = (node: any) => {
  let result: any = {}
  if (node === 'root') {
    result = {}
  } else {
    if (node?.type === 'inline') {
      result = node.columns[0]
    } else {
      result = node
    }
  }
  isShowConfig.value = state.selected === result
  state.selected = result
  nextTick(() => {
    isShowConfig.value = true
  })
}

const addField = (node: any) => {
  if (checkIsField(node)) {
    const findIndex = state.fields.findIndex((item: any) => {
      return (node.id = item.id)
    })
    if (findIndex === -1) {
      state.fields.push(node)
    } else {
      state.fields.splice(findIndex, 1, node)
    }
  }
}

const delField = (node: any) => {
  const fieldIndex = state.fields.findIndex((item: any) => {
    return (node.id = item.id)
  })
  if (fieldIndex !== -1) {
    if (checkIdExistInLogic(node.id, state.logic)) {
      onlyMessage('logicSuggests', 'warning')
      removeLogicDataById(node.id, state.logic)
    }
    state.fields.splice(fieldIndex, 1)
  }
}

const addFieldData = (node: any, isCopy = false) => {
  if (/^(radio|checkbox|select)$/.test(node.type)) {
    if (isCopy) {
      state.data[node.id] = cloneDeep(state.data[node.options.dataKey])
      node.options.dataKey = node.id
    } else {
      if (!state.data[node.id]) {
        node.options.dataKey = node.id
        state.data[node.id] = {
          type: node.type,
          list: generateOptions(3).map((e, i) => {
            e.label += i + 1
            return e
          }),
        }
      }
    }
  }
  if (/^(uploadfile|html)$/.test(node.type)) {
    node.options.action = props.fileUploadURI
  }
}

// const fireEvent = (type, data) => {
//   emit('listener', {
//     type,
//     data,
//   })
// }

const wrapElement = (
  el,
  isWrap = true,
  sourceBlock = true,
  resetWidth = true,
) => {
  const node = sourceBlock
    ? generatorData(el, isWrap, sourceBlock, (node) => {
        addFieldData(node)
        addField(node)
      })
    : isWrap
    ? {
        type: 'inline',
        columns: [el],
      }
    : el
  if (!sourceBlock && resetWidth) {
    el.style.width = '100%'
  }
  return node
}

provide('FormDesigner', {
  state,
  props,
  canvasScrollRef,
  setSelection,
  wrapElement,
  delField,
  addField,
  addFieldData,
  // fireEvent,
})

onMounted(() => {
  // setSelection({})
})
</script>

<style lang="less" scoped>
.container {
  .box {
    display: flex;
    width: 100%;
    height: 700px;
    background-color: #fff;
    .left {
      width: 300px;
    }

    .right {
      flex: 1;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }

    .config {
      width: 300px;
    }
  }
}
</style>