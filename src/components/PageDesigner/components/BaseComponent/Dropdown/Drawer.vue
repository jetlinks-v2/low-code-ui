
<template>
    <j-drawer
        visible
        :closable="false"
        :title="data?.title" 
        :width="`${data?.width}px`" 
        @close="onCancel"
    >

    <template  v-if="data?.footer" #footer>
        <div class="footer">
            <j-button style="margin-right: 20px;" @click="onCancel">取消</j-button>
            <j-button type="primary" @click="onOk">{{ data?.okText }}</j-button>
        </div>
    </template>

    <div v-if="type === providerEnum.FormPage">
            <FormView :value="_value" :data="_configuration" ref="formRef" />
        </div>
        <div v-else>
            <PageView  :data="_configuration" />
        </div>
    </j-drawer>
</template>

<script setup >
import { request as axiosRequest } from "@jetlinks-web/core/src/request";
import PageView from '../../../preview.vue'
import FormView from '@LowCode/components/FormDesigner/preview.vue'
import { providerEnum } from "@LowCode/components/ProJect";


const props = defineProps({
    data: {
        type: Object
    }
})
const emit = defineEmits(['close'])
const confirmLoading = ref(false)

const type = computed(() => props.data?.resource?.type)
const _value = ref({})
const _configuration = ref()
const formRef = ref()

const defaultParams = () => {
    try {
        return JSON.parse(props.data?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async (data) => {
    const config = props.data

    if (props.data.query) {
        const paramsData = defaultParams()
        try {
            const resp = await axiosRequest[config.methods](config.query, {
                paramsData,
                ...data
            })
            if (created.ok) {
                const handleResultFn = new Function('result', config.ok)
                handleResultFn(resp)
            } 
        } catch (e) {
            console.error(e)
        }
    }
    
}



const onCancel = () => {
    if(props.data?.cancel){
        const func = Function( props.data.cancel)
        func()
    }
    emit('close')
};

const onOk =async () => {
    const res =await formRef.value?.onSave()
    if (res) {
        confirmLoading.value = true
        await handleRequestFn(res).finally(()=>{
            confirmLoading.value = false
            emit('close')
        })
    }
};

watch(
    () => props.data?.resource?.configuration,
    (val) => {
        _configuration.value = JSON.parse(val.code)
    },
    { immediate: true }
)

</script>

<style scoped lang='less'>
.footer{
    text-align: right;

}
</style>