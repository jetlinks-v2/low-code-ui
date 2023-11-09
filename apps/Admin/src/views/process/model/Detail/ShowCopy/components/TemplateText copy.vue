<template>
  <div class="template">
<!--    <div class="select">-->
<!--      <j-button-->
<!--        v-for="item in variables"-->
<!--        :key="item.value"-->
<!--        @click="getPosition(item)"-->
<!--        >{{ item.label }}</j-button-->
<!--      >-->
<!--    </div>-->

    <div class="box">
<!--      <div-->
<!--        class="model-show-input"-->
<!--        contentEditable="plaintext-only"-->
<!--        ref="show"-->
<!--        tabIndex="-1"-->
<!--      ></div>-->
      <div
        class="model-show-input"
        contentEditable="plaintext-only"
        @scroll="onScroll"
        @input="onInput"
        :class="className"
        ref="hide"
        @keypress="onKeypress"
      ></div>
    </div>
    <div class="select">
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
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { randomString } from '@jetlinks/utils'
import { useSelection } from '@/hooks'

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

const { insertNode: selectionInsert } = useSelection(hide)

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

// watch(
//   () => [props.value, !!show.value, props.variables],
//   () => {
//     if (show.value) {
//       hide.value.innerHTML = regHandle(props.value)
//     }
//   },
//   {
//     immediate: true,
//   },
// )

const onKeypress = (e) => {
  const _event = e || window.event
  if (_event.keyCode === 13) {
    _event.returnValue = false
  }
}

const getColor = (key) => {
  const variable = props.variables.find((i) => i.value === key)
  return variable?.color
}

const handleValue = () => {
  const _children = hide.value?.childNodes
  let str = ''
  _children.forEach((item) => {
    if (item.nodeName === 'SPAN') {
      if (item.dataset?.id) {
        str += item.innerText.replace(/\{(.*?)\}/g, ($1, $2) => {
          console.log($1, $2)
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

const onInput = (v) => {
  handleValue()

}

const onScroll = () => {
  // show.value?.scrollTop = hide.value?.scrollTop;
}

const insertText = (val) => {
  const valArr = regHidden(hide.value.innerHTML)?.split('')
  const len = offset.end - offset.start
  valArr.splice(offset.start, len, val)


  // hide.value = valArr.join('').substring(0, 256)
  emits('update:value', valArr.join('').substring(0, 256))
}

const selectVariable = (key, { label }) => {
  // emits('update:value', hide.value + `{${label}}`)
  const spanNode = document.createElement('span');
  spanNode.innerText = `{${label}}`
  spanNode.dataset.id = key
  spanNode.style.color = getColor(key)
  selectionInsert(spanNode)
  insertText(`{${label}}`)
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
