
<template>
    <j-modal 
        :visible="true" 
        :width="`${buttonConfig?.config?.width || 400}px`" 
        :title="buttonConfig?.config?.title" 
        :maskClosable="false" 
        :okText="buttonConfig?.config?.okText"
        :footer="buttonConfig?.config?.footer ? undefined : null" 
        :confirmLoading="confirmLoading" 
        @ok="onOk"
        @cancel="onCancel"
    >
        <div v-if="type === providerEnum.FormPage">
            <FormView :value="_value" :data="_configuration" ref="formRef" />
        </div>
        <div v-else>
            PageView
        </div>
    </j-modal>
</template>

<script setup >
import PageView from '../../../preview.vue'
import FormView from '@LowCode/components/FormDesigner/preview.vue'
import { providerEnum } from "@LowCode/components/ProJect";
import { request as axiosRequest } from "@jetlinks-web/core/src/request";


const props = defineProps({
    buttonConfig: {
        type: Object
    }
})
const emit = defineEmits(['close'])
const confirmLoading = ref(false)

const type = computed(() => props.buttonConfig?.config?.resource?.type)
const _value = ref({})
const _configuration = ref()
const formRef = ref()


const defaultParams = () => {
    try {
        return JSON.parse(props.buttonConfig?.config?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async () => {
    const config = props.buttonConfig?.config

    if (props.buttonConfig?.config.query) {
        const paramsData = defaultParams()
        try {
            const resp = await axiosRequest[config.methods](config.query, {
                paramsData,
            })
            if (config.ok) {
                const handleResultFn = new Function('result', config.ok)
                handleResultFn(resp)
            } 
        } catch (e) {
            console.error(e)
        }
    }
}




const onCancel = () => {
    // eval(props.buttonConfig?.config.cancel)
    emit('close')
};

const onOk =async () => {
    const res =await formRef.value?.onSave()
    if (res) {
        // confirmLoading.value = true
        // console.log(res)
       await handleRequestFn(res)
        // _value.value = res
        // eval(props.buttonConfig?.config.ok)
    }
};

console.log('p==========', props)

watch(
    () => props.buttonConfig?.config?.resource?.configuration,
    (val) => {
        _configuration.value = JSON.parse(val.code)
    },
    { immediate: true }
)

</script>

<style scoped lang='less'></style>