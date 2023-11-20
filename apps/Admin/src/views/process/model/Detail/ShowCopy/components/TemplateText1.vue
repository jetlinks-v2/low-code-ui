<template>
  <div class="template">
    <div class="box">
      <div
        class="model-show-input"
        contentEditable="plaintext-only"
        ref="show"
        tabIndex="-1"
        :spellcheck="false"
        :data-placeholder="placeholder"
      ></div>
      <div
        class="model-hide-input"
        contentEditable="plaintext-only"
        @input="onInput"
        :class="className"
        ref="hide"
        :spellcheck="false"
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
        showSearch
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
import { Form } from 'jetlinks-ui-components'
import {watchOnce} from "@vueuse/core";

const formItemContext = Form.useInjectFormItemContext()

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

const emits = defineEmits(['update:value', 'change'])
const className = ref(`template-textarea--${randomString(4)}`)

// 绑定节点
const hide = ref() // 隐藏的输入框的节点
const show = ref()

const {
  insertNode: selectionInsert,
  handlePointerup,
  status: _status,
} = useSelection(hide)

const regHidden = (html) => {
  return html.replace(/\{(.*?)\}/g, ($1, $2) => {
    const _arr = $2.split(':')
    return _arr?.length === 3
      ? `<span data-id=${_arr[1]}>{${_arr[2]}}</span>`
      : $1
  })
}

const regHandle = (html) => {
  return html.replace(/{([^{}]+)}/g, ($1, $2) => {
    const _arr = $2.split(':')
    const variable = props.variables.find((i) => i.value === _arr?.[1])
    if (_arr?.length === 3) {
      if (variable) {
        return `<span style="color: ${variable?.color}">{${variable.label}}</span>`
      } else {
        return `{${_arr[2]}}`
      }
    }
    return $1
  })
}

watch(
  () => [props.value, !!show.value, !!props.variables],
  () => {
    if (show.value) {
      show.value.innerHTML = regHandle(props.value)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

const onKeypress = (e) => {
  const _event = e || window.event
  if (_event.keyCode === 13) {
    _event.returnValue = false
  }
}

const handleValue = (_children, key) => {
  let str = ''
  _children.forEach((item) => {
    if (item.nodeName === 'SPAN') {
      if (item.dataset?.id) {
        if (item.childNodes?.length > 1) {
          str += handleValue(item.childNodes, item.dataset?.id)
        } else {
          str += item.innerText.replace(/\{(.*?)\}/g, ($1, $2) => {
            const variable = props.variables.find((item) => item.label === $2)
            if (variable) {
              return `{var:${item.dataset?.id}:${$2}}`
            } else {
              return $1
            }
          })
        }
      } else {
        str += item.innerText.replace(/\{(.*?)\}/g, ($1, $2) => {
          const variable = props.variables.find((i) => i.label === $2)
          if (variable) {
            return `{var:${variable.value}:${$2}}`
          }
          return $1
        })
      }
    } else if (item.childNodes?.length > 1) {
      str += handleValue(item.childNodes)
    } else {
      str += item.textContent.replace(/\{(.*?)\}/g, ($1, $2) => {
        if ($2) {
          if (key) {
            return `{var:${key}:${$2}}`
          }
          const variable = props.variables.find((i) => i.label === $2)
          if (variable) {
            return `{var:${variable.value}:${$2}}`
          }
        }
        return $1
      })
    }
  })
  return str
}

const onInput = () => {
  handlePointerup()
  const _children = hide.value?.childNodes
  const str = handleValue(_children)
  emits('update:value', str)
  emits('change', str)
  formItemContext.onFieldChange()
}

const selectVariable = (key, { label }) => {
  if (!_status.value) {
    hide.value?.focus()
    handlePointerup()
  }
  const spanNode = document.createElement('span')
  spanNode.innerText = `{${label}}`
  spanNode.dataset.id = key
  selectionInsert(spanNode)
  const str = handleValue(hide.value?.childNodes)
  emits('update:value', str)
  emits('change', str)
  formItemContext.onFieldChange()
}

watchOnce(() => props.value, () => {
  hide.value.innerHTML = regHidden(props.value)
})

onMounted(() => {
  hide.value.innerHTML = regHidden(props.value)
})
</script>

<style lang="less" scoped>
.template {
  position: relative;
  width: 100%;
  border: 1px solid #d9d9d9;

  .box {
    position: relative;
    width: 100%;
    height: 100px;
    overflow-y: auto;

    .model-hide-input {
      width: 100%;
      padding: 12px 12px 0 12px;
      height: auto;
      min-height: 99px;
      position: absolute;
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
      background-color: white;

      &:empty:before {
        content: attr(data-placeholder);
        color: lightgray;
        text-overflow: ellipsis;
      }
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
    padding: 10px;
    .tip {
      color: #00000073;
    }
  }
}
</style>
