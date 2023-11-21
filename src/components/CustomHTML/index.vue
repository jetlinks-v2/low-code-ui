<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Console from './Console.vue'
import EditorContainer from './editor/EditorContainer.vue'
import Preview from './output/Preview.vue'
import MenuList from '@/components/ListPage/MenuConfig/components/menu.vue'
import { debounce } from './utils'
import MonacoEditor from './editor/MonacoEditor.vue'
import {defaultMainFile, ReplStore} from './store'
import 'splitpanes/dist/splitpanes.css'
import { useProduct } from '@/store/product'
import { storeToRefs } from 'pinia'
import { onlyMessage } from '@jetlinks-web/utils'
import { BASE_INFO, MENU_CONFIG } from "@/components/ListPage/keys";

const props = defineProps({
  data: Object,
  showTip: {
    type: Boolean,
    default: true
  }
})


const productStore = useProduct()
const store = new ReplStore(props.data?.configuration?.code)
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
  productStore.update({
    ...props.data,
    configuration: {
      type: 'html',
      code
    }
  })
}, 250)

// const onBlur = debounce(() => updateStoreCode(), 250)

const drawerVisible = ref(false)
const $drawerWidth = ref('50%')
const drawerTitle = ref('预览')
const menuError = ref(0)

const handleDbClickViewName = () => {
  if (activeOper.value === OperType.View) {
    $drawerWidth.value = $drawerWidth.value === 'calc(100% - 50px)' ? '50%' : 'calc(100% - 50px)'
  }
}

const handleDbCLickEditor = () => {
  if (activeOper.value === OperType.View) {
    $drawerWidth.value = $drawerWidth.value === '50%' ? '0%' : '50%'
  }
}

const activeOper = ref('')
const menuListRef = ref()
const menuFormData = ref({ pageName: '', main: true, name: '', icon: '' })
const menuChangeValue = ref()
const replRef = ref()
const errors = ref([] as any)
const handleOperClick = (type: OperType) => {
  if (type === OperType.View && drawerVisible.value && $drawerWidth.value === '0%') {
    $drawerWidth.value = '50%'
    return
  }

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

const updateStoreCode = () => {
  productStore.update({
    ...props.data,
    configuration: {
      type: 'html',
      code: store.state.activeFile.code,
    },
  })
}
const previewRef = ref()
const runLoading = ref(false)
const runCode = () => {
  runLoading.value = true
  previewRef.value.updatePreview()
  window.addEventListener('message', (ac) => {
    runLoading.value = false
    if (ac.data.action === 'error' && ac.data.error) {
      store.state.errors = [ac.data.error]
    }
  })
}

const handleValidate = async () => {
  const menuStatus = await validateMenu()
  if (props.showTip) {
    if (menuStatus) {
      // onlyMessage(errors.value[0].errors[0], 'error')
    } else if(!store.state.activeFile.code){
      onlyMessage('页面代码为空', 'error')
    } else if(store.state.errors?.length > 0) {
      onlyMessage('运行日志报错', 'error');
    } else {
      onlyMessage('校验通过', 'success')
    }
  }
}

provide(BASE_INFO, props.data)
provide(MENU_CONFIG, menuFormData)

const validateMenu = async () => {
  const resp = await menuListRef.value?.vaildate()
  if (resp.errorFields) {
    menuError.value = resp.errorFields.length
    return true
  } else {
    menuError.value = 0
    return false
  }
}

const updateMenuFormData = (val) => {
  nextTick(() => {
    validateMenu()
  })

  productStore.update({
    ...props.data,
    others: {
      ...props.data.others,
      menu: val,
    },
  })
}

const errorValidate = async () => {
  const err: any[] = [];
  const menuResp = await menuListRef.value?.vaildate()
  if (menuResp.errorFields) {
    menuError.value = menuResp.errorFields.length
    menuResp.errorFields.forEach(item => {
      const msg = item.errors[0]
      err.push({ message: msg })
    })
  } else {
    menuError.value = 0
  }
  store.state.errors.forEach((error: any) => {
    err.push({
      message: error.message ?? error
    })
  })
  errors.value.forEach((error: any) => {
    err.push({
      message: error.errors[0]
    })
  })
  if (!store.state.activeFile.code) {
    err.push({message: '页面代码为空'})
  }

  return new Promise((resolve, reject) => {
    if (err.length) {
      reject(err)
    } else {
      resolve(true)
    }
  });
}

const cancel = () => {
  drawerVisible.value = false
  activeOper.value = ''
}

const submit = () => {
  menuListRef.value?.vaildate()
  cancel()
}

const editorFocus = () => {
  if (activeOper.value === OperType.Menu) {
    drawerVisible.value = false
    activeOper.value = ''
  }
}

const errorChange = (e) => {
  console.log('errorChange', e)
}

watch(() => props.data?.title, () => {
  menuFormData.value = {
    ...props.data.others.menu,
    pageName: props.data?.title || '',
  }
}, { immediate: true })

defineExpose({
  validate: errorValidate
})
</script>

<template>
  <div class="jetlinks-repl" ref="replRef">
    <SplitPane class="split-pane" @click="editorFocus">
      <template #editor>
        <EditorContainer @dbClick="handleDbCLickEditor">
          <MonacoEditor
            @change="onChange"
            @errorChange="errorChange"
            :filename="store.state.activeFile.filename"
            :value="store.state.activeFile.code"
          />
          <template #title>
            <div style="margin-right: 10px">代码编辑</div>
            <j-button
              type="primary"
              size="small"
              @click.stop="handleValidate"
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
          <AIcon type="CaretRightOutlined"/>
        </div>
        <j-badge :count="menuError">
        <div
          class="list-item"
          :class="{ active: activeOper === OperType.Menu }"
          @click="handleOperClick(OperType.Menu)"
        >

            <AIcon type="MenuOutlined"/>

        </div>
        </j-badge>
      </div>
    </div>
    <div class="drawer-content" :style="{ width: $drawerWidth }" v-show="drawerVisible">
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
          </j-button>
        </div>
      </div>
      <div class="drawer-body">
        <Preview v-if="activeOper === OperType.View" ref="previewRef" />
        <div v-show="activeOper === OperType.Menu">
          <MenuList
            ref="menuListRef"
            @change="updateMenuFormData"
          />
        </div>
      </div>
<!--      <div class="drawer-footer" v-show="activeOper === OperType.Menu">-->
<!--        <j-button @click="cancel">取消</j-button>-->
<!--        <j-button type="primary"  @click="submit">确认</j-button>-->
<!--      </div>-->
    </div>
  </div>
</template>

<style lang="less" scoped>
.jetlinks-repl {
  height: 100%;
  display: flex;
  position: relative;
  .split-pane {
    width: calc(100% - 50px);
  }
  .right-oper {
    padding: 0 8px;

    .oper-list {
      width: 100%;
      text-align: center;
      display: grid;
      justify-content: center;
      margin-top: 16px;

      .list-item {
        cursor: pointer;
        font-size: 16px;
        user-select: none;
        border-radius: 4px;
        background-color: #F6F6F6;
        transition: all .3s ease-in;
        width: 36px;
        height: 36px;
        line-height: 36px;

        &:not(:last-child) {
          margin-bottom: 16px;
        }

        &:hover {
          color: var(--ant-primary-color);
        }
        &.active {
          color: var(--ant-primary-color);
          background-color: #F0F0F0;
        }
      }
    }
  }
}
.drawer-content {
  position: absolute;
  right: 50px;
  top: 0;
  width: 50%;
  height: 100%;
  margin: 0;
  background-color: #fff;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  z-index: 20;
  display: flex;
  flex-direction: column;

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
    flex: 1 1 auto;
  }

  .drawer-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
    display: flex;
    gap: 24px;
  }
}
</style>
