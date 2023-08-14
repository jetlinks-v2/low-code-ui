
<template>
    <j-modal visible :footer="null" :width="500" :closable="false" @cancel="emit('close')">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item name="name" validateFirst :rules="[
                { max: 64, message: '最多输入64个字符' },
                { pattern: regular.modalReg, message: '字母+数字+下划线组成，并以字母开头' },
            ]">
                <template #label>
                    {{ `${titleType} ${props.provider ? providerMap[props.provider] : ''}` }}
                </template>
                <j-input v-model:value="modelRef.name" placeholder="请输入" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="InputModal">

import { regular } from '@jetlinks/utils';
// import { providerList } from './index';
import { onKeyStroke } from '@vueuse/core'
import { providerMap } from '../../index'

type Emits = {
    (e: 'save', data: string): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

const props = defineProps({
    provider: {
        type: String,
        default: ''
    },
    defaultName: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'Add'
    },
})

const modelRef = reactive({
    name: props.defaultName || ''
})
const formRef = ref()

// const title = computed(() => providerList.find(item => item.value === props.provider)?.text)
const titleType = computed(() => props.type === 'Add' ? '新增' : '重命名')

onKeyStroke('Enter', async () => {
    console.log('Enter----------')
    const res = await formRef.value.validate()
    if (res && modelRef.name) {
        emit('save', modelRef.name)
    }
})

// const handleOk = async () => {
//     const res = await formRef.value.validate()
//     if (res) {
//         emit('save', modelRef.name)
//     }
// }

</script>

<style scoped lang='less'></style>