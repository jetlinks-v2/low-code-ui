<template>
    <j-modal visible title="配置项" width="800px" @ok="onSave" @cancel="onCancel">
        <j-form layout="vertical" ref="formRef" :model="formModel">
            <j-form-item label="数据源" name="query" :rules="[{ required: true, message: '请输入数据源地址' }]">
                <j-input v-model:value="formModel.query" placeholder="请输入数据源地址" />
            </j-form-item>
            <template v-if="type === 'Button'">
                <j-form-item label="确认事件" name="click">
                    <div>
                        <span style="font-weight: 600;">function (result) {</span>
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
            <template v-if="type === 'Modal'">
                <j-form-item label="引用模块" name="relation" :rules="[{ required: true, message: '请选择引用模块' }]">
                    <j-select v-model:value="formModel.relation">
                        <j-select-option value="primary">primary</j-select-option>
                    </j-select>
                </j-form-item>
                <j-form-item label="弹框标题" name="title" :rules="[{ required: true, message: '请输入数据源地址' }]">
                    <j-input v-model:value="formModel.title" placeholder="请输入弹框标题" />
                </j-form-item>
                <j-form-item label="弹框宽度" name="width" :rules="[{ required: true, message: '请输入弹框宽度' }]">
                    <j-input-number placeholder="请输入弹框宽度" style="width: 100%" :precision="0" addon-after="px"
                        v-model:value="formModel.width" />
                </j-form-item>
                <j-form-item label="是否需要底部内容" name="footer">
                    <j-switch v-model:checked="formModel.footer" />
                </j-form-item>
                <template v-if="formModel.footer">
                    <j-form-item label="确认按钮文字" name="okText" :rules="[{ required: true, message: '请输入确认按钮文字' }]">
                        <j-input v-model:value="formModel.okText" placeholder="请输入确认按钮文字" />
                    </j-form-item>
                    <j-form-item label="确认事件" name="ok">
                        <div>
                            <span style="font-weight: 600;">function () {</span>
                            <j-monaco-editor v-model="formModel.ok" language="javascript"
                                :registrationTypescript="registrationTypescript" style="height: 200px" />
                        </div>
                    </j-form-item>
                </template>
                <j-form-item label="取消事件" name="cancel">
                    <div>
                        <span style="font-weight: 600;">function () {</span>
                        <j-monaco-editor v-model="formModel.cancel" language="javascript"
                            :registrationTypescript="registrationTypescript" style="height: 200px" />
                    </div>
                </j-form-item>
            </template>
            <template v-if="type === 'Drawer'">
                <j-form-item label="引用模块" name="relation" :rules="[{ required: true, message: '请选择引用模块' }]">
                    <j-select v-model:value="formModel.relation">
                        <j-select-option value="primary">primary</j-select-option>
                    </j-select>
                </j-form-item>
                <j-form-item label="抽屉标题" name="title" :rules="[{ required: true, message: '请输入抽屉标题' }]">
                    <j-input v-model:value="formModel.title" placeholder="请输入抽屉标题" />
                </j-form-item>
                <!-- <j-form-item label="抽屉页脚" name="footer">
                    <j-input v-model:value="formModel.footer" placeholder="请输入数据源地址" />
                </j-form-item> -->
                <j-form-item label="抽屉宽度" name="width" :rules="[{ required: true, message: '请输入弹框宽度' }]">
                    <j-input-number placeholder="请输入弹框宽度" style="width: 100%" :precision="0" addon-after="px"
                        v-model:value="formModel.width" />
                </j-form-item>
                <j-form-item label="关闭事件" name="close">
                    <div>
                        <span style="font-weight: 600;">function (result) {</span>
                        <j-monaco-editor v-model="formModel.close" language="javascript"
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
    click: props.data.click,
    confirm: props.data.confirm,
    cancel: props.data.cancel,
    title: props.data.title,
    footer: props.data.footer,
    width: props.data.width,
    okText: props.data.okText || '确定',
    relation:props.data.relation,
    ok: props.data.ok,
    close: props.data.close
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
  