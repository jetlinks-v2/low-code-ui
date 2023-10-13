
<template>
    <div>
        <div class="title"> 王刚的请假审批单</div>
        <div class="items">
            <j-scrollbar>
                <FormPreview v-for="item in formValue" :value="item.data" :data="item.configuration" ref="formRef" />
            </j-scrollbar>
        </div>
        <div class="bottom" v-if="type === 'todo'">
            <j-button danger class="btn" @click="onClick('refuse')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('reject')">驳回</j-button>
            <j-button type="primary" class="btn" @click="onClick('pass')"
                v-if="nodeType === 'APPROVAL' && btnList.includes('pass')">通过</j-button>
            <j-button type="primary" class="btn" @click="submitForm"
                v-if="nodeType === 'DEAL' && btnList.includes('submit')">提交</j-button>
            <j-button type="primary" class="btn" @click="onClick('save')">保存</j-button>
        </div>
    </div>
    <FlowModal v-if="visible" @close="visible = false" @save="onSave" :type="modalType" :required="required" :taskId="taskId"/>
</template>

<script setup>
import FlowModal from './FlowModal.vue';
import FormPreview from '@/components/FormDesigner/preview.vue'
import { cloneDeep } from 'lodash-es'
import { _claim, _save, _complete, _reject } from '@/api/process/me'
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
const formValue = ref()
const visible = ref(false)
const modalType = ref('pass')
const comment = ref()
const formRef = ref()
const submitData = ref([])
const nodeType = ref()
const nodes = ref()
// 审批意见是否必填
const required = ref(false)
// 提交是否可以选择审批人
const freeChoiceUser = ref(false)
// 审批ID
const taskId= ref()
const btnList = ref([])
const onSave = (value) => {
    comment.value = value
    switch (modelType) {
        case 'pass': () => {
            _complete(props.info.currentTaskId, {
                form: submitData.value,
                variables: comment.value
            })
        };
            break;
        case 'refuse': () => {
            _reject(props.info.currentTaskId, {
                form: submitData.value,
                variables: comment.value
            })
        };
            break;
        case 'submit': () => {
            _complete(props.info.currentTaskId, {
                form: submitData.value,
                variables: comment.value
            })
        };
            break;
    }
}

const onClick = async (value) => {
    const promise = []
    formRef.value.forEach((i, index) => {
        promise.push(i.onSave())
    })
    Promise.all(promise).then((res) => {
        res.forEach((i, index) => {
            submitData.value.push({
                formId: formValue.value[index].formId,
                data: {
                    ...formValue.value[index].data,
                    ...i
                }
            })
        })
        modalType.value = value
        if (modalType.value === 'save') {
            _save(props.info.currentTaskId, {
                form: submitData.value
            })
        } else {
            visible.value = true
        }
    })
}
const submitForm = () => {
    if (freeChoiceUser.value) {
        props.info.tasks.forEach((i)=>{
            i.nodeId === freeChoiceUser.value ? taskId.value = i.id : ''
        })
        onClick('save')
    }
    else {
        _complete(props.info.currentTaskId, {
            form: submitData.value,
        })
    }
}
// 列表接口数据nodeId 对应form表单ID处理数据
const dealForm = (nodes) => {
    if (nodes.id === props.nodeId) {
        //获取节点类型
        nodeType.value = nodes.type
        //审批意见是否必填
        required.value = nodes?.dealRequired
        //审批提交是否可以指定处理人
        freeChoiceUser.value = nodes?.freeChoiceUser
        //节点拥有哪些按钮权限
        btnList.value = nodes?.authButtons
        //详情接口nodeId
        const bindMap = new Map()
        Object.keys(nodes.props.formBinds).forEach((item) => {
            bindMap.set(item, nodes.props.formBinds[item])
        })
        //循环表单匹配对应节点表单ID
        formValue.value.filter((item) => {
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
    } else {
        nodes?.children ? dealForm(nodes.children) : ''
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
    margin-bottom: 5px;
    font-size: 20px;
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
}</style>