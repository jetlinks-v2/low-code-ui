
<template>
    <j-modal  
        :visible="true" 
        :width="`${buttonConfig?.config?.width || 400}px`" 
        :title="buttonConfig?.config?.title"
        :maskClosable="false" 
        :okText="buttonConfig?.config?.okText"
        :footer="buttonConfig?.config?.footer ? undefined : null" 
        :confirmLoading="confirmLoading" @ok="onOk"
        @cancel="onCancel"
        >
        <div>{{ buttonConfig?.config?.relation }}</div>
    </j-modal>
</template>

<script setup lang="ts">


const props = defineProps({
    buttonConfig: {
        type: Object
    }
})
const emit = defineEmits(['close'])
const confirmLoading = ref(false)

//配置项代码框函数
const setConfirmLoading = (val: boolean) => {
    confirmLoading.value = val;
};
const setVisible= (val: boolean) => {
    if(!val){
        emit('close')
    }
};

const onCancel = () => {
    eval(props.buttonConfig?.config.cancel)
};

const onOk = () => {
    eval(props.buttonConfig?.config.ok)
};

</script>

<style scoped lang='less'></style>