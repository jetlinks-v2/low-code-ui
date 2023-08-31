
<template>
    <j-modal visible :footer="null" :width="500" :closable="false" @cancel="emit('close')">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item name="title" validateFirst :rules="[
                { max: 64, message: '最多输入64个字符' },
                { pattern: regular.modalReg, message: '字母+数字+下划线组成，并以字母开头' },
                { validator: isOnlyName, trigger: 'change' }
            ]">
                <template #label>
                    {{ `${titleType} ${props.provider ? providerMap[props.provider] : ''}` }}
                </template>
                <j-input v-model:value="modelRef.title" placeholder="请输入" ref="inputRef"/>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="InputModal">

import { regular } from '@jetlinks/utils';
// import { providerList } from './index';
import { onKeyStroke } from '@vueuse/core'
import { providerMap } from '../../index'
import { useEngine } from '@/store'
import { randomString } from '@jetlinks/utils'

const engine = useEngine()

type Emits = {
    (e: 'save', data: any): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

const props = defineProps({
    provider: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: ''
    },
    type: {
        type: String,
        default: 'Add'
    },
    nameList:{
        type:Array,
        default:[]
    }
})

const modelRef = reactive({
    title: props.data.title || '',
    id:props.data.id || randomString(16),
    type:props.data.type || props.provider,
    parentId:props.data.parentId || engine.activeFile,
    children:props.data.children || []
})
const formRef = ref()
const inputRef = ref()

const titleType = computed(() => props.type === 'Add' ? '新增' : '重命名')

const isOnlyName = async (_,value)=>{
    const pass = props.nameList.find(item=>item===value)
    if(value && pass){
        return Promise.reject(`名称"{${value}}"已被占用，请重新命名`)
    }else{
        return Promise.resolve()
    }
}

onKeyStroke('Enter', async () => {
    const res = await formRef.value.validate()
    if (res && modelRef.title) {
        emit('save', {
            ...modelRef,
            name:modelRef.title
        })
    }
})

onMounted(()=>{
    inputRef.value?.focus()
})


</script>

<style scoped lang='less'></style>