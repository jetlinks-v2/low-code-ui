
<template>
    <j-modal :visible="true" :width="`${buttonConfig?.created?.width}px`" :title="buttonConfig?.created?.title"
        :maskClosable="false" :okText="buttonConfig?.created?.okText"
        :footer="buttonConfig?.created?.footer ? undefined : null" :confirmLoading="confirmLoading" @ok="onOk"
        @cancel="onCancel">
        <div v-if="type === providerEnum.FormPage">
            <FormView :value="_value" :data="_configuration" ref="formRef" />
        </div>
        <div v-else>
            <PageView :data="_configuration" />
        </div>
    </j-modal>
</template>

<script setup >
import PageView from '../../../preview.vue'
import FormView from '@LowCode/components/FormDesigner/preview.vue'
import { providerEnum } from "@LowCode/components/ProJect";
import { request as axiosRequest } from "@jetlinks-web/core/src/request";
import {usePageProvider} from "@LowCode/components/PageDesigner/hooks";
import { useRouter } from 'vue-router';

const props = defineProps({
    buttonConfig: {
        type: Object
    }
})
const emit = defineEmits(['close'])
const confirmLoading = ref(false)
const pageProvider = usePageProvider()
const route = useRoute()
const router = useRouter()

const type = computed(() => props.buttonConfig?.created?.resource?.type)
const _value = ref({})
const _configuration = ref()
const formRef = ref()

const defaultParams = () => {
    try {
        return JSON.parse(props.buttonConfig?.created?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async (data) => {
    const config = props.buttonConfig?.config

    if (props.buttonConfig?.config.query) {
        const paramsData = defaultParams()
        try {
            const resp = await axiosRequest[config.methods](config.query, {
                paramsData,
                ...data
            })
            if (config.ok) {
              const handleResultFn = new Function('context',  'route','router', 'result', config.ok)
              handleResultFn(pageProvider.context, route, router, resp)
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        if (config.ok) {
            const handleResultFn = new Function(config.ok)
            handleResultFn()
        }
    }
}

const onCancel = () => {
    if (props.buttonConfig?.config?.cancel) {
        const func = Function(props.buttonConfig?.config.cancel)
        func()
    }
    emit('close')
};

const onOk = async () => {
    if (type.value === providerEnum.FormPage) {
        const res = await formRef.value?.onSave()
        if (res) {
            confirmLoading.value = true
            await handleRequestFn(res).finally(() => {
                confirmLoading.value = false
                emit('close')
            })
        }
    } else {
        await handleRequestFn().finally(() => {
            confirmLoading.value = false
            emit('close')
        })
    }
};

watch(
    () => props.buttonConfig?.created?.resource?.configuration,
    (val) => {
        _configuration.value = JSON.parse(val.code)
    },
    { immediate: true }
)

</script>

<style scoped lang='less'></style>