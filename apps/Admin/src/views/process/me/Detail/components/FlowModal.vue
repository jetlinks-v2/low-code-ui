
<template>
    <j-modal visible @cancel="emit('close')" @ok="onSave" :title="title">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <div v-if="type !== 'submit'">
                <div style="margin-bottom: 10px;" v-if="type === 'refuse'"> 驳回后将结束流程</div>
                <j-form-item name="text" label="审批意见" :rules="[
                    { required: true, message: '请填写审批意见' }
                ]">
                    <j-textarea v-model:value="modelRef.text" placeholder="请填写审批意见" :maxlength="200" showCount />
                </j-form-item>
            </div>
            <div v-else>
                <j-form-item name="user" label="您可以指定下一个节点的办理人">
                    <j-select v-model:value="modelRef.user" placeholder="请选择">
                        <j-select-option value="none">不指定</j-select-option>
                    </j-select>
                </j-form-item>
            </div>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts'>

const props = defineProps({
    type: {
        type: String,
        default: 'pass'
    },
    current: {
        type: Object,
        default: {}
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

</script>

<style scoped lang='less'></style>