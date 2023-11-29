
<template>
    <div>
        <j-form-item label="按钮类型" :name="['componentProps', 'buttonConfig', 'type']" :validateFirst="true">
            <j-select @change="onDataChange" v-model:value="target.componentProps.buttonConfig.type">
                <j-select-option value="Button">默认按钮</j-select-option>
                <j-select-option value="Popconfirm">确认框</j-select-option>
                <j-select-option value="Modal">弹框</j-select-option>
                <j-select-option value="Drawer">抽屉</j-select-option>
            </j-select>
        </j-form-item>
        <j-form-item v-if="isCreated()" label="created" :name="['componentProps', 'buttonConfig', 'created']" :validateFirst="true" >
            <Created v-model:value="target.componentProps.buttonConfig.created" @change="onDataChange" :type="target.componentProps.buttonConfig.type"/>
        </j-form-item>
        <j-form-item label="before" :name="['componentProps', 'buttonConfig', 'config']" :validateFirst="true">
            <Config v-model:value="target.componentProps.buttonConfig.config" @change="onDataChange" :type="target.componentProps.buttonConfig.type"/>
        </j-form-item>
    </div>
</template>

<script setup lang='ts'>
import { useTarget } from "../../../../../hooks";
import Config from './config.vue'
import Created from './created.vue'

const { target } = useTarget();

const emits = defineEmits(["refresh"]);

const onDataChange = () => {
    emits("refresh", target.value);
};
const isCreated = ()=>{
    const arr = ['Modal','Drawer']
    return arr.includes(target.value.componentProps.buttonConfig.type) 
}

</script>

<style scoped lang='less'></style>