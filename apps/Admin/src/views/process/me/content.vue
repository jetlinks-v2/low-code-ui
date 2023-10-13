
<template>
    <div>
        <pro-search :columns="columns" target="code" @search="handleSearch" />
        <JProTable ref="tableRef" :request="(e) => getMeProcessList(e, type, history)" :columns="columns" :params="params"
            model="table" :defaultParams="defaultParams">
            <template #createTime="record">
                {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
            </template>
            <template #endTime="record">{{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</template>
            <!-- <template #modifyTime="record">{{ record.modifyTime ? dayjs(record.modifyTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</template> -->
            <template #state="record">{{ record.state.text }}</template>
            <template #action="record">
                <div v-if="type === 'todo'">
                    <PermissionButton v-if="isSign(record.identityLinks)" :hasPermission="true" type="link" :popConfirm="{
                        title: `确认签收？`,
                        onConfirm: () => onConfirm(record),
                    }">
                        签收
                    </PermissionButton>
                    <PermissionButton type="link" :tooltip="{
                        title: '办理',
                    }" @click="onSave(record)">
                        办理
                    </PermissionButton>
                </div>
                <div v-else>
                    <PermissionButton type="link" :tooltip="{
                        title: '详情',
                    }" @click="onSave(record)">
                        详情
                    </PermissionButton>
                    <PermissionButton v-if="type === 'initiate'" :hasPermission="true" type="link" danger
                        :disabled="record.state.value === 'running'" :popConfirm="{
                            title: `确认删除？`,
                            onConfirm: () => onDel(record),
                        }" :tooltip="{ title: record.state.value !== 'running' ? '删除' : '不支持删除未结束的流程' }">
                        删除
                    </PermissionButton>
                </div>
            </template>
        </JProTable>
        <Detail v-if="visible" @close="visible = false" :current="current" :type="type"/>
    </div>
</template>

<script setup  name="Content">
import { onlyMessage } from '@jetlinks/utils';
import dayjs from 'dayjs';
import Detail from './Detail/index.vue'
import { getMeProcessList, _claim } from '@/api/process/me'

const props = defineProps({
    history: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    }
})

const params = ref({})
const tableRef = ref({});
const visible = ref(false)
const current = ref({})
const defaultParams = ref({
    sorts: [{ name: 'createTime', order: 'desc' }],
})


const columnsTodo = [
    {
        title: '流程分类',
        dataIndex: 'classifiedName',
        key: 'classifiedName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程分类',
            },
        },
    },
    {
        title: '流程名称',
        dataIndex: 'modelName',
        key: 'modelName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程名称',
            },
        },
    },
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        scopedSlots: true,
       
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        key: 'summary',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
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
const columnsFinished = [
    {
        title: '流程分类',
        dataIndex: 'classifiedName',
        key: 'classifiedName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程分类',
            },
        },
    },
    {
        title: '流程名称',
        dataIndex: 'modelName',
        key: 'modelName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程名称',
            },
        },
    },
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        scopedSlots: true,
       
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        key: 'summary',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '运行中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已撤销', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    // {
    //     title: '办理时间',
    //     dataIndex: 'modifyTime',
    //     key: 'modifyTime',
    //     ellipsis: true,
    //     scopedSlots: true,
    //     search: {
    //         type: 'date',
    //     },
    // },
    {
        title: '操作',
        key: 'action',
        scopedSlots: true,
    },
]
const columnsInitiate = [
    {
        title: '流程分类',
        dataIndex: 'classifiedName',
        key: 'classifiedName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程分类',
            },
        },
    },
    {
        title: '流程名称',
        dataIndex: 'modelName',
        key: 'modelName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程名称',
            },
        },
    },
    {
        title: '流水号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        hideInTable:true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流水号',
            },
        },
    },
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        scopedSlots: true,
       
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        key: 'summary',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '运行中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已撤销', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        ellipsis: true,
        scopedSlots: true,
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
const columnsCc = [
    {
        title: '流程分类',
        dataIndex: 'classifiedName',
        key: 'classifiedName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程分类',
            },
        },
    },
    {
        title: '流程名称',
        dataIndex: 'modelName',
        key: 'modelName',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流程名称',
            },
        },
    },
    {
        title: '流水号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        hideInTable:true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入流水号',
            },
        },
    },
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        scopedSlots: true,
       
    },
    {
        title: '摘要',
        dataIndex: 'summary',
        key: 'summary',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '运行中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已撤销', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        ellipsis: true,
        scopedSlots: true,
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


const columns = computed(()=>{
    if(props.type==='todo'){
        return columnsTodo
    }else if(props.type === 'finished'){
        return columnsFinished
    }else if(props.type === 'initiate'){
        return columnsInitiate
    }else{
        return columnsCc
    }
})

const handleSearch = (value) => {
    params.value = value
}

const onConfirm = async (item) => {
    console.log('item', item)
    const taskId = item.identityLinks?.find(item => item.linkType.value === 'candidate')?.taskId
    console.log('taskId', taskId)
    const res = await _claim(taskId)
    if (res.status === 200) {
        onlyMessage('签收成功')
        tableRef.value?.reload()
    }
}

const onDel = async (item) => {

}

const onSave = (item) => {
    current.value = item
    visible.value = true
}

//todo待办
const isSign = (arr) => {
    return arr?.some((item) => item.linkType.value === 'candidate')
    // const tag = arr.some((item)=>item.linkType.value==='assignee' && item.state.value === 'todo')
}


watch(
    () => props.history,
    () => {
        // console.log('history',props.history)
        tableRef.value?.reload()
    }
)



</script>

<style scoped lang='less'></style>