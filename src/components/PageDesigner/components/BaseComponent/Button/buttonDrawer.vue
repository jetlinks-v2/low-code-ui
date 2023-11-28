
<template>
    <j-drawer
        visible
        :closable="false"
        :title="buttonConfig?.config?.title"
        :width="`${buttonConfig?.config?.width || 378}px`" 
        @close="onClose"
    >
    {{ buttonConfig?.config?.relation }}
    </j-drawer>
</template>

<script setup lang="ts">


const props = defineProps({
    buttonConfig: {
        type: Object
    }
})
const emit = defineEmits(['close'])
//配置项代码框函数

const setVisible= (val: boolean) => {
    if(!val){
        emit('close')
    }
};

const onClose = () => {
    eval(props.buttonConfig?.config.close)
};


</script>

<style scoped lang='less'></style>