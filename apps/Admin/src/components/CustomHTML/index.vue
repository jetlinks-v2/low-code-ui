<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Console from './Console.vue'
import EditorContainer from './editor/EditorContainer.vue'
import Preview from './output/Preview.vue'
// import Menu from '@/components/ListPage/MenuConfig/components/menu.vue'
import { debounce } from './utils'
import MonacoEditor from './editor/MonacoEditor.vue'
import { ReplStore } from './store'
import 'splitpanes/dist/splitpanes.css'

const store = new ReplStore()
const vueMode = ref(true)
store.init()

provide('store', store)
provide('theme', 'dark')
provide('useVueMode', vueMode)

enum OperType {
  View = 'view',
  Menu = 'menu',
}
const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)

const drawerVisible = ref(false)
const $drawerWidth = ref('50%')
const drawerTitle = ref('预览')

const handleDbClickViewName = () => {
  $drawerWidth.value = $drawerWidth.value === '98%' ? '50%' : '98%'
}

const activeOper = ref('')
const handleOperClick = (type: OperType) => {
  if (type === activeOper.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    drawerVisible.value = true
  }
  activeOper.value = type
  $drawerWidth.value = '50%'
  if (type === OperType.View) {
    drawerTitle.value = '预览'
  } else if (type === OperType.Menu) {
    drawerTitle.value = '菜单配置'
  }
  !drawerVisible.value && (activeOper.value = '')
}

const previewRef = ref()
const runLoading = ref(false)
const runCode = () => {
  runLoading.value = true
  previewRef.value.updatePreview()
  window.addEventListener('message', (ac) => {
    runLoading.value = false
    if (ac.data.action === 'error') {
      store.state.errors = [ac.data.error]
    }
  })
}
</script>

<template>
  <div class="jetlinks-repl">
    <SplitPane class="split-pane">
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
    </SplitPane>
    <div class="right-oper">
      <div class="oper-list">
        <div
          class="list-item"
          :class="{ active: activeOper === OperType.View }"
          @click="handleOperClick(OperType.View)"
        >
          预览
        </div>
        <div
          class="list-item"
          :class="{ active: activeOper === OperType.Menu }"
          @click="handleOperClick(OperType.Menu)"
        >
          菜单配置
        </div>
      </div>
    </div>

    <div class="drawer-content" v-show="drawerVisible">
      <div class="drawer-header">
        <div class="drawer-title" @dblclick="handleDbClickViewName">
          {{ drawerTitle }}
          <j-button
            type="primary"
            size="small"
            @click.stop="runCode"
            @dblclick.stop
            :loading="runLoading"
            >运行</j-button
          >
        </div>
      </div>
      <div class="drawer-body">
        <Preview v-if="activeOper === OperType.View" ref="previewRef" />
        <Menu v-else-if="activeOper === OperType.Menu" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.jetlinks-repl {
  height: calc(100vh - 48px);
  display: flex;
  position: relative;
  .split-pane {
    width: 98%;
  }
  .right-oper {
    width: 2%;

    .oper-list {
      width: 100%;
      text-align: center;
      display: grid;
      justify-content: center;
      margin-top: 14px;

      .list-item {
        cursor: pointer;
        writing-mode: vertical-rl;
        text-orientation: upright;
        padding-bottom: 18px;
        font-size: 17px;
        user-select: none;
        &:hover {
          color: var(--ant-primary-color);
        }
        &.active {
          color: var(--ant-primary-color);
        }
      }
    }
  }
}
.drawer-content {
  position: absolute;
  right: 2%;
  top: 0;
  width: v-bind('$drawerWidth');
  height: 100%;
  margin: 0;
  background-color: #fff;
  overflow-y: auto;
  .drawer-header {
    position: relative;
    padding: 16px 24px;
    color: #000000d9;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    .drawer-title {
      cursor: pointer;
      margin: 0;
      color: #000000d9;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      user-select: none;
    }
  }
  .drawer-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
  }
}
</style>
