
<template>
    <j-modal visible :width="300" @cancel="emit('close')" :footer="null">
        <div class="item">
            <div class="item-text">{{ data.children?.length ? '删除该菜单会删除其下方的子菜单，确认删除？' : '确认删除？' }} </div>
            <div class="item-btn">
                <j-button @click="emit('close')" style="margin-right: 10px;">取消</j-button>
                <j-button type="primary" @click="emit('ok', props.data)">确定</j-button>
            </div>
        </div>
    </j-modal>
</template>
    
<script setup lang='ts' name="DelModal">

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
})
type Emits = {
    (e: 'ok', data: any): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

</script>
    
<style scoped lang='less'>
.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 120px;
    justify-content: center;

    .item-text {
        height: 30px;
        margin-top: 20px;
    }

    .item-btn {
        margin-top: 20px;
    }
}
</style>