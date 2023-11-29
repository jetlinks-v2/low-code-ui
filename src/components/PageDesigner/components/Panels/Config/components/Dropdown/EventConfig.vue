<template>
  <j-modal title="事件配置" visible @cancel="$emit('closeConfig')" width="800px">
    <j-form
        layout="vertical"
        ref="formRef"
        :model="formModel"
    >
      <j-form-item
        label="数据源"
        name="query"
      >
        <j-input v-model:value="formModel.query" placeholder="请输入数据源地址" >
          <template #addonBefore>
            <j-select
              v-model:value="formModel.methods"
              :options="[
                  { label: 'GET', value: 'get' },
                  { label: 'POST', value: 'post' },
                  { label: 'PUT', value: 'put' },
                  { label: 'PATCH', value: 'patch' },
                  { label: 'DELETE', value: 'remove' },
              ]"
            />
          </template>
        </j-input>
      </j-form-item>
      <j-form-item
        label="默认参数"
        name="defaultParams"
      >
        <j-monaco-editor
            v-model="formModel.defaultParams"
            language="json"
            style="height: 160px"
        />
      </j-form-item>
      <j-form-item
        label="数据处理"
        name="handleResult"
      >
        <div>
          <span style="font-weight: 600;">function (result) {</span>
          <j-monaco-editor
              v-model="formModel.handleResult"
              language="javascript"
              :registrationTypescript="registrationTypescript"
              style="height: 200px"
          />
        </div>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['closeConfig','submit'])

const formModel = reactive({
  query: props.data.query,
  handleResult: props.data.handleResult,
  defaultParams: props.data.defaultParams,
  methods: props.data.methods || 'post'
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
</script>
<style lang="less" scoped>
</style>