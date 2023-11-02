<template>
  <div class="template">
    <div class="box">
      <j-textarea
        :value="hide"
        :placeholder="placeholder"
        :auto-size="{ minRows: 4 }"
        :bordered="false"
        @change="onChange"
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

// 根据选择的变量找出颜色
const getColor = (str) => {
  return (
    props.variables?.filter((item) => item?.label === str)?.[0]?.color || 'red'
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

watch(
  () => props.value,
  () => {
    hide.value = props.value
  },
  {
    immediate: true,
  },
)

const onChange = (e) => {
  emits('update:value', e.target.value)
  console.log(window.getSelection())
}

const selectVariable = (_, { label }) => {
  emits('update:value', hide.value + `{${label}}`)
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
    }

    .html {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 11px;
        pointer-events: none;
    }
  }

  .select {
    text-align: end;
  }
}
</style>