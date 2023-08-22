import { ISchema } from "../typings";

// 基础组件
const basic: ISchema[] = [
    {
        type: 'input',
        name: '文本框',
        icon: 'SnippetsOutlined'
    },
    {
        type: 'text',
        name: '文本',
        icon: 'BellOutlined',
        componentProps: {
            value: '文本'
        },
    },
    {
        type: 'textarea',
        name: '文本域',
        icon: 'EditOutlined',
    },
    {
        type: 'input-number',
        name: '数字输入',
        icon: 'SnippetsOutlined'
    },
    {
        type: 'select-card',
        name: '选项',
        icon: 'CopyOutlined',
        componentProps: {
            options: [
                {
                    value: '1',
                    label: '选项1'
                },
                {
                    value: '2',
                    label: '选项2'
                }
            ],
            showImage: false
        },
    },
    {
        type: 'input-password',
        name: '密码框',
        icon: 'OrderedListOutlined',
    },
    {
        type: 'upload',
        name: '上传',
        icon: 'DownloadOutlined',
    },
    {
        type: 'switch',
        name: '开关',
        icon: 'BarsOutlined',
    },
    {
        type: 'form',
        name: '内嵌表单',
        icon: 'CalendarOutlined',
    },
    {
        type: 'select',
        name: '下拉框',
        icon: 'ContainerOutlined',
    },
    {
        type: 'tree-select',
        name: '树选择',
        icon: 'CopyOutlined',
    },
    {
        type: 'tree',
        name: '左侧树',
        icon: 'DownloadOutlined',
    },
    {
        type: 'date-picker',
        name: '日期选择',
        icon: 'ContactsOutlined',
    },
    {
        type: 'range-picker',
        name: '日期范围',
        icon: 'FundOutlined',
    },
    {
        type: 'time-picker',
        name: '时间选择',
        icon: 'BlockOutlined',
    },
    {
        type: 'time-range-picker',
        name: '时间范围',
        icon: 'AuditOutlined',
    }
]

const layout: ISchema[] = [
    {
        type: 'card',
        name: '卡片',
        icon: 'CreditCardOutlined',
        componentProps: {
            title: '卡片',
            extra: ''
        },
        children: [
            {
                type: 'card-item',
                children: [],
            },
        ]
    },
    {
        type: 'grid',
        name: '网格布局',
        icon: 'AppstoreOutlined',
        componentProps: {
            gutter: 0,
            justify: 'space-around',
            align: 'top'
        },
        children: [
            {
                componentProps: {
                    span: 6,
                    offset: 0,
                    pull: 0,
                    push: 0
                },
                type: 'grid-item',
                children: []
            },
            {
                componentProps: {
                    span: 6,
                    offset: 0,
                    pull: 0,
                    push: 0
                },
                type: 'grid-item',
                children: []
            },
            {
                componentProps: {
                    span: 6,
                    offset: 0,
                    pull: 0,
                    push: 0
                },
                type: 'grid-item',
                children: []
            }
        ]
    },
    {
        type: 'tabs',
        name: '选项卡',
        icon: 'ScheduleOutlined',
        children: [
            // {
            //     type: 'tabs-item',
            //     children: [],
            //     componentProps: {
            //         tab: 'Tab 1'
            //     }
            // },
            // {
            //     type: 'tabs-item',
            //     children: [],
            //     componentProps: {
            //         tab: 'Tab 2'
            //     }
            // }
        ],
        componentProps: {
            type: '',
            tabPosition: 'top',
            align: 'top',
            hidden: false
        }
    },
    {
        type: 'collapse',
        name: '折叠面板',
        icon: 'CopyOutlined',
        children: [
            // {
            //     type: 'collapse-item',
            //     children: [],
            //     componentProps: {
            //         header: 'Collapse 1'
            //     }
            // },
            // {
            //     type: 'collapse-item',
            //     children: [],
            //     componentProps: {
            //         header: 'Collapse 2'
            //     }
            // }
        ],
        componentProps: {}
    },
]
// 高级组件
const pro: ISchema[] = [
    {
        type: 'input',
        name: '产品选择',
        icon: 'UngroupOutlined',
    },
    {
        type: 'textarea',
        name: '组织选择',
        icon: 'CopyOutlined',
    },
    {
        type: 'select',
        name: '设备选择',
        icon: 'ForkOutlined',
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
        id: 'pro',
        name: '高级组件',
        children: [...pro]
    }
]