<template>
    <div>
        <div v-for="item in value" :key="item.key" class="box-item">
            <div>{{ item.name }}</div>
            <j-space>
                <j-button type="link"><AIcon type="EditOutlined" /></j-button>
                <j-button type="link" danger><AIcon type="DeleteOutlined" /></j-button>
            </j-space>
        </div>
        <j-button block @click="onAdd">新增</j-button>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Array as PropType<any[]>,
        default: () => [
            {
                key: 'view',
                name: '查看'
            }
        ]
    }
})

const emits = defineEmits(['update:value'])
const onAdd = () => {
    
}
</script>

<style lang="less" scoped>
.box-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;
}
</style>