<!-- 增删改查/数据 -->
<template>
    <h3>正在查看{{ versionCode }}发布版本下的{{ tableDataLength }} 条数据</h3>
    <h3>
        暂无数据，请在项目发布后查看
    </h3>
    <j-pro-table ref="tableRef" model="TABLE" :columns="columns" :params="{}"></j-pro-table>
</template>

<script lang="ts" setup name="datacp" >
import { ref } from 'vue'
const tableRef = ref(null)
const versionCode = ref('V1.2.3')
const tableDataLength = ref('156')
const columns = [
    {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        // search: {
        //     type: 'string',
        //     componentProps: {
        //         placeholder: '请输入项目标识',
        //     },
        // },
    },
    {
        title: '用户ID',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        // search: {
        //     type: 'string',
        //     componentProps: {
        //         placeholder: '请输入项目名称',
        //     },
        // },
    },
    {
        title: '用户名称',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        // scopedSlots: true,
        // search: {
        //     type: 'date',
        // },
    },
    {
        title: '创建时间',
        dataIndex: 'version',
        key: 'version',
        ellipsis: true,
    },
    {
        title: '用户类型',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        // scopedSlots: true,
        // search: {
        //     type: 'select',
        //     options: [
        //         { label: '已发布', value: 'publish' },
        //         { label: '未发布', value: 'unpublished' },
        //     ],
        // },
    },
    {
        title: '手机号',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '登录密码',
        dataIndex: 'descript2ion',
        key: 'description',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '最近登录时间',
        dataIndex: 'descrip22tion',
        key: 'description',
        ellipsis: true,
        scopedSlots: true,
    }
    // {
    //     title: '操作',
    //     key: 'action',
    //     scopedSlots: true,
    // },
]



</script>

<style scoped lang="less"></style>

