
<template>
     <j-modal visible    @cancel="emit('close')" @ok="onSave" :title="title">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <div style="margin-bottom: 10px;"> 驳回后将结束流程</div>
            <j-form-item name="text" label="审批意见"  :rules="[
                { required: true, message: '请填写审批意见' }
            ]">
                <j-textarea  v-model:value="modelRef.text" placeholder="请填写审批意见" :maxlength="200" showCount/>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts'>

const props = defineProps({
    type:{
        type:String,
        default:'pass'
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
    text:''
})

const title = computed(()=>props.type==='pass'?'通过':"驳回")


const onSave =async ()=>{
    const res = await formRef.value.validate()
    if(res){
        emit('save',res)
        emit('close')
    }
}

</script>

<style scoped lang='less'>

</style>