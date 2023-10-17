<template>
    <div class="box">
        <div class="left">
            <j-tree :tree-data="treeData" v-model:selectedKeys="selectedKeys" v-if="type !== user"></j-tree>
        </div>
        <div class="right">
            <pro-search :columns="columns" target="system-role" @search="handelSearch" />
            <JProTable model="TABLE" ref="tableRef" :defaultParams="{
                sorts: [
                    { name: 'createTime', order: 'desc' },
                    { name: 'id', order: 'desc' },
                ]
            }" :columns="columns" :params="queryParams" :request="getUserList_api" :rowSelection="{
    selectedRowKeys: _selectedRowKeys,
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
import { getUserList_api } from '@/api/process/me'
const props = defineProps({
    type: {
        type: String,
        default: 'org'
    },
    candidates: {
        type: Object,
        default: {}
    },
    user:{
        type:Object,
        default:{}
    }
})
const emit = defineEmits(['selected'])
const treeData = ref([])
const selectedKeys = ref()
const _selectedRowKeys = ref([])
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
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
const queryParams = ref({
    terms: [
    ]
});
const tableRef = ref()
const handelSearch = () => {

}
const onSelectChange = (data,state)=>{
    if(state){
        _selectedRowKeys.value = [data.id]
        emit('selected',{type:props.type,
            id:data.id,
            name:data.name})
    }else{
        _selectedRowKeys.value = []
        emit('selected',{})
    }
}
const onSelectNone = () =>{
    _selectedRowKeys.value = []
    emit('selected',{})
}
watch(()=>props.user,()=>{
    if(props.user?.id){
        _selectedRowKeys.value = [props.user.id]
    }else{
        _selectedRowKeys.value = []
    }
},{
    deep:true,
    immediate:true
})
onMounted(() => {
    console.log(props)
    if (props.type !== 'user') {
        treeData.value = cloneDeep(props.candidates?.[props.type])
        treeData.value?.map((i) => {
            return {
                title: i.name,
                key: i.id
            }
        })
    } else {
        //取角色id查询
        const ids = cloneDeep(props.candidates?.user)?.map((i) => {
            return i.id
        })
        queryParams.value = {
            terms: [{
                value: ids,
                termType: 'in',
                column: 'id'
            }]
        }

    }
})
</script>
<style lang="less" scoped></style>