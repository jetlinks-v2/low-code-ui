<template>
  <j-modal
      visible
      title="数据源配置"
      width="800px"
      @ok="onSave"
      @cancel="onCancel"
  >
    <j-form
        layout="vertical"
        ref="formRef"
        :model="formModel"
    >
      <j-form-item
        label="数据源"
        name="query"
        :rules="[{ required: true, message: '请输入数据源地址'}]"
      >
        <j-input v-model:value="formModel.query" placeholder="请输入数据源地址" />
      </j-form-item>
      <j-form-item
        label="默认查询参数"
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

<script setup name="DataSourceModal">

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel'])

const formModel = reactive({
  query: props.data.query,
  handleResult: props.data.handleResult,
  defaultParams: props.data.defaultParams ?? `{ "sorts": [{ "name": "createTime", "order": "desc" }]}`,
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

const onSave = () => {
  console.log(formRef.value)
  formRef.value?.validateFields().then(res => {
    if (res) {
      emit('save', formModel)
    }
  })
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
