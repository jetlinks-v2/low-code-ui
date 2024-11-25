import { reactive, version, watchEffect } from 'vue'
import { File, SFCOptions, Store, StoreState } from './types'
import { compileFile } from './transform'
import * as defaultCompiler from 'vue/compiler-sfc'

export const defaultMainFile = 'src/App.vue'
export const jetlinksPluginFile = 'src/jetlinks-repl-plugin.js'
export const defaultHtmlFile = 'index.html'
export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'
const defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`

/**
 * import { installJetlinksPlugin } from './${jetlinksPluginFile}'
 * //注册内部插件(@jetlinks/ui、@jetlinks/components、@jetlinks-web/core、@jetlinks-web/hooks、@jetlinks-web/router、@jetlinks-web/stores、@jetlinks/types和@jetlinks-web/utils)
 * installJetlinksPlugin()
 */
export const defaultVueCode = `
<script setup>
import { ref } from 'vue'
import { installJetlinksPlugin } from './${jetlinksPluginFile}'
//注册内部插件，ant-design-vue、axios
installJetlinksPlugin();

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<style scoped></style>
`.trim()

const jetlinksImports = {
  'ant-design-vue': 'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.15/+esm',
  // '@jetlinks/ui': 'https://cdn.jsdelivr.net/npm/jetlinks-ui-components@1.0.34-8/+esm',
  'axios': 'https://cdn.jsdelivr.net/npm/axios@1.6.1/+esm',
}

const tsconfig = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: 'Preserve',
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'Bundler',
    allowImportingTsExtensions: true,
  },
  vueCompilerOptions: {
    target: 3.3,
  },
}

export class ReplStore implements Store {
  state: StoreState
  options?: SFCOptions
  compiler = defaultCompiler
  vueVersion = version

  private readonly defaultVueRuntimeURL: string
  constructor(code?: string) {
    const files: StoreState['files'] = {}
    if (!code) {
      setFile(files, defaultMainFile, defaultVueCode)
    } else {
      setFile(files, defaultMainFile, code)
    }

    if (!files[jetlinksPluginFile]) {
      setFile(
        files,
        jetlinksPluginFile,
        getJetlinksPluginCode('3.2.15'),
        !import.meta.env.DEV,
      )
    }

    this.defaultVueRuntimeURL = import.meta.env.PROD
      ? defaultVueRuntimeURL
      : `${location.origin}/src/components/CustomHTML/vue-dev-proxy`

    this.state = reactive({
      mainFile: defaultMainFile,
      activeFile: files[defaultMainFile],
      files,
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL,
      typescriptVersion: 'latest',
      typescriptLocale: undefined,
      runTimeLog: [],
    })

    this.initImportMap()
    this.initTsConfig()
  }
  reloadLanguageTools: (() => void) | undefined

  init() {
    watchEffect(() =>
      {
        compileFile(this, this.state.activeFile).then(
          (errs) => (this.state.errors = errs),
        )
      }
    )

    this.state.errors = []
    for (const file in this.state.files) {
      if (file !== defaultMainFile) {
        compileFile(this, this.state.files[file]).then((errs) =>
          this.state.errors.push(...errs),
        )
      }
    }
  }

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename]
  }

  addFile(fileName: string) {
    const file = typeof fileName === 'string' ? new File(fileName) : fileName
    this.state.files[file.filename] = file
    this.setActive(file.filename)
  }

  removeFile(fileName: string) {
    delete this.state.files[fileName]
  }

  updateCompiledFile(compiled: File['compiled'], fileName: string) {
    this.state.files[fileName]!.compiled = compiled
  }

  updateCompiledCode(code: string, fileName: string) {
    this.state.files[fileName]!.code = code
  }

  setJetlinksPluginVersion(version: string) {
    //TODO: Adapt to different component versions
  }

  setVueVersion(version: string) {
    this.vueVersion = version
    const runtimeUrl = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`
    this.state.vueRuntimeURL = runtimeUrl
    const importMap = this.getImportMap()
    const imports = importMap.imports || (importMap.imports = {})
    imports.vue = runtimeUrl
    this.setImportMap(importMap)
    this.reloadLanguageTools?.()
  }

  private initImportMap() {
    const map = this.state.files[importMapFile]
    if (!map) {
      this.state.files[importMapFile] = new File(
        importMapFile,
        JSON.stringify(
          {
            imports: {
              vue: this.defaultVueRuntimeURL,
              ...jetlinksImports,
            },
          },
          null,
          2,
        ),
      )
    } else {
      try {
        const json = JSON.parse(map.code)
        if (!json.imports.vue) {
          json.imports.vue = this.defaultVueRuntimeURL
        } else {
          json.imports.vue = fixURL(json.imports.vue)
        }
        map.code = JSON.stringify(json, null, 2)
      } catch (e) {}
    }
  }

  getImportMap() {
    try {
      return JSON.parse(this.state.files[importMapFile].code)
    } catch (e) {
      this.state.errors = [
        `Syntax error in import-map.json: ${(e as Error).message}`,
      ]
      return {}
    }
  }

  setImportMap(map: { imports: Record<string, string> }) {
    this.state.files[importMapFile]!.code = JSON.stringify(map, null, 2)
  }

  private initTsConfig() {
    if (!this.state.files[tsconfigFile]) {
      this.setTsConfig(tsconfig)
    }
  }

  setTsConfig(config: any) {
    this.state.files[tsconfigFile] = new File(
      tsconfigFile,
      JSON.stringify(config, undefined, 2),
    )
  }

  getTsConfig() {
    try {
      return JSON.parse(this.state.files[tsconfigFile].code)
    } catch {
      return {}
    }
  }
}

function setFile(
  files: Record<string, File>,
  filename: string,
  content: string,
  hidden?: boolean,
) {
  const normalized =
    filename !== importMapFile && !filename.startsWith('src/')
      ? `src/${filename}`
      : filename
  files[normalized] = new File(normalized, content, hidden!)
}

function fixURL(url: string) {
  return url.replace('https://sfc.vuejs', 'https://play.vuejs')
}

function stripSrcPrefix(file: string) {
  return file.replace(/^src\//, '')
}

function getJetlinksPluginCode(version: string | 'latest' | 'preview') {
  let jetlinksCss: string
  if (version === 'latest') {
    jetlinksCss = 'https://cdn.jsdelivr.net/npm/ant-design-vue@latest/dist/antd.min.css'
  } else {
    jetlinksCss = `https://cdn.jsdelivr.net/npm/ant-design-vue@${version}/dist/antd.min.css`
  }

  return `
import AntDesignVue from 'ant-design-vue'
// import JetLinksUI from '@jetlinks/ui'
import { getCurrentInstance } from 'vue'

const jetlinksCss = '${jetlinksCss}'

await appendStyle()

export function installJetlinksPlugin() {
  const instance = getCurrentInstance()
  // instance.appContext.app.use(JetLinksUI)
  instance.appContext.app.use(AntDesignVue)
}

export function appendStyle() {
  return new Promise((resolve, reject) => {
    const dom = document.getElementById('jetlinks-css')
    if(!dom) {
      const link = document.createElement('link')
      link.id = 'jetlinks-css'
      link.rel = 'stylesheet'
      link.href = '${jetlinksCss}'
      link.onload = resolve
      link.onerror = reject
      document.head.appendChild(link)
    }
    resolve()
  })
}`
}
