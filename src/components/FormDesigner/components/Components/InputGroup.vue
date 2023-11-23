<template>
    <j-input-group>
        <j-row>
            <j-col :span="8">
                <div class="componentsBox">
                    <div v-if="preComponent?.preText">{{ props.preComponent.preText }}</div>
                    <j-select style="flex: 1;"></j-select>
                </div>
            </j-col>
            <j-col :span="8">
                <j-input></j-input>
            </j-col>
            <j-col :span="8">
                <j-select  style="display: block;"></j-select>
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
            col:0,
            options:[],
            preText:''

        }
    },
    afterComponent:{
        type:Object,
        default:{

        }
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