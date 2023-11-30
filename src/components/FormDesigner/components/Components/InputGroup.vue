<template>
    <j-input-group>
        <j-row :gutter="16">
            <j-col :span="preComponent.col" v-if="preComponent.show">
                <div class="componentsBox">
                    <div v-if="preComponent?.preText">{{ props.preComponent.preText }}</div>
                    <j-select style="flex: 1;"></j-select>
                </div>
            </j-col>
            <j-col :span="24-preComponent.show*8 - afterComponent.show*8">
                <j-input :placeholder="placeholder"></j-input>
            </j-col>
            <j-col :span="afterComponent.col" v-if="afterComponent.show">
                <div class="componentsBox">
                    <div v-if="afterComponent?.afterText">{{ props.afterComponent.afterText }}</div>
                    <j-select style="flex: 1;"></j-select>
                </div>
            </j-col>
        </j-row>
    </j-input-group>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    value: {
        type: Object,
        default: {
            inputValue:'',
            preValue:'',
            afterValue:''
        }
    },
    preComponent:{
        type:Object,
        default:{
            type:'',
            show:false,
            col:8,
            options:[],
            preText:''

        }
    },
    afterComponent:{
        type:Object,
        default:{
            type:'',
            show:false,
            col:8,
            options:[],
            afterText:''
        }
    },
    placeholder:{
        type:String
    }
})
const _value = ref()
watch(() => props.value, (val) => {
    _value.value = cloneDeep(val)
}, {
    deep: true,
    immediate: true
})

</script>
<style lang="less" scoped>
.componentsBox{
    display: flex;
    align-items: center;
}

</style>