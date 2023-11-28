<template>
  <j-modal
      visible
      title="配置响应器"
      width="1000px"
      @ok="onSave"
      @cancel="onCancel"
  >
    <div class="editor-warp">
      <div>function onCreated({ context, axios, route, refs})</div>
      <div class="editor-code">
        <div class="code">
          <j-monaco-editor
              :modelValue="_value"
              language="javascript"
              :registrationTips="registrationTips"
              :registrationTypescript="registrationTypescript"
              @change="change"
          />
        </div>
        <div class="code-tip">
          <j-monaco-editor
              :modelValue="defaultCode"
              language="javascript"
              :registrationTypescript="registrationTypescript"
          />
        </div>
      </div>

    </div>
  </j-modal>
</template>

<script setup name="LifeCycleModal">

const props = defineProps({
  data: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: 'created'
  },
  id: {
    type: String,
    default: undefined
  }
})
console.log(props.data)
const emit = defineEmits('save', 'cancel')

const _value = ref(props.data)

const designer = inject('PageDesigner')

const registrationTips = computed(() => {
  // 过滤自己
  const options = Object.keys(designer.dependencies.value).map((key) => {
    return {
      label: designer.dependencies[key] ?? key,
      insertText: key,
      kind: 18
    }
  })

  return {
    name: 'javascript',
    suggestions: options
  }
})

const defaultCode = `
/**
* @params context {Object} 页面全局依赖项
* @params axios {Axios} 请求实例
* @params route {Object} 路由信息
* @params refs  {Object} 当前组件下的refs
*/
function onCreated({ context, axios, route, refs}){

  /**
  * 接口请求
  * post、postParams、get、patch、remove、put
  */
  // axios.post(url, data)
  // axios.postParams(url, data, params)
  // axios.get(url, params)
  // axios.patch(url, data)
  // axios.remove(url, params)
  // axios.put(url, data)

  /**
  * 路由信息
  * route.params
  * route.query
  */
  const is = route.params.id

}
`

const change = (v) => {
  _value.value = v
}

const registrationTypescript = {
  name: 'typescript',
  typescript: `
    type Context = Record<string, any>;
    type Route = {
          query?: Record<string, any>;
          params: query?: Record<string, any>;
          fullPath: string;
          hash: string;
          path: string;
      };
    type  Axios = {
          post: (url: string, data?: any, ext?: any) => Promise<any>;
          postParams: (url: string, data: any, params?: any, ext?: any) => Promise<any>;
          get: (url: string, params?: any, ext?: any) => Promise<any>;
          put: (url: string, data?: any, ext?: any) => Promise<any>;
          patch: (url: string, data?: any, ext?: any) => Promise<any>;
          remove: (url: string, params?: any, ext?: any) => Promise<any>;
      };
    type  Refs = Record<string, any>

    const context: Context
    const axios: Axios
    const refs: Refs
    const route: Route
  `
}
const onSave = () => {
  emit('save', _value.value)
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped lang="less">
.editor-warp {

  .editor-code {
    height: 300px;
    display: flex;

    .code {
      flex-grow: 1;
      min-width: 0;
    }

    .code-tip {
      width: 450px;
      padding: 0 8px;
    }
  }
}
</style>
