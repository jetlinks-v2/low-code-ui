<template>
    <j-modal visible title="菜单图标" width="600px" @cancel="emits('update:visible', false)" @ok="confirm">
        <j-radio-group v-model:value="selected" class="radio">
            <j-radio-button v-for="typeStr in iconKeys" :value="typeStr" :key="typeStr"
                :class="{ active: selected === typeStr }">
                <AIcon :type="typeStr" />
            </j-radio-button>
        </j-radio-group>
    </j-modal>
</template>

<script setup lang="ts" >
import iconKeys from './fields';
const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    selected:string
}>();

const confirm = () => {
    emits('confirm', selected.value);
    emits('update:visible', false);
};

const selected = ref<string>(props.selected);
</script>

<style lang="less" scoped>
.radio {
    display: grid;
    grid-gap: 18px;
    grid-template-columns: repeat(6, 1fr);
    max-height: 300px;
    overflow-y: auto;

    .ant-radio-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70px;
        font-size: 32px;
        border: 2px solid #efefef;
        border-radius: 2px;
        cursor: pointer;

        &.active {
            color: #415ed1;
            border-color: #415ed1;
        }
    }
}
</style>
