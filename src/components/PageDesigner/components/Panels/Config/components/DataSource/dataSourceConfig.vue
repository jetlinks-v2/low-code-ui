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
          <DataSourceList v-model:value="formModel.query" />
        </div>
      </j-form-item>
      <j-form-item v-if="formModel.queryParams &&formModel.queryParams?.length!==0" label="路由参数" name="queryParams">
        <Params v-model:queryParams="formModel.queryParams"/>
      </j-form-item>
      <j-form-item label="默认参数" name="defaultParams">
        <ProMonaco
          v-model:value="formModel.defaultParams"
          language="json"
          style="height: 160px"
          :tipCode="tipCode_1"
        />
      </j-form-item>
      <j-form-item label="数据处理" name="handleResult">
        <div>
          <span style="font-weight: 600;">function (result) {</span>
          <ProMonaco v-model:value="formModel.handleResult" language="javascript"
                           :registrationTypescript="registrationTypescript" style="height: 200px"/>
        </div>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts">
import Params from './params.vue'
import DataSourceList from './dataSourceList.vue'
import { ProMonaco } from '../ProMonaco'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})
const options = ref<any[]>([])

const tipCode_1 = `{"sorts": [{ "name": "createTime", "order": "desc" }], "terms": [] }`

const formModel = reactive({
  query: props.value.query,
  handleResult: props.value.handleResult,
  defaultParams: props.value.defaultParams,
  queryParams: props.value.queryParams,
  methods: props.value.methods || 'post'
})

const formRef = ref()

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

const getQueryPrams = (str: any) => {
  const arr = str.match(/\{([^}]+)\}/g)?.map((item: any) => ({
    name: item.slice(1, -1),
    key: undefined,
    value: undefined
  }))
  return arr
}

watch(
    () => formModel.query,
    (val) => {
      if (val) {
        formModel.queryParams = getQueryPrams(val)
      }
    }
)
const onSave = () => new Promise((resolve, reject) => {
  formRef.value?.validate().then((res: any) => {
    if (res) {
      resolve(formModel)
    }
    reject(false)
  })
})

watchEffect(() => {
  Object.assign(formModel, props.value)
})

defineExpose({onSave})
</script>

<style scoped lang="less">
.query {
  display: flex;
}
</style>
