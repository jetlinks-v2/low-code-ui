<template>
  <div class="template">
    <Editor
      style="height: 120px; overflow-y: hidden"
      :defaultConfig="{ placeholder }"
      :mode="'default'"
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

const emits = defineEmits(['update:value', 'change'])
const editorRef = shallowRef()

// // 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>
const replace = (str: string) => {
  return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
    return `<span style="color: ${getColor($2)}">${$1}</span>`
  })
}

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
      const _val = replace(props.value || '')
      editorRef.value?.setHtml('<p>' + _val + '</p>')
    }
  },
  {
    immediate: true,
  },
)

const selectVariable = (_, { label }) => {
    const val = (props?.value || '') + `{${label}}`
    emits('change', val)
}

const onChange = () => {
  emits('change', editorRef.value?.getText())
}

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