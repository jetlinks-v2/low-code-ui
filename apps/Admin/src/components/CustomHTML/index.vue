<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Console from './Console.vue'
import EditorContainer from './editor/EditorContainer.vue'
import Preview from './output/Preview.vue'
import MenuList from '@/components/ListPage/MenuConfig/components/menu.vue'
import { debounce } from './utils'
import MonacoEditor from './editor/MonacoEditor.vue'
import { ReplStore } from './store'
import 'splitpanes/dist/splitpanes.css'
import { useProduct } from '@/store/product'
import { storeToRefs } from 'pinia'
import { useEngine } from '@/store/engine'
import { onlyMessage } from '@jetlinks/utils'
import { BASE_INFO, MENU_CONFIG } from "@/components/ListPage/keys";

const props = defineProps({
  data: Object
})

const engineStore = useEngine()
const productStore = useProduct()
const { files, activeFile } = storeToRefs(engineStore)
const store = new ReplStore(files.value[activeFile.value]?.configuration?.code)
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
const menuListRef = ref()
const menuFormData = ref({ pageName: '', main: true, name: '', icon: '' })
const menuChangeValue = ref()
const errors = ref([] as any)
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

const handleVaild = () => {
  if (errors.value.length > 0) {
    onlyMessage(errors.value[0].errors[0], 'error')
  } else {
    onlyMessage('校验成功', 'success')
  }
  productStore.update({
    ...props.data,
    configuration: {
      type: 'html',
      code: store.state.activeFile.code,
    },
  })
}

provide(BASE_INFO, props.data)
provide(MENU_CONFIG, menuFormData)

const updateMenuFormData = (val) => {
  nextTick(() => {
    menuListRef.value?.vaildate().then(vaild => {
      if (vaild?.errorFields?.length > 0) {
        errors.value = vaild.errorFields ?? []
      }
    })
  })

  productStore.update({
    ...props.data,
    others: {
      ...props.data.others,
      menu: val,
    },
  })
}

const errorValidate = () => {
  return new Promise((resolve, reject) => {
    const err = [];
    storeErrors.value.forEach((error: any) => {
      err.push({
        massage: error.message ?? error
      })
    })
    errors.value.forEach((error: any) => {
      err.push({
        massage: error.errors[0]
      })
    })
    resolve(err)
  })
}

onMounted(() => {
  menuFormData.value = {
    ...props.data.others.menu,
    pageName: props.data.pageName || props.data?.title || '',
  }
})

defineExpose({
  vaildate: errorValidate
})
</script>

<template>
  <div class="jetlinks-repl">
    <SplitPane class="split-pane">
      <template #editor>
        <EditorContainer>
          <MonacoEditor
            @change="onChange"
            :filename="store.state.activeFile.filename"
            :value="store.state.activeFile.code"
          />
          <template #title>
            <div style="margin-right: 10px">代码编辑</div>
            <j-button
              type="primary"
              size="small"
              @click.stop="handleVaild"
              @dblclick.stop
            >校验
            </j-button
            >
          </template>
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
            v-if="activeOper === OperType.View"
            type="primary"
            size="small"
            @click.stop="runCode"
            @dblclick.stop
            :loading="runLoading"
          >运行
          </j-button
          >
        </div>
      </div>
      <div class="drawer-body">
        <Preview v-if="activeOper === OperType.View" ref="previewRef" />
        <MenuList
          v-else-if="activeOper === OperType.Menu"
          ref="menuListRef"
          :form-data="menuFormData"
          @update:form="updateMenuFormData"
        />
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
