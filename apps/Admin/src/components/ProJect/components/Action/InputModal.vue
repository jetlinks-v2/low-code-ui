
<template>
    <j-modal visible :footer="null" :width="500" :closable="false" @cancel="emit('close')">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item name="name" validateFirst :rules="[
                { max: 64, message: '最多输入64个字符' },
                { pattern: _modalReg, message: '字母+数字+下划线组成，并以字母开头' },
            ]">
                <template #label>
                   {{ `新增${title}` }}
                </template>
                <j-input v-model:value="modelRef.name" placeholder="请输入" @pressEnter="handleOk" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="InputModal">

import { _modalReg } from '@/utils/regular'
import { providerList } from './index'

type Emits = {
    (e: 'save', data: string): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();
const modelRef = reactive({
    name: ''
})
const formRef = ref()

const props = defineProps({
    provider: {
        type: String,
        default: ''
    }
})

const title = computed(()=>providerList.find(item=>item.value === props.provider)?.text)

const handleOk = async () => {
    const res = await formRef.value.validate()
    if (res) {
        emit('save', modelRef.name)
    }
}

</script>

<style scoped lang='less'></style>