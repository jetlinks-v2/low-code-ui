<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Console from './Console.vue'
import EditorContainer from './editor/EditorContainer.vue'
import Preview from './output/Preview.vue'
import { Store } from './types'
import { debounce } from './utils'
import MonacoEditor from './editor/MonacoEditor.vue'
const props = defineProps<{
  theme: 'light' | 'dark'
  store: Store
}>()
const { store } = props
const vueMode = ref(true)

store.init()

provide('store', store)
provide('theme', toRef(props, 'theme'))
provide('useVueMode', vueMode)

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)
</script>

<template>
  <div class="jetlinks-repl">
    <SplitPane>
      <template #editor>
        <EditorContainer title="代码编辑">
          <MonacoEditor
            @change="onChange"
            :filename="store.state.activeFile.filename"
            :value="store.state.activeFile.code"
          />
        </EditorContainer>
      </template>
      <template #console>
        <EditorContainer title="运行日志">
          <Console :error="store.state.errors[0]" />
        </EditorContainer>
      </template>
      <template #preview>
        <EditorContainer title="预览效果">
          <Preview />
        </EditorContainer>
      </template>
    </SplitPane>
  </div>
</template>

<style lang="less" scoped>
.jetlinks-repl {
  height: calc(100vh - 48px);
}
</style>
