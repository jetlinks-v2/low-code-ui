<template>
    <j-modal visible title="事件处理" width="800px" @ok="onSave" @cancel="onCancel">
        <j-form layout="vertical" ref="formRef" :model="formModel">
            <j-form-item label="数据源" name="query" >
                <j-input v-model:value="formModel.query" placeholder="请输入数据源地址">
                    <template #addonBefore>
                        <j-select v-model:value="formModel.methods" style="width: 100px;" :options="[
                            { label: 'GET', value: 'get' },
                            { label: 'POST', value: 'post' },
                            { label: 'PUT', value: 'put' },
                            { label: 'PATCH', value: 'patch' },
                            { label: 'DELETE', value: 'remove' },
                        ]" />
                    </template>
                </j-input>
            </j-form-item>
            <j-form-item label="默认参数" name="defaultParams">
                <j-monaco-editor v-model="formModel.defaultParams" language="json" style="height: 160px" />
            </j-form-item>
            <template v-if="type === 'Button'">
                <j-form-item label="点击事件" name="click">
                    <div>
                        <span style="font-weight: 600;">function (context, route, router, result) </span>
                        <j-monaco-editor v-model="formModel.click" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
            <template v-if="type === 'Popconfirm'">
                <j-form-item label="确认提示" name="title" :rules="[{ required: true, message: '请输入确认提示' }]">
                    <j-input v-model:value="formModel.title" placeholder="请输入确认提示" />
                </j-form-item>
                <j-form-item label="确认事件" name="confirm">
                    <div>
                        <span style="font-weight: 600;">function (result) {</span>
                        <j-monaco-editor v-model="formModel.confirm" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
            <template v-if="type === 'Modal' || type === 'Drawer'">
                <j-form-item label="确认事件" name="ok">
                    <div>
                        <span style="font-weight: 600;">function (result) {</span>
                        <div>//调用数据源的回调</div>
                        <j-monaco-editor v-model="formModel.ok" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
                <j-form-item label="取消事件" name="cancel">
                    <div>
                        <span style="font-weight: 600;">function () {</span>
                        <j-monaco-editor v-model="formModel.cancel" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
        </j-form>
    </j-modal>
</template>
  
<script setup name="ConfigModal">

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: 'Button'
    }
})

const emit = defineEmits(['save', 'cancel'])




const formModel = reactive({
    query: props.data.query,
    defaultParams: props.data.defaultParams,
    methods: props.data.methods || 'post',
    click: props.data.click,
    confirm: props.data.confirm,
    cancel: props.data.cancel,
    title: props.data.title,
    ok: props.data.ok,
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
  
<style scoped></style>
  