<!-- <template>
  <div class="template">
    <div class="box">
      <div ref="show" class="show-input" contentEditable="plaintext-only"></div>
      <div
        ref="hide"
        @input="onInput"
        @focus="onFocus"
        @scroll="onScroll"
        class="hide-input"
        contentEditable="plaintext-only"
      ></div>
    </div>
    <div class="select">
      <j-select
        style="width: 120px; text-align: left"
        placeholder="添加变量"
        :options="variables"
        @select="selectVariable"
      >
      </j-select>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'
import { watch, ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  data: {
    type: String,
    default: '',
  },
  variables: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
})

const emits = defineEmits(['update:value', 'update:data'])

// 绑定节点
const hide = ref() // 隐藏的输入框的节点
const show = ref() // 显示的输入框的节点
// const _range = ref()

// 根据选择的变量找出颜色
const getColor = (str) => {
  return (
    props.variables?.filter((item) => item?.label === str)?.[0]?.color || 'red'
  )
}

// // 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>${getColor($2)}
const replace = (str) => {
  return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
    return `<span style="color: ${getColor($2)}">${$1}</span>`
  })
}

// 获取光标位置函数
// const getCursorPosition = (label) => {
//   console.log(_range.value)
//   if (_range.value && _range.value?.getRangeAt && _range.value?.rangeCount) {
//     let range = _range.value?.getRangeAt(0)
//     range.deleteContents()
//     // const ele = replace(`{${label}}`)
//     // console.log(ele)
//     // var el = document.createElement('div')
//     // el.innerHTML = html
//     // var frag = document.createDocumentFragment(),
//     //   node,
//     //   lastNode
//     // while ((node = el.firstChild)) {
//     //   lastNode = frag.appendChild(node)
//     // }
//     // range.insertNode(frag)
//     // if (lastNode) {
//     //   range = range.cloneRange()
//     //   range.setStartAfter(lastNode)
//     //   range.collapse(true)
//     //   sel.removeAllRanges()
//     //   sel.addRange(range)
//     // }
//   }
// }

// const onFocus = () => {
//   _range.value = cloneDeep(window.getSelection())
// }

// const onInput = () => {
//   show.value.innerHTML = replace(hide.value?.innerText)
//   emits('update:value', hide.value?.innerText)
//   // _range.value = cloneDeep(window.getSelection())
//   // show.value?.setSelectionRange(-1)
// }
const onInput = debounce(() => {
  emits('update:value', hide.value?.innerText)
  // if (e.selection) {
  //   console.log(e.selection, )
  //   const selection = e.selection
  //   const range = [selection.focus.offset, selection.anchor.offset].sort()
  //   pointer.start = range[0]
  //   pointer.end = range[1]
  // }
}, 500)

const onScroll = () => {
  show.value.scrollTop = hide.value.scrollTop
}

watch(
  () => [props.value, !!show.value],
  () => {
    if (show.value) {
      hide.value.innerHTML = replace(props.value)
      show.value.innerHTML = replace(props.value)
    }
  },
  {
    immediate: true,
  },
)

const selectVariable = (_, { label }) => {
  // if (_range.value) {
  //   getCursorPosition(label)
  // } else {
  emits('update:value', hide.value?.innerText + `{${label}}`)
  // }
}
</script>

<style lang="less" scoped>
.template {
  position: relative;
  width: 100%;
  min-height: 155px;
  border: 1px solid #d9d9d9;
  padding: 10px;

  .box {
    position: relative;
    width: 100%;
    height: 100px;
    .hide-input {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: auto;
      overflow-x: hidden;
      color: transparent;
      background-color: transparent;
      caret-color: black; // 光标颜色
    }

    .show-input {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: auto;
      overflow-x: hidden;
      background-color: white;
    }
  }

  .select {
    text-align: end;
  }

  [contenteditable] {
    outline: none;
  }
}
</style> -->

<template>
  <div class="template">
    <Editor
      v-model="editorHtml"
      style="height: 120px; overflow-y: hidden"
      mode='default'
      :defaultConfig="{ placeholder }"
      @onCreated="handleCreated"
      @onChange="onChange"
    />
    <div class="select">
      <j-select
        style="width: 120px; text-align: left"
        placeholder="添加变量"
        :options="variables"
        @select="selectVariable"
      >
      </j-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, watch, onBeforeUnmount, ref } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor } from '@wangeditor/editor-for-vue'
import { SlateTransforms } from '@wangeditor/editor'
import { debounce } from 'lodash-es'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  data: {
    type: String,
    default: '',
  },
  variables: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
})

const emits = defineEmits(['update:value', 'update:data'])
const editorRef = shallowRef()
const editorHtml = ref('')
const pointer = reactive({ start: 0, end: 0})

// // 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>
// const replace = (str: string) => {
//   return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
//     return `<span style="color: ${getColor($2)}">${$1}</span>`
//   })
// }

// 根据选择的变量找出颜色
const getColor = (str: string) => {
  return props.variables?.filter((item: any) => item?.label === str)?.[0]?.color
}

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

watch(
  () => [props.value, editorRef.value],
  () => {
    if (editorRef.value) {
        editorHtml.value = props.value
    }
  },
  {
    immediate: true,
  },
)

const selectVariable = (_, { label }) => {
    editorRef.value?.insertNode({ type: 'span', color: `${getColor(label)}`, text: `{${label}}` })
  // // const at = pointer.start === pointer.end ? [pointer.start] : [pointer.start, pointer.end]
  // const at = [pointer.start]
  // const node = { type: 'span', children: [{ type: 'span', color: `${getColor(label)}`, text: `{${label}}` }] }
  // if (editorRef.value) {
  //   SlateTransforms.insertNodes(editorRef.value, [node], { at: [2] })
  // }
}

const onChange = debounce((e) => {
  emits('update:data', editorRef.value?.getText())
  emits('update:value', editorHtml.value)

  // if (e.selection) {
  //   console.log(e.selection, )
  //   const selection = e.selection
  //   const range = [selection.focus.offset, selection.anchor.offset].sort()
  //   pointer.start = range[0]
  //   pointer.end = range[1]
  // }

}, 500)

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor?.destroy()
})
</script>

<style lang="less" scoped>
.template {
  width: 100%;
  padding: 0 10px 10px 0;
  border: 1px solid #d9d9d9;
  .select {
    text-align: end;
  }
}
</style>
