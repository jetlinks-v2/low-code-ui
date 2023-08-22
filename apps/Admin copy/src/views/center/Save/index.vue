
<template>
    <j-modal :title="title" visible :maskClosable="false" width="600px" @ok="handleSave" @cancel="handleCancel"
        :confirmLoading="loading">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item label="项目标识" name="id" :rules="[
                { required: true, message: '请输入项目标识' },
                { max: 256, message: '最多输入256个字符' },
                { pattern: _inputReg, message: '要求以小写字母开头，由字母+数字构成'},
            ]">
                <j-input v-model:value="modelRef.id" placeholder="请输入项目标识" />
            </j-form-item>
            <j-form-item label="项目名称" name="name" :rules="[
                { required: true, message: '请输入项目名称' },
                { max: 32, message: '最多输入32个字符' },
                { min: 2, message: '最少输入2个字符' },
                { pattern: _textReg, message: '只能为中文字符' },
            ]">
                <j-input v-model:value="modelRef.name" placeholder="请输入项目名称" />
            </j-form-item>
            <j-form-item label="说明" name="description" :rules="[{ max: 200, message: '最多输入200个字符' }]">
                <j-input v-model:value="modelRef.description" placeholder="请输入说明" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="Save">
import { _inputReg, _textReg } from '@/utils/regular'
import { addProject, editProject } from '@/api/project'
import { onlyMessage } from '@/utils/comm';

const emit = defineEmits(['close']);
const props = defineProps({
    type: {
        type: String,
        default: 'add'
    },
    data: {
        type: Object,
        default: {}
    }
})

const loading = ref<boolean>(false);
const formRef = ref<any>()
const modelRef = reactive({
    id: props.data.id || '',
    name: props.data.name || '',
    description: props.data.description || ''
})

const title = computed(() => {
    if (props.type === 'add') {
        return '新增项目'
    } else {
        return '编辑项目'
    }
})

const handleSave = async () => {
    const data = await formRef.value.validate()
    if (data) {
        loading.value = true
        const res =props.data.id? await editProject(data).finally(()=>{
            loading.value = false
        }): await addProject(data).finally(()=>{
            loading.value = false
        })
        
        if(res.status === 200){
            onlyMessage('操作成功')
            emit('close')
        }
    }
}

const handleCancel = () => {
    emit('close')
}

</script>

<style scoped lang='less'></style>@/api/project