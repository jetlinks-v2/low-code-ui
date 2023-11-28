import { ISchema } from "../typings";

export const initData = {
    type: "root",
    key: "root",
    componentProps: {
        mountedCode: '',
    },
    children: [],
}

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
            type: 'default',
            buttonConfig: {
                type:'Button'
            },
        },
    },
    {
        type: 'dropdown',
        name: '下拉菜单',
        componentProps: {
            text: '下拉菜单',
            shape: 'default',
            size: 'middle',
            type: 'primary',
            menu: []
        },
    },
    {
        type: 'tag',
        name: '标签',
        componentProps: {
            text: '标签'
        },
    },
    {
        type: 'form',
        name: '表单',
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
                            span:1,
                            labelWidth:200
                        },
                    },
                ],
                componentProps: {
                    title:'标题1',
                    bordered: true,
                    column:3
                },
            },
        ]
    },
    {
        type: 'timeline',
        name: '时间轴',
        componentProps: {},
        children: [
            {
                type: 'timeline-item',
                children: [],
                componentProps: {
                    label:'时间轴1'
                },
            },
            {
                type: 'timeline-item',
                children: [],
                componentProps: {
                    label:'时间轴2'
                },
            },
            {
                type: 'timeline-item',
                children: [],
                componentProps: {
                    label:'时间轴3'
                },
            },
        ]
    },
    {
        type: 'inline',
        name: '内联',
        children: [],
        componentProps: {
            align: 'baseline',
            direction: 'horizontal',
            size: 8
        },
        formItemProps: {
            isLayout: false
        },
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
                    search: {
                        type: 'string',
                    },
                }
            ]
        },
    },
    {
        type: 'proTable',
        name: '表格',
        componentProps: {
            request: {
                query: '',
                handleResult: '',
                defaultParams: ''
            },
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
            ],
            dataSource: [
                { name: 'John Brown', age: 14, address: 'New York No. 1 Lake Park'},
            ],
            paginationSetting: {
                open: true,
                pagination: {
                    pageSizeOptions: [12, 24, 48, 96]
                }
            },
            actionVisible: true,
            responder: {
                dependencies: undefined,
                responder: undefined
            }
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
