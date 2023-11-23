import { ISchema } from "../typings";

// 基础组件
export const basic: ISchema[] = [
    {
        type: 'text',
        name: '文本',
        componentProps: {
            value: '文本'
        },
    },
    {
        type: 'button',
        name: '按钮',
        componentProps: {
            text: '按钮',
            shape: 'default',
            size: 'middle',
            type: 'default'
        },
    },
    {
        type: 'tag',
        name: '标签',
        componentProps: {
            text: '标签'
        },
    },
]

export const layout: ISchema[] = [
    {
        type: 'steps',
        name: '步骤条',
        componentProps: {},
        children: [
            {
                type: 'steps-item',
                children: [],
                componentProps: {
                    title:'标题1'
                },
            },
            {
                type: 'steps-item',
                children: [],
                componentProps: {
                    title:'标题2'
                },
            },
            {
                type: 'steps-item',
                children: [],
                componentProps: {
                    title:'标题3'
                },
            },
        ]
    },
    {
        type: 'info',
        name: '信息列表',
        componentProps: {

        },
        children: [
            {
                type: 'info-item',
                children: [
                    {
                        type: 'info-item-item',
                        children: [],
                        componentProps: {
                            label:'标题1',
                            value: '123',
                            span:1
                        },
                    },
                ],
                componentProps: {
                    title:'标题1',
                    bordered: true,
                    column:2
                },
            },
            {
                type: 'info-item',
                children: [
                    {
                        type: 'info-item-item',
                        children: [],
                        componentProps: {
                            label:'标题2',
                            value: '哈哈哈哈哈哈',
                            span:1
                        },
                    },
                ],
                componentProps: {
                    title:'标题2',
                    column:3,
                    bordered:false
                },
            },
        ]
    },
]

export const _function: ISchema[] = [
    {
        type: 'search',
        name: '搜索框',
        componentProps: {
            columns: [
                {
                    title: '搜索项1',
                    dataIndex: 'id1',
                    key: 'id1',
                    search: {
                        type: 'string',
                        defaultTermType: 'eq',
                    },
                },
                {
                    title: '搜索项2',
                    dataIndex: 'id2',
                    key: 'id2',
                    search: {
                        type: 'string',
                        defaultTermType: 'eq',
                    },
                },
                {
                    title: '搜索项3',
                    dataIndex: 'id3',
                    key: 'id3',
                    search: {
                        type: 'string',
                        defaultTermType: 'eq',
                    },
                },
            ]
        },
    },
    {
        type: 'proTable',
        name: '表格',
        componentProps: {
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                    render: (slotProps) => {
                        console.log(slotProps)
                        return slotProps['action']
                    }
                },
            ],
            dataSource: [
                { name: 'John Brown', age: 14, address: 'New York No. 1 Lake Park'},
                { name: 'Jim Green', age: 32, address: 'London No. 1 Lake Park'},
                { name: 'Joe Black', age: 45, address: 'Sidney No. 1 Lake Park'},
            ]
        }
    }
]

export const filedData = [
    {
        id: 'basic',
        name: '基础组件',
        children: [...basic]
    },
    {
        id: 'layout',
        name: '布局组件',
        children: [...layout]
    },
    {
        id: '_function',
        name: '功能组件',
        children: [..._function]
    },
]
