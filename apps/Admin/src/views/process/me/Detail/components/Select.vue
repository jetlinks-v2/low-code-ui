<template>
    <div class="box">
        <div class="left" v-if="type !== 'user'">
            <j-input v-model:value="searchValue" :placeholder="type === 'org' ? '请输入组织名称' : '请输入角色'" class="search-input"
                allowClear @pressEnter="search" @change="search">
                <template #suffix>
                    <AIcon type="SearchOutlined" />
                </template>
            </j-input>
            <div>
                <j-scrollbar>
                    <j-tree v-if="treeData.length" :tree-data="treeData" v-model:selectedKeys="selectedKeys" v-model:expandedKeys="expandedKeys"
                        @select="treeSelect" :fieldNames="{
                            key: 'id',
                            title: 'name'
                        }"></j-tree>
                    <j-empty v-else style="margin-top: 100px;"></j-empty>
                </j-scrollbar>
            </div>

        </div>
        <div :class="{ right: type !== 'user' }">
            <pro-search :columns="columns" target="system-role" type="simple" @search="handelSearch" />
            <JProTable model="TABLE" ref="tableRef" :defaultParams="{
                sorts: [
                    { name: 'createTime', order: 'desc' },
                    { name: 'id', order: 'desc' },
                ]
            }" :columns="columns" :params="queryParams" :request="queryUser" :rowSelection="{
    selectedRowKeys: _selectedRowKeys,
    hideSelectAll: true,
    onSelect: onSelectChange,
    onSelectNone: onSelectNone
}">
                <template #status="slotProps">
                    <BadgeStatus :status="slotProps.status" :text="slotProps.status ? '正常' : '禁用'" :statusNames="{
                        1: 'success',
                        0: 'error',
                    }"></BadgeStatus>
                </template>
            </JProTable>
        </div>
    </div>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import { getUserList } from '@/api/process/me'
import { getOrg_api } from '@/api/process/model'
import { filterTreeNodes } from '@jetlinks/utils';

const props = defineProps({
    type: {
        type: String,
        default: 'org'
    },
    candidates: {
        type: Object,
        default: {}
    },
    user: {
        type: Object,
        default: {}
    }
})
const emit = defineEmits(['selected'])
const treeInitData = ref([])
const treeData = ref([])
const selectedKeys = ref()
const searchValue = ref()
const _selectedRowKeys = ref([])
const selectId = ref()
const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        key: 'status',
        scopedSlots: true,
        dataIndex: 'status',
        search: {
            type: 'select',
            options: [
                { label: '正常', value: '1' },
                { label: '禁用', value: '0' }
            ],
        },
    },
];
const queryParams = ref();
const tableRef = ref()
const userIds = ref([])
const expandedKeys = ref([])


const handlexpandedKeys = (arr,val)=>{
    arr.forEach(item=>{
        // if(item.name.includes(val)){
        //     expandedKeys.value.push(item.parentId || item.id)
        // }
        expandedKeys.value.push( item.id)
        if(item.children){
            handlexpandedKeys(item.children,val)
        }
    })
}

const search = () => {
    if (searchValue.value) {
        const arr = filterTreeNodes(cloneDeep(treeInitData.value),searchValue.value,'name')
        console.log('arr===',arr)
        handlexpandedKeys(arr,searchValue.value)
        treeData.value = arr
    } else {
        treeData.value = cloneDeep(treeInitData.value)
        expandedKeys.value = []
    }
}
const handelSearch = (search) => {
    queryParams.value = search
}
const treeSelect = (selectedKeys, e) => {
    selectId.value = selectedKeys[0]
}

const queryUser = async (params) => {
    if (selectId.value && props.type !== 'user') {
        const res = await getUserList({
            ...params,
            terms: [
                ...params.terms,
                {
                    terms: [
                        {
                            column: props.type === 'org' ? 'id$in-dimension$org' : 'id$in-dimension$role',
                            value: selectId.value,
                        },
                    ],
                    type: 'and',
                },
            ],
        })
        if (res.status === 200) {
            return {
                code: res.status,
                result: res.result,
                status: res.status,
            };
        }
    } else if (props.type === 'user') {
        const res = await getUserList({
            ...params,
            terms: [
                ...params.terms,
                {
                    terms: [
                        {
                            column: 'id',
                            termType: 'in',
                            value: userIds.value,
                        },
                    ],
                    type: 'and',
                },
            ],
        })
        if (res.status === 200) {
            return {
                code: res.status,
                result: res.result,
                status: res.status,
            };
        }
    }
    return {
        code: 200,
        result: {
            data: [],
            pageIndex: 0,
            pageSize: 0,
            total: 0,
        },
        status: 200,
    };
}
const onSelectChange = (data, state) => {
    if (state) {
        _selectedRowKeys.value = [data.id]
        emit('selected', {
            type: 'user',
            id: data.id,
            name: data.name
        })
    } else {
        _selectedRowKeys.value = []
        emit('selected', {})
    }
}
const onSelectNone = () => {
    _selectedRowKeys.value = []
    emit('selected', {})
}

const orgAll = async (orgs) => {
    const org = orgs?.map(item => item.id)
    const res = await getOrg_api({
        paging: false,
        terms: [{
            column: 'id',
            termType: 'in',
            value: org
        }]
    })
    if (res.status === 200) {
        treeInitData.value = res.result
        treeData.value = res.result
        selectedKeys.value = [res.result[0]?.id]
        selectId.value = res.result[0]?.id
    }
}

watch(() => props.user, () => {
    if (props.user?.id) {
        _selectedRowKeys.value = [props.user.id]
    } else {
        _selectedRowKeys.value = []
    }
}, {
    deep: true,
    immediate: true
})
watch(() => selectId.value, () => {
    tableRef.value?.reload()
}, {
    deep: true,
    immediate: true
})
onMounted(() => {
    console.log('props.candidates', props.candidates)
    if (props.type !== 'user') {
        if (props.type === 'org') {
            orgAll(props.candidates.org)
        } else {
            treeInitData.value = cloneDeep(props.candidates?.[props.type])
            treeData.value = cloneDeep(treeInitData.value)
        }

    } else {
        //取角色id查询
        userIds.value = cloneDeep(props.candidates?.user)?.map((i) => {
            return i.id
        })
    }
})
</script>
<style lang="less" scoped>
.box {
    position: relative;

    .left {
        width: 200px;
        position: absolute;
        border-right: 1px solid rgba(240, 240, 240);
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;

        .search-input {
            margin-bottom: 10px;
        }
    }

    .right {
        width: calc(100% - 200px);
        margin-left: 200px;
        padding: 0 10px;
    }
}
</style>