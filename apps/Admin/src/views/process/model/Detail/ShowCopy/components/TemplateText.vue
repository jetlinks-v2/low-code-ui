<template>
  <div class="template">
    <div class="box">
      <j-textarea
        :value="hide"
        :placeholder="placeholder"
        :auto-size="{ minRows: 4 }"
        :bordered="false"
        :class="className"
        @change="onChange"
        @focus="focus"
        @blur="focus"
      />
      <div class="html">
        <span v-html="titleHtml"></span>
      </div>
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
import { watch, ref } from 'vue'
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
})

const emits = defineEmits(['update:value'])
const className = ref(`template-textarea--${randomString(4)}`)
const offset = reactive({
  start: 0,
  end: 0
})

// 绑定节点
const hide = ref() // 隐藏的输入框的节点

// 根据选择的变量找出颜色
const getColor = (str) => {
  return (
    props.variables?.filter((item) => item?.label === str)?.[0]?.color
  )
}

// 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>${getColor($2)}
const replace = (str) => {
  return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
    return `<span style="color: ${getColor($2)}">${$1}</span>`
  })
}

const titleHtml = computed(() => {
  return replace(hide.value || '')
})

const focus = () => {
  getOffset()
}

watch(
  () => props.value,
  () => {
    hide.value = props.value
  },
  {
    immediate: true,
  },
)

const getOffset = () => {
  const textAreaEl = document.querySelector(`.${className.value}`)
  if (textAreaEl) {
    offset.start = textAreaEl.selectionStart
    offset.end = textAreaEl.selectionEnd
  }
}

const onChange = (e) => {
  getOffset()
  emits('update:value', e.target.value)
}

const insertText = (val) => {
  const valArr = hide.value.split('')
  const len = offset.end - offset.start
  valArr.splice(offset.start, len, val)
  hide.value = valArr.join('')
}

const selectVariable = (_, { label }) => {
  // emits('update:value', hide.value + `{${label}}`)
  insertText(`{${label}}`)
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

    textarea {
      color: rgba(0, 0, 0, 0);
      background-color: transparent;
      caret-color: black; // 光标颜色
      word-break: break-all;
    }

    .html {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 11px;
        pointer-events: none;
        word-break: break-all;
    }
  }

  .select {
    text-align: end;
  }
}
</style>
