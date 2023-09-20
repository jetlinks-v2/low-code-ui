<script setup lang="ts">
import {
  onUnmounted,
  onMounted,
  ref,
  watchEffect,
  inject,
  watch,
  Ref,
} from 'vue'
import srcdoc from '../output/srcdoc.html?raw'
import { compileModulesForPreview } from '../output/moduleComplier'
import { Store } from '../types'
import { ReplStore } from '../store'

const props = defineProps<{ code?: string }>()
// const useVueMode = <Ref<Boolean>>inject('useVueMode')
let store = inject('store') as Store
if (props.code) {
  store = new ReplStore(props.code)
  store.init()
}
const preview = ref()
const runtimeError = ref()
let sandBox: any

watch(
  () => store.getImportMap(),
  () => {
    try {
      createSandBox()
    } catch (e) {
      store.state.errors = [e as Error]
      return
    }
  },
)

// watch(useVueMode, () => {
//   createSandBox()
// })

onMounted(() => {
  createSandBox()
})

onUnmounted(() => {
  sandBox.removeEventListener('load', () => {
    updatePreview
  })
})

function createSandBox() {
  if (sandBox) {
    preview.value.removeChild(sandBox)
  }

  sandBox = document.createElement('iframe')
  sandBox.id = 'previewFrame'
  sandBox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )
  const importMap = store.getImportMap()
  if (!importMap.imports) {
    importMap.imports = {}
  }
  if (!importMap.imports.vue) {
    importMap.imports.vue = store.state.vueRuntimeURL
  }
  const sandBoxSrc = srcdoc.replace(
    /<!--IMPORT_MAP-->/,
    JSON.stringify(importMap)
  )
  sandBox.srcdoc = sandBoxSrc
  preview.value.appendChild(sandBox)
  sandBox.addEventListener('load', () => {
    updatePreview()
  })
}

function updatePreview() {
  // if (!useVueMode?.value) return
  if (import.meta.env.PROD) {
    console.clear()
  }
  runtimeError.value = undefined

  try {
    const mainFile = store.state.mainFile
    const modules = compileModulesForPreview(store)
    console.log(
      `[@jetlinks/repl] successfully compiled ${modules.length} module${
        modules.length > 1 ? `s` : ``
      }.`,
    )
    const codeToEval = [
      `window.__modules__ = {};window.__css__ = [];` +
        `if (window.__app__) window.__app__.unmount();` +
        `document.body.innerHTML = '<div id="app"></div>'`,
      ...modules,
      `setTimeout(()=> {
        document.querySelectorAll('style[css]').forEach(el => el.remove())
        document.head.insertAdjacentHTML('beforeend', window.__css__.map(s => \`<style css>\${s}</style>\`).join('\\n'))
      }, 1)`,
    ]
    if (mainFile.endsWith('.vue')) {
      codeToEval.push(`
        import { createApp as _createApp } from "vue"
        const _mount = () => {
          const AppComponent = __modules__["${mainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          if (!app.config.hasOwnProperty('unwrapInjectedRef')) {
            app.config.unwrapInjectedRef = true
          }
          app.config.errorHandler = e => console.error(e)
          app.mount('#app')
        }
        _mount()
        `)
    }
    sandBox.contentWindow.postMessage(
      {
        action: 'eval',
        code: codeToEval,
      },
      '*',
    )
  } catch (error) {
    console.error(error)
    runtimeError.value = (error as Error).message
  }
}

defineExpose({
  updatePreview,
})
</script>

<template>
    <div class="preview-container" ref="preview"></div>
</template>

<style lang="less" scoped>
.preview-container {
  height: 100%;
  :deep(iframe) {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #fff;
  }
}
</style>
