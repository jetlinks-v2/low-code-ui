
<template>
    <j-modal :title="title" visible :maskClosable="false" width="600px" @ok="handleSave" @cancel="handleCancel"
        :confirmLoading="loading">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item label="项目标识" name="id" validateFirst :rules="[
                { required: true, message: '请输入项目标识' },
                { max: 256, message: '最多输入256个字符' },
                { pattern: regular.inputReg, message: '要求以小写字母开头，由字母+数字构成' },
                { validator: vailId, trigger: 'blur' },
            ]">
                <j-input v-model:value="modelRef.id" placeholder="标识需要唯一" :disabled="!!data.id"/>
            </j-form-item>
            <j-form-item label="项目名称" name="name" validateFirst :rules="[
                { required: true, message: '请输入项目名称' },
                { max: 32, message: '最多输入32个字符' },
                { min: 2, message: '最少输入2个字符' },
                // { pattern: regular.textReg, message: '只能为中文字符' },
            ]">
                <j-input v-model:value="modelRef.name" placeholder="限制2-32个字符" />
            </j-form-item>
            <j-form-item label="说明" name="description" :rules="[{ max: 200, message: '最多输入200个字符' }]">
                <j-textarea  v-model:value="modelRef.description" placeholder="请输入说明" show-count :maxlength="200"/>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="Save">
import { regular } from '@jetlinks/utils';
import { queryProject, addProject, editProject } from '@/api/project'
import { onlyMessage } from '@/utils/comm';
import { useRequest } from '@jetlinks/hooks'

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

// const loading = ref<boolean>(false);
const formRef = ref<any>()
const modelRef = reactive({
    id: props.data.id || '',
    name: props.data.name || '',
    description: props.data.description || ''
})

const title = computed(() => {
    if (props.type === 'add') {
        return '新增'
    } else {
        return '编辑'
    }
})

const { loading, run } = useRequest(props.data.id ? editProject : addProject, {
    immediate: false,
    onSuccess: (res) => {
        if (res.success) {
            onlyMessage('操作成功')
            emit('close')
        }
    }
})

const handleSave = async () => {
    const data = await formRef.value.validate()
    if (data) {
        run(data)
    }
}

const vailId = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await queryProject({
            "terms": [
                {
                    "type": "or",
                    "value": value,
                    "termType": "eq",
                    "column": "id"
                }
            ]
        });
        if (resp.status === 200 && resp.result.data.length!==0) {
            return Promise.reject('标识需唯一');
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

const handleCancel = () => {
    emit('close')
}

</script>

<style scoped lang='less'></style>