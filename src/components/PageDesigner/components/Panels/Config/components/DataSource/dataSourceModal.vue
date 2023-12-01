<template>
  <j-modal visible title="数据源配置" width="800px" @ok="onSave" @cancel="onCancel">
    <j-form layout="vertical" ref="formRef" :model="formModel">
      <j-form-item label="数据源" name="query">
        <div class="query">
          <j-select v-model:value="formModel.methods" :options="[
            { label: 'GET', value: 'get' },
            { label: 'POST', value: 'post' },
            { label: 'PUT', value: 'put' },
            { label: 'PATCH', value: 'patch' },
            { label: 'DELETE', value: 'remove' },
          ]" style="width: 100px;" />
          <j-auto-complete v-model:value="formModel.query" :options="options" placeholder="请输入数据源地址" />
        </div>
      </j-form-item>
      <j-form-item v-if="formModel.queryParams &&formModel.queryParams?.length!==0" label="路由参数" name="queryParams">
        <Params v-model:queryParams="formModel.queryParams"/>
      </j-form-item>
      <j-form-item label="默认参数" name="defaultParams">
        <j-monaco-editor v-model="formModel.defaultParams" language="json" style="height: 160px" />
      </j-form-item>
      <j-form-item label="数据处理" name="handleResult">
        <div>
          <span style="font-weight: 600;">function (result) {</span>
          <j-monaco-editor v-model="formModel.handleResult" language="javascript"
            :registrationTypescript="registrationTypescript" style="height: 200px" />
        </div>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup name="DataSourceModal">
import { queryEndCommands } from '@LowCode/api/form'
import { useProduct } from "@LowCode/store";
import Params from './params.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel'])
const { info } = useProduct()

const formModel = reactive({
  query: props.data.query,
  handleResult: props.data.handleResult,
  defaultParams: props.data.defaultParams,
  queryParams:props.data.queryParams,
  methods: props.data.methods || 'post'
})

const formRef = ref()
const options = ref([])

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

const onSave = () => {
  formRef.value?.validateFields().then(res => {
    if (res) {
      console.log('res',res)
      emit('save', formModel)
    }
  })
}

const onCancel = () => {
  emit('cancel')
}

const handleQuery = (arr) => {
  const commandMap = new Map()
  arr.forEach(item => {
    if (item.command) {
      item.command.forEach(i => {
        const url = `low-code/runtime/${item.moduleId}.${item.id}/${i.id}`
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

const getQueryPrams = (str)=>{
  const arr = str.match(/\{([^}]+)\}/g)?.map(item=>({
    name:item.slice(1,-1),
    key:undefined,
    value:undefined
  }))
  return arr
}

const getQuery = async () => {
  const res =await queryEndCommands(info.id, [])
  // const res = await queryEndCommands('property', [])
  if (res.status === 200) {
    const arr = handleQuery(res.result)
    options.value = arr
  }
}

getQuery()

watch(
  () => formModel.query,
  (val) => {
    // console.log('val===',val,getQueryPrams(val))
    if(val){
      formModel.queryParams = getQueryPrams(val)
    }
  }
)

</script>

<style scoped lang="less">
.query {
  display: flex;
}
</style>
