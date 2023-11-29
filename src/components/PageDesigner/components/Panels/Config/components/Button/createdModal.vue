<template>
    <j-modal visible title="created配置" width="800px" @ok="onSave" @cancel="onCancel">
        <j-form layout="vertical" ref="formRef" :model="formModel">
            <j-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入数据源地址' }]">
                <j-input v-model:value="formModel.title" placeholder="请输入弹框标题" />
            </j-form-item>
            <j-form-item label="宽度" name="width" :rules="[{ required: true, message: '请输入宽度' }]">
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
            </template>
            <j-form-item label="引用模块" :name="['resource', 'id']" :rules="[{ required: true, message: '请选用模块' }]">
                <j-tree-select :tree-data="options" :fieldNames="{ label: 'title', value: 'id' }" @select="handleSelect"
                    placeholder='请选择' v-model:value="formModel.resource.id">
                </j-tree-select>
            </j-form-item>
            <!-- <j-form-item label="数据源" name="query">
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
            <j-form-item label="数据处理" name="cancel">
                <div>
                    <span style="font-weight: 600;">function (result) {</span>
                    <j-monaco-editor v-model="formModel.cancel" language="javascript"
                        :registrationTypescript="registrationTypescript" style="height: 200px" />
                </div>
            </j-form-item> -->
        </j-form>
    </j-modal>
</template>
  
<script setup name="CreatedModal">
import { useProduct } from "@LowCode/store";
import { storeToRefs } from "pinia";
import { providerEnum } from "@LowCode/components/ProJect";
import { cloneDeep, pick } from "lodash-es";

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

const productStore = useProduct();
const { data, info } = storeToRefs(productStore)
const options = ref([])



const formModel = reactive({
    query: props.data.query,
    defaultParams: props.data.defaultParams,
    methods: props.data.methods || 'post',
    title: props.data.title,
    footer: props.data.footer,
    width: props.data.width || 500,
    okText: props.data.okText || '确定',
    handleData: props.data.handleData,
    resource: props.data.resource || {},
})


const formRef = ref()

const onSave = () => {
    console.log(formRef.value)
    formRef.value?.validateFields().then(res => {
        if (res) {
            emit('save', formModel)
        }
    })
}

const filterOptions = (arr) => {
    const params = [providerEnum.Module, providerEnum.FormPage, providerEnum.PageDesign]
    return arr.filter(item => {
        if (item.children && item.children.length) {
            item.children = filterOptions(item.children)
            item.disabled = true
        }
        if (params.includes(item.type)) {
            return true
        }
        return false
    })
}

const handleSelect = (_, node) => {
    // console.log('node====', node, info.value.id)
    formModel.resource = {
        ...pick(node, ['id', 'parentId', 'type']),
        projectId: info.value.id,
        configuration: node.configuration
    }
    console.log(formModel.resource.parentId, formModel.resource.projectId)
    formModel.resource.parentId = `${formModel.resource.projectId == formModel.resource.parentId
        ? formModel.resource.parentId
        : formModel.resource.projectId + '.' + formModel.resource.parentId
        }`
}

const onCancel = () => {
    emit('cancel')
}

onMounted(() => {
    options.value = filterOptions(cloneDeep(data.value[0]?.children))
    // console.log(options.value)
})

</script>
  
<style scoped></style>
  