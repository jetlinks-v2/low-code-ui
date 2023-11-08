<template>
  <div class="template">
    <div class="select">
      <j-button
        v-for="item in variables"
        :key="item.value"
        @click="getPosition(item)"
        >{{ item.label }}</j-button
      >
    </div>

    <div class="box">
      <div
        class="model-show-input"
        contentEditable="plaintext-only"
        ref="show"
        tabIndex="-1"
      ></div>
      <div
        class="model-hide-input"
        contentEditable="plaintext-only"
        @scroll="onScroll"
        @input="onInput"
        :class="className"
        ref="hide"
        @keypress="onKeypress"
      ></div>
    </div>
    <!-- <div class="select">
      <span class="tip"
        >请将{{ name }}最终长度控制在{{ maxlength }}个字符内</span
      >
      <j-select
        style="width: 120px; text-align: left"
        placeholder="添加变量"
        :options="variables"
        @select="selectVariable"
      >
      </j-select>
    </div> -->
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { randomString } from '@jetlinks/utils'

const props = defineProps({
  value: {
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
  name: {
    type: String,
  },
  maxlength: {
    type: Number,
  },
})

const emits = defineEmits(['update:value'])
const className = ref(`template-textarea--${randomString(4)}`)
const offset = reactive({
  start: 0,
  end: 0,
})

// 绑定节点
const hide = ref() // 隐藏的输入框的节点
const show = ref()

const regHidden = (html) => {
  return html.replace(/\{(.*?)\}/g, ($1, $2) => {
    const _arr = $2.split(':')
    return _arr?.length === 3
      ? `<span data-id=${_arr[1]}>{${_arr[2]}}</span>`
      : $1
  })
}

const regHandle = (html) => {
  return html.replace(/\{(.*?)\}/g, ($1, $2) => {
    const _arr = $2.split(':')
    const variable = props.variables.find((item) => item.value === _arr?.[1])
    return _arr?.length === 3 && variable
      ? `<span style="color: ${variable?.color}">{${_arr[2]}}</span>`
      : $1
  })
}

watch(
  () => [props.value, !!show.value, props.variables],
  () => {
    if (show.value) {
      show.value.innerHTML = regHandle(props.value)
    }
  },
  {
    immediate: true,
  },
)

const onKeypress = (e) => {
  const _event = e || window.event
  if (_event.keyCode === 13) {
    _event.returnValue = false
  }
}

const getPosition = (item) => {
  const contentEditableDiv = document.querySelector(`.${className.value}`)
  // 获取被选中的内容，起点和终点在同一位置为光标，不同位置为选区
  const selection = window.getSelection()
  // 被选中/focus的元素
  const anchorNode = selection.anchorNode
  if (!anchorNode) return
  // 父节点
  const parentNode = selection.anchorNode.parentNode
  const range = selection.getRangeAt(0)
  const variable = props.variables.find((i) => i.value === item.value)
  const textNode = document.createElement('span')
  textNode.innerText = `{${item.label}}`
  textNode.style.color = variable?.color
  textNode.dataset.id = item.value

  if (anchorNode == contentEditableDiv || parentNode == contentEditableDiv) {
    range.insertNode(textNode)
    range.collapse(true)
  }

  // 光标移到最后
  const r = document.createRange()
  r.selectNodeContents(contentEditableDiv)
  r.collapse(false)
  const s = window.getSelection()
  s.removeAllRanges()
  s.addRange(r)
  handleValue()
}

const handleValue = () => {
  const _children = hide.value?.childNodes
  let str = ''
  _children.forEach((item) => {
    if (item.nodeName === 'SPAN') {
      if (item.dataset?.id) {
        str += item.innerText.replace(/\{(.*?)\}/g, ($1, $2) => {
          const variable = props.variables.find((item) => item.label === $2)
          if (variable) {
            return `{var:${item.dataset?.id}:${$2}}`
          } else {
            return $1
          }
        })
      } else {
        str += item.innerText
      }
    } else {
      str += item?.textContent
    }
  })
  emits('update:value', str)
}

const onInput = () => {
  handleValue()
}

const onScroll = () => {
  // show.value?.scrollTop = hide.value?.scrollTop;
}

onMounted(() => {
  hide.value.innerHTML = regHidden(props.value)
})
</script>

<style lang="less" scoped>
.template {
  position: relative;
  width: 100%;
  // min-height: 155px;
  // border: 1px solid #d9d9d9;
  // padding: 10px;

  .box {
    position: relative;
    width: 100%;
    height: 100px;
    border: 1px solid #d9d9d9;
    overflow-y: auto;

    .model-hide-input {
      width: 100%;
      padding: 12px 12px 0 12px;
      height: auto;
      min-height: 99px;
      max-height: 70px;
      position: absolute;
      overflow: auto;
      overflow-x: hidden;
      color: transparent;
      background-color: transparent;
      caret-color: black; // 可能部分浏览器不生效
    }

    .model-show-input {
      width: 100%;
      padding: 12px 12px 0 12px;
      height: auto;
      min-height: 99px;
      position: absolute;
      overflow: auto;
      overflow-x: hidden;
      background-color: white;
    }

    [contenteditable] {
      outline: none;
    }
  }

  .select {
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    // .tip {
    //   color: #00000073;
    // }
  }
}
</style>
