
<template>
    <div>
       
        <div class="items">
            <j-scrollbar>
                <template  v-for="item in formValue">
                    <div class="title"> {{item?.formName}}</div>
                    <FormPreview v-if="!item.multiple" :value="item.data" :data="item.configuration" ref="formRef"/>
                    <div  v-else style="background-color: #fff;">
                        <QuickEditTable
                        validate
                        ref="tableRef"
                        :data="item.data"
                        :columns="item.configuration"
                        :scroll="{x: 1300, y: 500}"
                    >
                        <template v-for="(i,index) in item.configuration" #[i.dataIndex]="{record, index, valueChange}">
                            <!-- <slot :name="name" v-bind="slotData || {}" /> -->
                            <ValueItem :itemType="i.type"  v-model:modelValue="record[i.dataIndex]" @change="()=>{valueChange(record[i.dataIndex])}"></ValueItem>
                        </template>
                        </QuickEditTable>
                        <j-button @click="()=>addTableData(item)" block style="margin-top: 10px;">新增</j-button>
                    </div>
                </template>
            </j-scrollbar>
        </div>
        <div class="bottom" v-if="type === 'todo'">
            <j-button danger class="btn" @click="onClick('refuse')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('reject')" :loading="btnLoading">驳回</j-button>
            <j-button type="primary" class="btn" @click="onClick('pass')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('pass')" :loading="btnLoading">通过</j-button>
            <j-button type="primary" class="btn" @click="submitForm"
                v-if="nodeType === 'DEAL' && btnList.includes('submit')" :loading="btnLoading">提交</j-button>
            <j-button type="primary" class="btn" @click="onClick('save')" :loading="btnLoading">保存</j-button>
        </div>
    </div>
    <FlowModal v-if="visible" @close="visible = false" @save="onSave" :type="modalType" :required="required"
        :taskId="taskId" :candidates="candidates"/>
</template>

<script setup>
import FlowModal from './FlowModal.vue';
import FormPreview from '@/components/FormDesigner/preview.vue'
import { cloneDeep } from 'lodash-es'
import { _claim, _save, _complete, _reject } from '@/api/process/me'
import { onlyMessage } from '@jetlinks/utils';
import md5 from 'md5'
const props = defineProps({
    info: {
        type: Object,
        default: {}
    },
    nodeId: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['close'])
const formValue = ref()
const visible = ref(false)
const modalType = ref('pass')
const comment = ref()
const formRef = ref()
const submitData = ref([])
const nodeType = ref()
const tableRef= ref()
//提交审批taskId 
const nodes = ref()
// 审批意见是否必填
const required = ref(false)
// 提交是否可以选择审批人
const freeChoiceUser = ref(false)
// 审批ID
const taskId = ref()
//提交审批的taskId
const submitId = ref()
const btnList = ref([])
//按钮加载
const btnLoading = ref(false)
//提交可选审批人条件
const candidates = ref()
const addTableData = (item) =>{
    let obj = {}
    item.configuration.map((i)=>{
        const key = i.dataIndex
        obj[key] = undefined
    })
    item.data.push(obj)
}
const onSave = (value) => {
    // btnLoading.value = true
    switch (modalType.value) {
        case 'pass':
            comment.value = value
            _complete(props.info.currentTaskId, {
                form: submitData.value,
                variables: comment.value
            }).then((res) => {
                if (res.status === 200) {
                    onlyMessage('提交成功')
                    emit('close')
                }
            })
            break;
        case 'refuse':
            comment.value = value
            _reject(props.info.currentTaskId, {
                form: submitData.value,
                variables: comment.value
            }).then((res) => {
                if (res.status === 200) {
                    onlyMessage('提交成功')
                    emit('close')
                }
            })
            break;
        case 'submit': 
            const commands = [
            {
            commandId: "ClaimTask",
            param: {
                taskId: submitId.value,
                identity: value
            }
        }
            ]
            _complete(props.info.currentTaskId, {
                form: submitData.value,
                commands: commands
            }).then((res)=>{
                if (res.status === 200) {
                    onlyMessage('提交成功')
                    emit('close')
                }
            })
            break;
        }
}

const onClick = async (value) => {
    const promise = []
    const tablePromise = []
    modalType.value = value
    if (modalType.value === 'save') {
        btnLoading.value = true
        _save(props.info.currentTaskId, {
            form: submitData.value
        }).then((res) => {
            if (res.status === 200) {
                onlyMessage('保存成功')
                btnLoading.value = false
            }
        })
    } else {
        formRef.value.forEach((i, index) => {
            promise.push(i.onSave())
        })
        tableRef.value.forEach((i)=>{
            promise.push(i.validates())
        })
        Promise.all(promise).then((res) => {
            let data = []
            res.forEach((i, index) => {
                data.push({
                    formId: formValue.value[index].formId,
                    data: Array.isArray(i) ? i : {
                        ...formValue.value[index].data,
                        ...i
                    }
                })
            })
            submitData.value = data
            visible.value = true
        })
    }
}
const submitForm = () => {
    if (freeChoiceUser.value) {
        props.info.tasks.forEach((i) => {
            i.nodeId === freeChoiceUser.value ? taskId.value = i.id : ''
        })
        submitId.value = md5(props.info?.modelId + '|' + props?.info?.id + '|' + freeChoiceUser.value)
        onClick('submit')
    }
    else {
        _complete(props.info.currentTaskId, {
            form: submitData.value,
        })
    }
}
//根据配置项生成表格
const dealTable = () =>{
    const tableColumn = []
    formValue.value.forEach((i)=>{
        if(i.multiple){
             i?.configuration?.children.map((item)=>{
                const rules = item?.formItemProps?.required ? [{ required: true, message: `请输入${item?.formItemProps?.label}`},...item?.formItemProps?.rules] : [...item?.formItemProps?.rules]
               tableColumn.push({
                    title: item.formItemProps?.label,
                    dataIndex: item.formItemProps?.name,
                    type: item?.type,
                    form:{
                        rules:rules
                    }
                })
            })
            i.configuration = tableColumn
        }
    })
}
// 列表接口数据nodeId 对应form表单ID处理数据
const dealForm = (nodes) => {
    if (nodes.id === props.nodeId) {
        //获取节点类型
        nodeType.value = nodes.type
        //审批意见是否必填
        required.value = nodes?.props?.dealRequired
        //审批提交是否可以指定处理人
        if(nodes?.props?.freeChoiceUser && nodes?.props.freeChoiceUser === nodes?.children?.id){
            freeChoiceUser.value = nodes.props.freeChoiceUser
            candidates.value = nodes?.children?.props?.candidates
        }
        //节点拥有哪些按钮权限
        btnList.value = nodes?.props?.authButtons
        //详情接口nodeId
        const bindMap = new Map()
        Object.keys(nodes.props.formBinds).forEach((item) => {
            bindMap.set(item, nodes.props.formBinds[item])
        })
        //循环表单匹配对应节点表单ID
        formValue.value = formValue.value.filter((item) => {
            if (bindMap.has(item.formId)) {
                // 循环表单项 根据节点 配置表单项属性 过滤掉节点没有配置的表单项
                item.configuration.children = item.configuration.children.filter((i) => {
                    return bindMap.get(item.formId).some((k) => {
                        if (k.id === i.formItemProps.name) {
                            i.formItemProps.required = k.required
                            i.componentProps.disabled = !k?.accessModes?.includes('write')
                            i.componentProps.visible = k?.accessModes?.includes('read')
                            return true
                        } else {
                            return false
                        }
                    })
                })
                return true
            } else {
                return false
            }
        })
        dealTable()
    } else {
        nodes?.children ? dealForm(nodes.children) : ''
        if (nodes?.branches) {
            nodes.branches.forEach((i) => {
                dealForm(i)
            })
        }
    }
}
watch(() => props.info, () => {
    formValue.value = cloneDeep(props.info?.form)
    nodes.value = JSON.parse(props.info.modelContent)?.nodes
    if (props.type === 'todo') {
        dealForm(nodes.value)
    } else {
        formValue.value.map((i) => {
            i.configuration.children.map((item) => {
                item.componentProps.disabled = true
            })
        })
    }
})

</script>

<style scoped lang='less'>
.title {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    font-size: 20px;
    background-color: #fff;
}

.items {
    height: calc(100vh - 240px);
    background-color: #EEE;
    padding: 12px;
}

.bottom {
    margin-top: 10px;

    .btn {
        margin-right: 15px;
    }
}
</style>