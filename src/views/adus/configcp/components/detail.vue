<!-- 查看接口能力弹窗 -->
<template>
    <j-modal :visible="true" title="接口能力" :footer="null" @ok="" @cancel="cancelM" width="800px">
        <a-table :columns="columns" :data-source="data" bordered size="small" :pagination="false">
            <!-- <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'name'">
                    <a>{{ text }}</a>
                </template>
            </template> -->
            <!-- <template #title>Header</template>
            <template #footer>Footer</template> -->
        </a-table>
    </j-modal>
</template>
<script  lang="ts" setup>

const emit = defineEmits(['cancelModal']);
const cancelM = () => {
    emit('cancelModal', false)
}
const columns = [
    {
        title: '能力',
        dataIndex: 'name',
        ellipsis: true,
    },
    {
        title: 'API',
        dataIndex: 'money',
        ellipsis: true,
    },
    {
        title: '说明',
        dataIndex: 'address',
        ellipsis: true,
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        money: '￥300,000.00',
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        money: '￥1,256,000.00',
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        money: '￥120,000.00',
        address: 'Sidney No. 1 Lake Park',
    },
];
</script>
<style lang="less" scoped></style>