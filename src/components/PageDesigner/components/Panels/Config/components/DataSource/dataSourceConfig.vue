<template>
  <div>
    <j-form layout="vertical" ref="formRef" :model="formModel">
      <j-form-item label="数据源" name="query">
        <div class="query">
          <j-select v-model:value="formModel.methods" :options="[
            { label: 'GET', value: 'get' },
            { label: 'POST', value: 'post' },
            { label: 'PUT', value: 'put' },
            { label: 'PATCH', value: 'patch' },
            { label: 'DELETE', value: 'remove' },
          ]" style="width: 100px;"/>
          <j-auto-complete v-model:value="formModel.query" :options="options" placeholder="请输入数据源地址"/>
        </div>
      </j-form-item>
      <j-form-item v-if="formModel.queryParams &&formModel.queryParams?.length!==0" label="路由参数" name="queryParams">
        <Params v-model:queryParams="formModel.queryParams"/>
      </j-form-item>
      <j-form-item label="默认参数" name="defaultParams">
        <j-monaco-editor v-model="formModel.defaultParams" language="json" style="height: 160px"/>
      </j-form-item>
      <j-form-item label="数据处理" name="handleResult">
        <div>
          <span style="font-weight: 600;">function (result) {</span>
          <j-monaco-editor v-model="formModel.handleResult" language="javascript"
                           :registrationTypescript="registrationTypescript" style="height: 200px"/>
        </div>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts">
import Params from './params.vue'
import {queryEndCommands} from '@LowCode/api/form'
import {useProduct} from "@LowCode/store";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})
const options = ref<any[]>([])

const formModel = reactive({
  query: props.value.query,
  handleResult: props.value.handleResult,
  defaultParams: props.value.defaultParams,
  queryParams: props.value.queryParams,
  methods: props.value.methods || 'post'
})

const formRef = ref()

const {info} = useProduct()

const registrationTypescript = {
  name: 'typescript',
  typescript: `
    type ResultDataType = {
        data: Array<any>
    }
    type ResultType = Array<any> | ResultDataType
    const result: ResultType
  `
}

const handleQuery = (arr: any[]) => {
  const commandMap = new Map()
  arr.forEach((item: any) => {
    if (item.command) {
      item.command.forEach((i: any) => {
        const url = `low-code/runtime/${info.id}/${info.id}.${item.moduleId}.${item.id}/${i.id}`
        const label = `${item.moduleName}-${item.name}-${i.name}`
        commandMap.set(url, {
          label: label,
          value: url
        })
      })
    }
  })
  return [...commandMap.values()]
}

const getQueryPrams = (str: any) => {
  const arr = str.match(/\{([^}]+)\}/g)?.map((item: any) => ({
    name: item.slice(1, -1),
    key: undefined,
    value: undefined
  }))
  return arr
}

const getQuery = async () => {
  const res = await queryEndCommands(info.id, [])
  if (res.status === 200) {
    const arr = handleQuery(res.result)
    options.value = arr
  }
}

getQuery()

watch(
    () => formModel.query,
    (val) => {
      if (val) {
        formModel.queryParams = getQueryPrams(val)
      }
    }
)
const onSave = () => new Promise((resolve, reject) => {
  formRef.value?.validateFields().then((res: any) => {
    if (res) {
      resolve(formModel)
    }
    reject(false)
  })
})

defineExpose({onSave})
</script>

<style scoped lang="less">
.query {
  display: flex;
}
</style>