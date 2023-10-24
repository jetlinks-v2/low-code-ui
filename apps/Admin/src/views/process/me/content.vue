
<template>
    <div>
        <pro-search :columns="columns" target="code" @search="handleSearch" />
        <JProTable ref="tableRef" :request="(e) => _query(e)" :columns="columns" :params="params" model="table"
            :defaultParams="defaultParams">
            <template #createTime="record">
                {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
            </template>
            <template #endTime="record">{{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'
            }}</template>
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
                    <PermissionButton type="link" v-if="activeKey !== 'draft'" :tooltip="{
                        title: '详情',
                    }" @click="onSave(record)">
                        详情
                    </PermissionButton>
                    <PermissionButton v-if="type === 'initiate' && activeKey === 'draft'" :hasPermission="true" type="link" @click="onDraft(record)">
                        编辑
                    </PermissionButton>
                    <PermissionButton v-if="type === 'initiate' && activeKey === 'draft'" :hasPermission="true" type="link"
                        danger :popConfirm="{
                            title: `确认删除？`,
                            onConfirm: () => onDel(record),
                        }" :tooltip="{ title: '删除' }">
                        删除
                    </PermissionButton>
                </div>
            </template>
        </JProTable>
        <Detail v-if="visible" @close="onCancel" :current="current" :type="type" :history="history" />
        <j-modal v-model:visible="visibleModel" :closable="false" :width="300" @cancel="onCancel" @ok="onCancel">
            <div class="content">
                <div class="title">共签收{{ sign.length }}个任务</div>
                <div> 签收成功：{{ sign.success }}</div>
                <div>签收失败：{{ sign.error }}</div>
            </div>
        </j-modal>
    </div>
</template>

<script setup  name="Content">
import { onlyMessage } from '@jetlinks/utils';
import dayjs from 'dayjs';
import Detail from './Detail/index.vue'
import { getMeProcessList, _claim, _delete ,getInitiatorList} from '@/api/process/me'

const props = defineProps({
    history: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    activeKey: {
        type: String,
        default: 'running'
    }
})

const params = ref({})
const tableRef = ref({});
const visible = ref(false)
const visibleModel = ref(false)
const current = ref({})
const defaultParams = ref({
    sorts: [{ name: 'createTime', order: 'desc' }]
})
const options = ref([])
const sign = reactive({
    length:0,
    success:0,
    error:0
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
            options: options,
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
            options: options,
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
                { label: '已驳回', value: 'rejected' },
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
        hideInTable: true,
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
                { label: '已驳回', value: 'rejected' },
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
        hideInTable: true,
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
            options: options,
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
                { label: '已驳回', value: 'rejected' },
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

const columnDraft = [
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
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入标题',
            },
        },

    },
    {
        title: '摘要',
        dataIndex: 'summary',
        key: 'summary',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入摘要',
            },
        },
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: true,
    },
]

const columns = computed(() => {
    if (props.type === 'todo') {
        return columnsTodo
    } else if (props.type === 'finished') {
        return columnsFinished
    } else if (props.type === 'initiate') {
        return props.activeKey === 'draft' ? columnDraft : columnsInitiate
    } else {
        return columnsCc
    }
})

const handleSearch = (value) => {
    params.value = value
}

const onConfirm = (item) => {
    // console.log('item', item)
    const task = item.identityLinks?.filter(item => item.linkType.value === 'candidate')
    sign.length = task.length
  
    
    task?.forEach(async (el) => {
        const res = await _claim(el.taskId)
        if (res.status === 200) {
            // onlyMessage('签收成功')
            sign.success = sign.success + 1
        }else{
            sign.error = sign.error + 1
        }
    })
    visibleModel.value = true
    // tableRef.value?.reload()
}
const onCancel = ()=>{
    visibleModel.value = false
    tableRef.value?.reload()
}

const onDel = async (item) => {
    const res = await _delete(item.id)
    if (res.status === 200) {
        onlyMessage('删除成功')
        tableRef.value?.reload()
    }
}

const onSave = (item) => {
    current.value = item
    visible.value = true
}

const onDraft = (record)=>{
    console.log('record--',record)
}

//todo待办
const isSign = (arr) => {
    return arr?.some((item) => item.linkType.value === 'candidate')
    // const tag = arr.some((item)=>item.linkType.value==='assignee' && item.state.value === 'todo')
}

const _query = (e) => {
    const item = {
        ...e,
        terms: [
            ...e.terms,
            {
                "value": 'ready',
                "termType": props.activeKey === 'draft' ? "eq" : 'not',
                "column": "state"
            }
        ]
    }
    return getMeProcessList(item, props.type, props.history)
}

const getUser = async () => {
    const res = await getInitiatorList({})
    if (res.status === 200) {
       
        options.value = res.result.map(item=>({
            label:item.creatorName,
            value: item.creatorId,
        }))
    }
}

onMounted(() => {
    getUser()
})

watch(
    () => props.activeKey,
    () => {
        tableRef?.value?.reload()
    }
)



</script>

<style scoped lang='less'>
.content{
    text-align: center;
    padding: 24px 0;
    .title{
        font-size: 18px;
        margin-bottom: 20px;
    }
}
</style>