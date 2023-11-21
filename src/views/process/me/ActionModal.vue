
<template>
    <j-modal visible @cancel="emit('close')" @ok="onSave" :title="title" :width="400">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <div>
                <j-form-item name="comment" label="审批意见" :rules="{ required: true, message: '请填写审批意见' }">
                    <j-textarea v-model:value="modelRef.comment" placeholder="请填写审批意见" :maxlength="200" showCount />
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
})
type Emits = {
    (e: 'save', data: any): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();
const formRef = ref()
const modelRef = reactive({
    comment: undefined,
})

const title = computed(() => {
    if (props.type === 'pass') {
        return '批量通过'
    } else {
        return '批量驳回'
    }
})


const onSave = async () => {
    if (props.type !== 'submit') {
        const res = await formRef.value.validate()
        if (res) {
            emit('save', res)
            emit('close')
        }
    }
}

</script>

<style scoped lang='less'></style>