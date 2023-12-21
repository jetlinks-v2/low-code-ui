
<template>
    <div>
        <div class="items">
            <j-scrollbar>
                <div class="header">
                    <j-ellipsis style="max-width: 300px;text-align: center;">
                        {{ info.name }}
                    </j-ellipsis>
                </div>
                <template v-for="(item, index) in formValue">
                    <div class="title">
                        <img :src="getImage(`/flow-designer/preview-form.png`)" style="height: 16px" />
                        {{ item?.formName }}
                    </div>
                    <FormPreview v-if="!item.multiple" :value="item.data" :data="item.configuration" ref="formRef"
                        :disabled="disable" @state-change="(data) => getFormData(data, index)" />
                    <div v-else style="background-color: #fff;">
                        <QuickEditTable validate ref="tableRef" style="height: 700px" :data="item.data" :columns="item.configuration"
                            :scroll="{ x: 1300, y: 700 }">
                            <template v-for="(i, index) in item.configuration"
                                #[i.dataIndex]="{ record, index, valueChange }">
                                <!-- <ValueItem :itemType="i.type" v-model:modelValue="record[i.dataIndex]"
                                    @change="() => { valueChange(record[i.dataIndex]) }" :disabled="i?.disabled">
                                </ValueItem> -->
                                <FormItem :itemType="i.type" v-model:modelValue="record[i.dataIndex]"
                                    @change="() => { valueChange(record[i.dataIndex]) }" :disabled="i?.disabled"
                                    :component-props="i.componentProps"></FormItem>
                            </template>
                        </QuickEditTable>
                        <j-button @click="() => addTableData(item)" block style="margin-top: 10px;"
                            v-if="type == 'todo'">新增</j-button>
                    </div>
                </template>
            </j-scrollbar>
        </div>
        <div class="bottom" v-if="type === 'todo'">
            <j-button danger class="btn" @click="onClick('refuse')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('reject')" :loading="btnLoading">驳回</j-button>
            <j-button type="primary" class="btn" @click="onClick('pass')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('pass')" :loading="btnLoading">通过</j-button>
            <j-button type="primary" class="btn" @click="onClick('submit')"
                v-if="nodeType === 'ROOT' && btnList.includes('submit') || nodeType === 'DEAL' && btnList.includes('submit')"
                :loading="btnLoading">提交</j-button>
            <j-button type="primary" class="btn" @click="onClick('save')" :loading="btnLoading">保存</j-button>
        </div>
    </div>
    <FlowModal v-if="visible" @close="visible = false" @save="onSave" :type="modalType" :required="required"
        :taskId="taskId" :candidates="candidates" :defaultComment="defaultComment" />
</template>

<script setup>
import FlowModal from './FlowModal.vue';
import FormPreview from '@LowCode/components/FormDesigner/preview.vue'
import { cloneDeep, isObject } from 'lodash-es'
import { _claim, _save, _complete, _reject } from '@LowCode/api/process/me'
import { onlyMessage } from '@jetlinks-web/utils';
import FormItem from './FormItem.vue'
import md5 from 'md5'
import { getImage } from '@jetlinks-web/utils'
import { handleSingleData } from './index'
import { handleFormToTable } from '../../../model/Detail/FlowDesign/components/TableFormPreviewUtil'
import {QuickEditTable} from '@LowCode/components/index'

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
const defaultComment = ref('')
const formRef = ref()
const submitData = ref([])
const nodeType = ref()
const tableRef = ref()
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
//存放表单暂存数据
const formData = ref([])
//需要转换数据的组件类型
const tableType = ["device", "product", "role", "user", "org"]
//表格可转换的组件类型
// const convertType = ['tree-select','textarea','date-picker','time-picker','input-number','input-password','product','device','user','role', 'org','switch','input','select','select-card', 'upload']
const addTableData = (item) => {
    let obj = {}
    item.configuration.map((i) => {
        const key = i.dataIndex
        obj[key] = undefined
    })
    item.data.push(obj)
}
const getFormData = (data, index) => {
    formData.value[index] = data
}
const disable = computed(() => props.type !== 'todo')

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
            _complete(props.info.currentTaskId, value ? {
                form: submitData.value,
                commands: commands
            } : { form: submitData.value }).then((res) => {
                if (res.status === 200) {
                    onlyMessage('提交成功')
                    emit('close')
                }
            })
            break;
    }
}
//处理可编辑表格数据
const dealTableData = (value) => {
    // console.log(value,'value')
    const keysMap = new Map()
    value.configuration.map((item) => {
        if (tableType.includes(item.type)) {
            keysMap.set(item.dataIndex, item.componentProps?.keys)
        }
    })
    value.data = value.data.map((item) => {
        let obj = cloneDeep(item)
        Object.keys(item).forEach((i) => {
            if (keysMap.has(i)) {
                dealIotModuleData(item[i], keysMap.get(i))
                if (!Array.isArray(item[i])) {
                    item = {
                        ...item,
                        ...item[i]
                    }
                    delete item[i]
                }
                obj = item
            }
        })
        return obj
    })
}
//按照配置处理高级组件的数据
const dealIotModuleData = (data, keys) => {
    if (Array.isArray(data)) {
        // data.map((itemData) => {
        //     Object.keys(itemData).map(i => {
        //         keys.map((item) => {
        //             if (item.key === i) {
        //                 itemData[item.config.source] = itemData[i]
        //                 if (item.config.source !== i) {
        //                     delete itemData[i]
        //                 }
        //             }
        //         })
        //     })
        // })
    } else {
        Object.keys(data).map(i => {
            keys.forEach((item) => {
                if (item.key === i) {
                    data[item.config.source] = data[i]
                    if (item.config.source !== i) {
                        delete data[i]
                    }
                }
            })
        })
    }
}

//处理接受的可编辑表格数据
const onClick = async (value) => {
    const promise = []
    const memorizer = []
    modalType.value = value
    if (modalType.value === 'save') {
        let data = []
        const fromValueCopy = cloneDeep(formValue.value)
        fromValueCopy.forEach((i, index) => {
            if (i?.multiple) {
                dealTableData(i)
            }
            data.push({
                formId: i.formId,
                formKey: i.formKey,
                data: Array.isArray(i.data) ? i.data : formData.value[index]
            })
        })
        submitData.value = data
        console.log(submitData.value)
        btnLoading.value = true
        _save(props.info.currentTaskId, {
            form: submitData.value
        }).then((res) => {
            if (res.status === 200) {
                onlyMessage('保存成功')
                btnLoading.value = false
                emit('close')
            }
        })
    } else {
        formValue.value.forEach(i => {
            if (!i?.multiple) {
                const obj = {
                    formId: i.formId,
                    formKey: i.formKey
                }
                memorizer.push(obj)
            }
        })
        formValue.value.forEach(i => {
            if (i.multiple) {
                const obj = {
                    formId: i.formId,
                    formKey: i.formKey
                }
                memorizer.push(obj)
            }
        })
        formRef.value?.forEach((i) => {
            promise.push(i.onSave())
        })
        tableRef.value?.forEach((i) => {
            promise.push(i.validates())
        })
        Promise.all(promise).then((res) => {
            let data = []
            res.forEach((i, index) => {
                data.push({
                    // formId: formValue.value[index].formId,
                    // formKey: formValue.value[index].formKey,
                    formId: memorizer[index].formId,
                    formKey: memorizer[index].formKey,
                    data: Array.isArray(i) ? i : {
                        ...formValue.value[index].data,
                        ...i
                    }
                })
            })
            submitData.value = data
            if (modalType.value !== 'submit' || freeChoiceUser.value) {
                visible.value = true
            }
            if (modalType.value === 'submit') {
                submitForm()
            }
        })
    }
}
const submitForm = async () => {
    if (freeChoiceUser.value) {
        props.info.tasks.forEach((i) => {
            i.nodeId === freeChoiceUser.value ? taskId.value = i.id : ''
        })
        submitId.value = md5(props.info?.modelId + '|' + props?.info?.id + '|' + freeChoiceUser.value)
    }
    else {
        // console.log('=============',submitData.value)
        const res = await _complete(props.info.currentTaskId, {
            form: submitData.value,
        })
        if (res.status === 200) {
            onlyMessage('操作成功')
            emit('close')
        }
    }
}
//根据配置项生成表格
const dealTable = (disabled) => {
    formValue.value.forEach((i) => {
        if (i.multiple) {
            // i?.configuration?.children.map((item) => {
            // let rules
            // if (item?.formItemProps?.rules) {
            //     rules = item?.formItemProps?.required ? [{ required: true, message: `请输入${item?.formItemProps?.label}` }, ...item?.formItemProps?.rules] : [...item?.formItemProps?.rules]
            // } else {
            //     rules = item?.formItemProps?.required ? [{ required: true, message: `请输入${item?.formItemProps?.label}` }] : []
            // }
            // tableColumn.push({
            //     title: item.formItemProps?.label,
            //     dataIndex: item.formItemProps?.name,
            //     type: item?.type,
            //     width: 200,
            //     disabled: disabled ? true : item.componentProps.disabled,
            //     form: {
            //         rules: rules
            //     },
            //     componentProps: item.componentProps,
            // })
            // })
            i.configuration = handleFormToTable(i.configuration.children)
            i.configuration.forEach(item => {
                if (item.formItemProps.rules.length === 0) {
                    item.form.rules = item.formItemProps.required ? [{ required: true, message: `请输入${item?.formItemProps?.label}` }] : []
                } else {
                    item.form.rules = item.formItemProps.required ?
                    [
                        { required: true, message: `请输入${item?.formItemProps?.label}` },
                        ...item?.formItemProps?.rules
                    ] : item.formItemProps?.rules
                }
            })
            // console.log(tableColumn,'___')
            //处理单选数据回显
            i.data = handleSingleData(i)
            // console.log(i.data,'value')
        }
    })
}

const handleLayout = (arr, disabled) => {
    return arr.map(item => {
        item.componentProps.disabled = disabled
        if (item.children && item.children.length !== 0) {
            item.children = handleLayout(item.children, disabled)
        }
        return item
    })
}

//根据读写权限递归处理组件的disabled
const handleDisabled = (arr, accessModes) => {
    const Modes = new Map()
    accessModes?.forEach(item => {
        Modes.set(item.ownerBy || item.id, item.accessModes)
    })
    return arr.map(item => {
        const disabled = !Modes.get(item.formItemProps?.name)?.includes('write')
        if (Modes.has(item.formItemProps?.name)) {
            if (!item.formItemProps.isLayout) {
                item.componentProps.disabled = disabled
            }
        }
        if (item.children && item.children.length !== 0) {
            item.children = item.formItemProps?.isLayout ? handleLayout(item.children, disabled) : handleDisabled(item.children, accessModes)
        }
        return item
    })
}

//处理数据来源是枚举的情况
const handleObject = (form) => {

    const findComponent = (key, arr) => {
        return arr.find(item => {
            if (key === item.key) {
                return true
            }
            if (item.children && item.children.length !== 0) {
                findComponent(key, item.children)
            }
        })
    }

    for (const key in form.data) {
        if (isObject(form.data[key])) {
            const comment = findComponent(key, form.configuration.children)
            if (comment && comment?.componentProps.source?.type === 'dic') {
                form.data[key] = form.data[key].value
            }
        }
    }
}

// 列表接口数据nodeId 对应form表单ID处理数据
const dealForm = (nodes) => {
    console.log('nodes---', nodes, props.nodeId)
    if (nodes.id === props.nodeId) {
        //默认审批意见
        defaultComment.value = nodes?.props.others?.defaultComment
        //获取节点类型
        nodeType.value = nodes.type
        //审批意见是否必填
        required.value = nodes?.props?.dealRequired
        //审批提交是否可以指定处理人
        if (nodes?.props?.freeChoiceUser && nodes?.props.freeChoiceUser === nodes?.children?.id) {
            freeChoiceUser.value = nodes.props.freeChoiceUser
            candidates.value = nodes?.children?.props?.candidates
        }
        //节点拥有哪些按钮权限
        btnList.value = nodes?.props?.authButtons
        //详情接口nodeId
        const bindMap = new Map()
        console.log('md5-----------', nodes.props?.formBinds)
        Object.keys(nodes.props?.formBinds).forEach((item) => {
            //formid + formVersion
            const id = md5(item + '|' + props.info.others?.formVersion[item])
            bindMap.set(id, nodes.props.formBinds[item])
        })
        formValue.value = formValue.value.map(item => {
            handleObject(item)
            if (bindMap.has(item.formId)) {
                item.configuration.children = handleDisabled(item.configuration.children, bindMap.get(item.formId))
            }
            return item
        })
        console.log('formValue.value', formValue.value)
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

//
watch(() => props.info, () => {
    formValue.value = cloneDeep(props.info?.form)
    props?.info?.form?.forEach((i) => {
        if (!Array.isArray(i?.data)) {
            formData.value.push(i?.data)
        }
    })
    nodes.value = JSON.parse(props.info.modelContent)?.nodes
    if (props.type === 'todo') {
        dealForm(nodes.value)
    } else {
        formValue.value?.map((i) => {
            handleObject(i)
            if (i.multiple) {
                dealTable(true)
            } else {
                i.configuration.children?.map((item) => {
                    item.componentProps.disabled = true
                })
            }

        })
    }
    console.log('formValue.value', formValue.value)
})
</script>

<style scoped lang='less'>
.title {
    width: 100%;
    // text-align: center;
    margin-top: 10px;
    padding: 10px 12px;
    font-size: 16px;
    background-color: #fff;
}

.items {
    height: calc(100vh - 240px);
    background-color: #EEE;
    padding: 12px;

    .header {
        // background-color: #FFF;
        font-size: 18px;
        display: flex;
        justify-content: center;
    }
}

.bottom {
    margin-top: 10px;

    .btn {
        margin-right: 15px;
    }
}

:deep(.ant-modal-header) {
    border-bottom: 1px solid #ffffff;
}
</style>
