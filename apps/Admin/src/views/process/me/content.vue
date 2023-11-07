
<template>
    <div>
        <pro-search :columns="columns" target="running" @search="handleSearch" v-if="activeKey === 'running'" />
        <pro-search :columns="columns" target="code" @search="handleSearch" v-else />
        <JProTable ref="tableRef" :request="(e) => _query(e)" :columns="columns" :params="params" model="table"
            :defaultParams="defaultParams" :rowSelection="isCheck
                ? {
                    selectedRowKeys: _selectedRowKeys,
                    onSelect: onSelectChange,
                    onSelectAll: selectAll,
                    onSelectNone: () => _selectedRowKeys = []
                }
                : false
                ">
            <template #headerTitle v-if="type === 'todo'">
                <BatchDropdown v-model:isCheck="isCheck" :actions="batchActions" @change="onCheckChange" />
            </template>
            <template #deployTime="record">
                {{ record.deployTime ? dayjs(record.deployTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
            </template>
            <template #endTime="record">{{ record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') :
                '--' }}</template>
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
                    <PermissionButton v-if="isManage(record.identityLinks)" type="link" :tooltip="{
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
                    <PermissionButton v-if="type === 'initiate' && activeKey === 'draft'" :hasPermission="true" type="link"
                        @click="onDraft(record)">
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
        <Detail v-if="visible" @close="onCancelDrawer" :current="current" :type="type" :history="history"
            :is-draft="activeKey === 'draft'" />
        <j-modal v-model:visible="visibleModel" :closable="false" :width="300" @cancel="onCancel" @ok="onCancel">
            <div class="content">
                <div class="title">共签收{{ sign.length }}个任务</div>
                <div> 签收成功：{{ sign.success }}</div>
                <div>签收失败：{{ sign.error }}</div>
            </div>
        </j-modal>
        <ActionModal v-if="actionRef.visible" :type="actionRef.visible" @save="getActionData"
            @close="actionRef.visible = false" />
    </div>
</template>

<script setup  name="Content">
import { onlyMessage } from '@jetlinks/utils';
import dayjs from 'dayjs';
import Detail from './Detail/index.vue'
import { getMeProcessList, _claim, _delete, getInitiatorList, _claimBatch, _rejectBatch, _completeBatch } from '@/api/process/me'
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import ActionModal from './ActionModal.vue';


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
    sorts: [{ name: 'deployTime', order: 'desc' }]
})
const options = ref([])
const sign = reactive({
    length: 0,
    success: 0,
    error: 0
})
const router = useRouter()
const isCheck = ref(false);
const _selectedRowKeys = ref([]);
const _selectedRow = ref([])
const actionRef = reactive({
    visible: false,
    type: undefined,
    data: undefined
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
    },
    {
        title: '发起人',
        dataIndex: 'creatorId',
        key: 'creatorId',
        ellipsis: true,
        scopedSlots: true,
        hideInTable: true,
        search: {
            type: 'select',
            termFilter: ['in', 'nin'],
            options: options,
        },
    },
    {
        title: '发起时间',
        dataIndex: 'deployTime',
        key: 'deployTime',
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
        // search: {
        //     type: 'date',
        // },
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
    },
    {
        title: '发起人',
        dataIndex: 'creatorId',
        key: 'creatorId',
        ellipsis: true,
        scopedSlots: true,
        hideInTable: true,
        search: {
            type: 'select',
            options: options,
            termFilter: ['in', 'nin']
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            termFilter: ['in', 'nin'],
            options: [
                // { label: '审办中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已驳回', value: 'rejected' },
                { label: '已关闭', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'deployTime',
        key: 'deployTime',
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
            termFilter: ['in', 'nin'],
            options: [
                // { label: '审办中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已驳回', value: 'rejected' },
                { label: '已关闭', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'deployTime',
        key: 'deployTime',
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
    },
    {
        title: '发起人',
        dataIndex: 'creatorId',
        key: 'creatorId',
        ellipsis: true,
        scopedSlots: true,
        hideInTable: true,
        search: {
            type: 'select',
            termFilter: ['in', 'nin'],
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
            termFilter: ['in', 'nin'],
            options: [
                // { label: '审办中', value: 'running ' },
                { label: '已完成', value: 'completed' },
                { label: '已驳回', value: 'rejected' },
                { label: '已关闭', value: 'repealed' },
            ],
        },
    },
    {
        title: '发起时间',
        dataIndex: 'deployTime',
        key: 'deployTime',
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
        return props.activeKey === "running" ? columnsFinished.filter(item => item.dataIndex !== 'state') : columnsFinished
    } else if (props.type === 'initiate') {
        return props.activeKey === 'draft' ? columnDraft :
            props.activeKey === "running" ? columnsInitiate.filter(item => item.dataIndex !== 'state') : columnsInitiate

    } else {
        return props.activeKey === "running" ? columnsCc.filter(item => item.dataIndex !== 'state') : columnsCc
    }
})

const batchActions = [
    {
        key: 'sign',
        text: '批量签收',
        permission: true,
        // icon: 'ExportOutlined',
        selected: {
            popConfirm: {
                title: '确认批量签收?',
                onConfirm: () => onAction('sign'),
            },
        },
    },
    {
        key: 'reject',
        text: '批量驳回',
        permission: true,
        // icon: 'ImportOutlined',
        selected: {
            popConfirm: {
                title: '确认批量驳回?',
                onConfirm: () => onAction('reject'),
            },
        },
    },
    {
        key: 'pass',
        text: '批量通过',
        // danger: true,
        // icon: 'StopOutlined',
        permission: true,
        selected: {
            popConfirm: {
                title: '确认批量通过?',
                onConfirm: () => onAction('pass'),
            },
        },
    },
];

const onCheckChange = () => {
    _selectedRowKeys.value = [];
    _selectedRow.value = []
}

const onSelectChange = (item, state) => {
    const arr = new Set(_selectedRowKeys.value);
    const arrs = new Set(_selectedRow.value);
    // console.log(item, state);
    if (state) {
        arr.add(item.id);
        arrs.add(item)
    } else {
        arr.delete(item.id);
        arrs.delete(item)
    }
    _selectedRowKeys.value = [...arr.values()];
    _selectedRow.value = [...arrs.values()];
};


const selectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
        changeRows.forEach((i) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id)
                _selectedRow.value.push(i)
            }
        })
    } else {
        console.log('----', changeRows)
        const arr = changeRows.map((item) => item.id)

        const _ids = [];
        const _items = []
        _selectedRowKeys.value.map((i) => {
            if (!arr.includes(i)) {
                _ids.push(i)
                const item = changeRows.find(it => it.id === i)
                _items.push(item)
            }
        })

        _selectedRowKeys.value = _ids
        _selectedRow.value = _items
    }
}

const handleSearch = (value) => {
    params.value = value
}

const onAction = async (key) => {
    console.log('key---', key)
    if (_selectedRowKeys.value.length === 0) {
        onlyMessage('请勾选至少一项流程', 'warning')
        return;
    }
    if (key !== 'sign') {
        actionRef.visible = true
        actionRef.type = key
    } else {
        // const res =await _claimBatch()
        const taskIds = []
        _selectedRow.value.forEach(item => {
            const task = item.identityLinks?.filter(it => it.linkType.value === 'candidate')?.map(i => i.taskId)
            if (task && task.length !== 0) {
                taskIds.push(task)
            }
        })
        console.log('sign-----', taskIds.flat(), _selectedRow.value)
        const res = await _claimBatch({
            taskIds: taskIds.flat()
        })
        if (res.status === 200) {
            // onlyMessage('操作成功')
            _selectedRowKeys.value = [];
            // tableRef.value?.reload()
            visibleModel.value = true
            sign.length = res.result.length
            sign.success = res.result.filter(item => item.success)?.length
            sign.error = res.result.filter(item => !item.success)?.length

        }
    }

}

const getActionData = async (value) => {
    if (value) {
        const taskIds = []
        _selectedRow.value.forEach(item => {
            const task = item.identityLinks?.filter(it => it.linkType.value === 'assignee' && it.state.value === 'todo')?.map(i => i.taskId)
            if (task && task.length !== 0) {
                taskIds.push(task)
            }
        })
        const param = {
            taskIds: taskIds.flat(),
            variables: {
                comment: value
            }
        }
        console.log('---------', param)
        const res = actionRef.type === 'pass' ? await _completeBatch(param) : await _rejectBatch(param)
        if (res.status === 200) {
            onlyMessage('操作成功')
            _selectedRowKeys.value = [];
            tableRef.value?.reload()
        }
    }
}

const onConfirm = async (item) => {
    // console.log('item', item)
    const task = item.identityLinks?.filter(item => item.linkType.value === 'candidate').map(item=>item.taskId)
    sign.length = task.length
    const res = await _claimBatch({
        taskIds: task
    })
    if (res.status === 200) {
        visibleModel.value = true
        sign.length = res.result.length
        sign.success = res.result.filter(item => item.success)?.length
        sign.error = res.result.filter(item => !item.success)?.length
    }


    // task?.forEach(async (el) => {
    //     const res = await _claim(el.taskId)
    //     if (res.status === 200) {
    //         // onlyMessage('签收成功')
    //         sign.success = sign.success + 1
    //     } else {
    //         sign.error = sign.error + 1
    //     }
    // })
    // visibleModel.value = true
    // tableRef.value?.reload()
}
const onCancel = () => {
    visibleModel.value = false
    tableRef.value?.reload()
    sign.length = 0
    sign.error = 0
    sign.success = 0
}

const onCancelDrawer = () => {
    visible.value = false
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

const onDraft = (record) => {
    router.push({
        path: '/flow-engine/initiate/initiate-detail',
        query: {
            id: record.id,
            isDraft: true,
        }
    })
}

//todo待办
const isSign = (arr) => {
    return arr?.some((item) => item.linkType.value === 'candidate')
    // const tag = arr.some((item)=>item.linkType.value==='assignee' && item.state.value === 'todo')
}

//是否办理
const isManage = (arr) => {
    return arr?.some(item => item.linkType.value === 'assignee' && item.state.value === 'todo')

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

const getUser = async (type) => {
    const res = await getInitiatorList(type, props.history, {
        paging: false
    })
    if (res.status === 200) {
        options.value = res.result.map(item => ({
            label: item.creatorName,
            value: item.creatorId,
        }))
    }
}


watch(
    () => props.type,
    () => {
        getUser(props.type)
    }
)

watch(
    () => props.activeKey,
    () => {
        getUser(props.type)
        tableRef?.value?.reload()
    }
)



</script>

<style scoped lang='less'>
.content {
    text-align: center;
    padding: 24px 0;

    .title {
        font-size: 18px;
        margin-bottom: 20px;
    }
}
</style>