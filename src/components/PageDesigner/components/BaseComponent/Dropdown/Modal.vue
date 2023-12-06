
<template>
    <j-modal 
        :visible="true" 
        :width="`${data?.width}px`" 
        :title="data?.modalTitle" 
        :maskClosable="false" 
        :okText="data?.okText"
        :footer="data?.footer ? undefined : null" 
        :confirmLoading="confirmLoading" 
        @ok="onOk"
        @cancel="onCancel"
    >
        <div v-if="type === providerEnum.FormPage">
            <FormView :value="_value" :data="_configuration" ref="formRef" />
        </div>
        <div v-else>
            <PageView  :data="_configuration" />
        </div>
    </j-modal>
</template>

<script setup >
import PageView from '../../../preview.vue'
import FormView from '@LowCode/components/FormDesigner/preview.vue'
import { providerEnum } from "@LowCode/components/ProJect";
import { request as axiosRequest } from "@jetlinks-web/core/src/request";
import { inject } from 'vue';
import {useTool} from "@LowCode/components/PageDesigner/hooks";

const props = defineProps({
    data: {
        type: Object
    }
})
const emit = defineEmits(['close'])
const confirmLoading = ref(false)
const selectKeys = inject('selectConfig').getSelectKeys()
const type = computed(() => props.data?.resource?.type)
const _value = ref({})
const _configuration = ref()
const formRef = ref()
const { paramsUtil, _global } = useTool()

const defaultParams = () => {
    try {
        return JSON.parse(props.data?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async (data) => {
    const config = props.data
    if (props.data?.query) {

        const paramsData = defaultParams()
        try {
            const resp = await axiosRequest[config.methods](config.query, {
                paramsData,
                ...data,
                ids:selectKeys
            })
            if (props.data?.ok) {
              const handleResultFn = new Function('result', 'util', 'global', config.ok)
              handleResultFn(resp, paramsUtil, _global)
            } 
        } catch (e) {
            console.error(e)
        }
    }
    
}




const onCancel = () => {
    if(props.data?.cancel){
        const func = Function( props.data?.cancel)
        func()
    }
    emit('close')
};

const onOk =async () => {
    if(type === providerEnum.FormPage){
        const res =await formRef.value?.onSave()
        if (res) {
        confirmLoading.value = true
        await handleRequestFn(res).finally(()=>{
            confirmLoading.value = false
            emit('close')
        })
    }
    }else{
        confirmLoading.value = true
        await handleRequestFn({}).finally(()=>{
            confirmLoading.value = false
            emit('close')
        })
    }
};

// console.log('p==========', props)

watch(
    () => props.data?.resource?.configuration,
    (val) => {
        _configuration.value = JSON.parse(val.code)
    },
    { immediate: true }
)

</script>

<style scoped lang='less'></style>