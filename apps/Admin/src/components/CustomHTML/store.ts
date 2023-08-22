import { version } from 'vue'
import { File, SFCOptions, Store, StoreState } from './types'
import { compileFile } from './transform'
import * as defaultCompiler from 'vue/compiler-sfc'

const defaultHtml = `
<div id="app">
  <div>
    <h1> Hello {{ title }} </h1>
  </div>
</div>
`.trim()
// https://unpkg.com/jetlinks-ui-components@1.0.28/es/index.js
const jetlinksImports = {
  // '@jetlinks/all': import.meta.env.PROD
  //   ? 'https://cdn.jsdelivr.net/npm/jetlinks-ui-components@1.0.28/es/index.js'
  //   : `${location.origin}/src/components/CustomHTML/other-dev-proxy`,
  '@jetlinks/all': './other-dev-proxy',
  '@jetlinks-core': './src/components/CustomHTML/dist/jetlinks-core.umd.js',
  'ant-design-vue': 'https://unpkg.com/ant-design-vue@3.2.15/dist/antd.min.js',
}

export const defaultVueCode = `
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<style scoped></style>
`.trim()

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

export const defaultMainFile = 'src/App.vue'
export const defaultHtmlFile = 'index.html'
export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'
const defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`

export class ReplStore implements Store {
  state: StoreState
  options?: SFCOptions
  compiler = defaultCompiler
  vueVersion = version

  private defaultVueRuntimeURL: string
  constructor(code?: string) {
    const files: StoreState['files'] = {}
    if (!code) {
      setFile(files, defaultMainFile, defaultVueCode)
    } else {
      setFile(files, defaultMainFile, code)
    }
    this.defaultVueRuntimeURL = import.meta.env.PROD
      ? defaultVueRuntimeURL
      : `${location.origin}/src/components/CustomHTML/vue-dev-proxy`

    let mainFile = defaultMainFile
    this.state = reactive({
      mainFile,
      activeFile: files[mainFile],
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
      compileFile(this, this.state.activeFile).then(
        (errs) => (this.state.errors = errs),
      ),
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
    console.log(this.state.files[importMapFile])
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
) {
  const normalized =
    filename !== importMapFile && !filename.startsWith('src/')
      ? `src/${filename}`
      : filename
  files[normalized] = new File(normalized, content)
}

function fixURL(url: string) {
  return url.replace('https://sfc.vuejs', 'https://play.vuejs')
}
