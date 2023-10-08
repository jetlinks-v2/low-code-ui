
<template>
    <div >
        <pro-search :columns="columns" target="code" @search="handleSearch" />
        <JProTable ref="tableRef" :request="queryProject" :dataSource="list" :columns="columns" :params="params"
            model="table">
            <template #startTime="record">
                {{ record.startTime ? dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
            </template>
            <template #action="record">
                <j-popconfirm title="确认签收?" @confirm="onConfirm(record)" v-if="record.state === 'unSign'">
                    <j-button type="link">签收</j-button>
                </j-popconfirm>
                <j-button type="link" v-else @click="onSave(item)">办理</j-button>
            </template>
        </JProTable>
        <Detail v-if="visible" @close="visible=false" :current="current"/>
    </div>
</template>

<script setup  name="Content">
import { onlyMessage } from '@jetlinks/utils';
import dayjs from 'dayjs';
import Detail from './Detail/index.vue'

const props = defineProps({
    activeKey: {
        type: String,
        default: 'wait'
    }
})

const params = ref({})
const tableRef = ref({});
const visible = ref(false)
const current = ref({})

const list = [
    {
        id: '1',
        state: 'sign'
    },
    {
        id: '2',
        state: 'unSign'
    }
]

const columns = [
    {
        title: '流程分类',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'select',
            componentProps: {
                placeholder: '请选择流程分类',
            },
        },
    },
    {
        title: '流程名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入项目名称',
            },
        },
    },
    {
        title: '标题',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '摘要',
        dataIndex: 'version',
        key: 'version',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '已发布', value: 'published' },
                { label: '未发布', value: 'unpublished' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '结束时间',
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        hideInTable: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: true,
    },
]

const handleSearch = (value) => {

}

const onConfirm = (item)=>{
    console.log('item',item)
    onlyMessage('签收成功')
}

const onSave = (item)=>{
    current.value = item
    visible.value = true
}

</script>

<style scoped lang='less'>

</style>