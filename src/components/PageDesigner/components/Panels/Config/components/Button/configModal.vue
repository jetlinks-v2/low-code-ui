<template>
    <j-modal visible title="事件处理" width="800px" @ok="onSave" @cancel="onCancel">
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
                    <DataSourceList v-model:value="formModel.query" />
                </div>
            </j-form-item>
            <j-form-item v-if="formModel.queryParams && formModel.queryParams?.length !== 0" label="路由参数" name="queryParams">
                <Params v-model:queryParams="formModel.queryParams" />
            </j-form-item>
            <j-form-item label="默认参数" name="defaultParams">
                <ProMonaco v-model="formModel.defaultParams" language="json" style="height: 160px" :tipCode="tipCode_1" />
            </j-form-item>
            <template v-if="type === 'Button'">
                <j-form-item label="点击事件" name="click">
                    <div>
                        <span style="font-weight: 600;">function (result, util, global) </span>
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
                        <span style="font-weight: 600;">function (result, util, global)</span>
                        <j-monaco-editor v-model="formModel.confirm" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
            <template v-if="type === 'Modal' || type === 'Drawer'">
                <j-form-item label="确认事件" name="ok">
                    <div>
                        <span style="font-weight: 600;">function (result, util, global)</span>
                        <div>//调用数据源的回调</div>
                        <j-monaco-editor v-model="formModel.ok" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
                <j-form-item label="取消事件" name="cancel">
                    <div>
                        <span style="font-weight: 600;">function (util, global)</span>
                        <j-monaco-editor v-model="formModel.cancel" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
        </j-form>
    </j-modal>
</template>
  
<script setup name="ConfigModal">
import DataSourceList from '../DataSource/dataSourceList.vue'
import Params from '../DataSource/params.vue'
import { ProMonaco } from '../ProMonaco'

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


const tipCode_1 = `{"sorts": [{ "name": "createTime", "order": "desc" }], "terms": [] }`

const formModel = reactive({
    query: props.data.query,
    defaultParams: props.data.defaultParams,
    queryParams: props.data.queryParams,
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
.query {
    display: flex;
}
</style>
  