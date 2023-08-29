import * as defaultCompiler from 'vue/compiler-sfc'
import {
  SFCScriptCompileOptions,
  SFCAsyncStyleCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc'

export type PreviewMode = 'js' | 'css' | 'ssr'

export class File {
  filename: string
  code: string
  hidden?: boolean
  compiled = {
    js: '',
    css: '',
    ssr: '',
  }

  constructor(filename: string, code = '', hidden?: boolean) {
    this.filename = filename
    this.code = code
    this.hidden = hidden
  }

  get language() {
    if (this.filename.endsWith('.vue')) {
      return 'vue'
    }
    if (this.filename.endsWith('.html')) {
      return 'html'
    }
    if (this.filename.endsWith('.css')) {
      return 'css'
    }
    if (this.filename.endsWith('.ts')) {
      return 'typescript'
    }
    return 'javascript'
  }
}

export interface StoreState {
  mainFile: string
  activeFile: File
  files: Record<string, File>
  errors: (string | Error)[]
  vueRuntimeURL: string
  typescriptVersion: string
  typescriptLocale?: string | undefined
  locale?: string | undefined
  runTimeLog: (string | Error)[]
}

export interface SFCOptions {
  script?: Partial<SFCScriptCompileOptions>
  style?: Partial<SFCAsyncStyleCompileOptions>
  template?: Partial<SFCTemplateCompileOptions>
}

export interface Store {
  state: StoreState
  options?: SFCOptions
  compiler: typeof defaultCompiler
  vueVersion?: string
  init: () => void
  setActive: (filename: string) => void
  addFile: (filename: string) => void
  removeFile: (fileName: string) => void
  updateCompiledFile: (compiled: File['compiled'], fileName: string) => void
  getImportMap: () => any
  getTsConfig?: () => any
  reloadLanguageTools: undefined | (() => void)
}
