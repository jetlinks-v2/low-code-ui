
<template>
    <j-modal visible @cancel="emit('close')" @ok="onSave" :title="title">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <div v-if="type !== 'submit'">
                <!-- <div style="margin-bottom: 10px;" v-if="type === 'refuse'"> 驳回后将结束流程</div> -->
                <j-form-item name="text" label="审批意见" :rules="required ? [
                    { required: true, message: '请填写审批意见' }
                ] : []">
                    <j-textarea v-model:value="modelRef.text" placeholder="请填写审批意见" :maxlength="200" showCount />
                </j-form-item>
            </div>
            <div v-else>
                <j-form-item name="user" label="您可以指定下一个节点的办理人">
                    <j-select v-model:value="modelRef.user" placeholder="请选择" :options="approverOptions">
                    </j-select>
                </j-form-item>
            </div>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts'>
import { getApprover } from '@/api/process/me'
const props = defineProps({
    type: {
        type: String,
        default: 'pass'
    },
    current: {
        type: Object,
        default: {}
    },
    required: {
        type: Boolean,
        default: false
    },
    taskId: {
        type: String,
        default: ''
    }
})
type Emits = {
    (e: 'save', data: any): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

const formRef = ref()
const modelRef = reactive({
    text: undefined,
    user: 'none'
})
const approverOptions = ref<any[]>([{
    label: '不指定',
    value: undefined
}])
const title = computed(() => {
    if (props.type === 'pass') {
        return '通过'
    } else if (props.type === 'submit') {
        return '提交'
    } else {
        return '驳回'
    }
})


const onSave = async () => {
    const res = await formRef.value.validate()
    if (res) {
        emit('save', res)
        emit('close')
    }
}

onMounted(() => {
    if (props.type === 'submit') {
        getApprover(props.taskId, {
            "paging": false,
            "terms": [
                {
                    "terms": [
                        {
                            "value": "candidate",
                            "termType": "eq",
                            "column": "type"
                        }
                    ]
                }
            ]
        }).then((res) => {
            if (res.status === 200) {
                res.result.forEach((i) => {
                    approverOptions.value.push({
                        label: i.name,
                        value: i.id
                    })
                })
            }
        })
    }
})
</script>

<style scoped lang='less'></style>