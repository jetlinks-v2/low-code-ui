<template>
  <div class="editor">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
    />
    <Editor
        :style="{height: height + 'px', overflowY: 'hidden'}"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {fileUpload} from '@LowCode/api/comm'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 200
  },

  placeholder: {
    type: String,
    default: '请输入'
  },
  disabled: {
    type: Boolean,
    default: false
  },
})
const emits = defineEmits(['update:value', 'change'])
const editorRef = shallowRef()
const valueHtml = ref('') // 内容 HTML
const toolbarConfig = {
  excludeKeys: ['fullScreen', 'insertImage', 'codeBlock', 'redo', '|', 'group-video'] // insertLink
}
const editorConfig = {
  placeholder: props.placeholder,
  readOnly: props.disabled,
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: any, insertFn: any) {
        const formData = new FormData()
        formData.append('file',file)
        const resp = await fileUpload(formData)
        if(resp.success){
          insertFn(resp?.result?.accessUrl, resp.result?.name, resp?.result?.accessUrl)
        }
      }
    }
  }
}
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleChange = (editor: any) => {
  if(editor.getText()){
    emits('update:value', editor.getHtml())
    emits('change', editor.getHtml())
  } else {
    emits('update:value', '')
    emits('change', '')
  }
}

watchEffect(() => {
  valueHtml.value = props.value || ''
})

onBeforeUnmount(() => {// 组件销毁时，也及时销毁编辑
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped lang="less">
.editor {
  border: 1px solid #ccc;
  position: relative;
  width: 100%;
}
</style>