import { ISchema } from "../typings";

// 基础组件
export const basic: ISchema[] = [
    {
        type: 'input',
        name: '文本框',
        componentProps:{
            prefix:{
                type:'',
                text:''
            },
            suffix:{
                type:'',
                text:''
            }
        }
    },
    // {
    //     type:'input-group',
    //     name:'输入框组合',
    //     componentProps:{
    //         preComponent:{
    //             type:'select',
    //             show:false,
    //             col:8,
    //             options:[],
    //             preText:''
    //         },
    //         afterComponent:{
    //             type:'select',
    //             show:false,
    //             col:8,
    //             options:[],
    //             preText:''
    //         }
    //     }
    // },
    {
        type: 'text',
        name: '文本',
        componentProps: {
            value: '文本',
        },
    },
    {
        type: 'textarea',
        name: '文本域',
    },
    {
        type: 'input-number',
        name: '数字输入',
    },
    {
        type: 'number-step',
        name: '数字输入Pro',
    },
    {
        type: 'select-card',
        name: '选项',
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
    },
    {
        type: 'upload',
        name: '上传',
        componentProps:{
            isButton:false,
            width:100
        }
    },
    {
        type: 'switch',
        name: '开关',
    },
    {
        type: 'checkbox',
        name: '多选框',
    },
    {
        type: 'radio',
        name: '单选框',
        componentProps: {
            size: 'default',
            optionType: 'default',
            buttonStyle: 'outline'
        }
    },
    {
        type: 'form',
        name: '内嵌表单',
    },
    {
        type: 'select',
        name: '下拉框',
    },
    {
        type: 'tree-select',
        name: '树选择',
    },
    // {
    //     type: 'tree',
    //     name: '左侧树',
    // },
    {
        type: 'date-picker',
        name: '日期选择',
    },
    // {
    //     type: 'range-picker',
    //     name: '日期范围',
    // },
    {
        type: 'time-picker',
        name: '时间选择',
    },
    // {
    //     type: 'time-range-picker',
    //     name: '时间范围',
    // },
    {
        type: 'editor',
        name: '富文本',
        componentProps: {
            height: 200,
            placeholder: '请输入'
        },
    },
    {
        type: 'table',
        name: '表格',
        componentProps: {
            align: 'left'
        },
        children: []
    },
]

export const layout: ISchema[] = [
    {
        type: 'card',
        name: '卡片',
        componentProps: {
            title: 'Title',
            extra: ''
        },
        formItemProps: {
            isLayout: false
        },
        children: [
            {
                type: 'card-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
        ]
    },
    {
        type: 'grid',
        name: '网格布局',
        componentProps: {
            inlineMax: 10,
            rowSpan: 5,
            colSpan: 10
        },
        formItemProps: {
            isLayout: false
        },
        children: [
            {
                componentProps: {
                    span: 1,
                },
                type: 'grid-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
            {
                componentProps: {
                    span: 1,
                },
                type: 'grid-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
            {
                componentProps: {
                    span: 1,
                },
                type: 'grid-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
            {
                componentProps: {
                    span: 1,
                },
                type: 'grid-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
        ]
    },
    {
        type: 'tabs',
        name: '选项卡',
        children: [],
        formItemProps: {
            isLayout: false,
            required: true
        },
        componentProps: {
            type: 'line',
            tabPosition: 'top',
            align: 'top',
            hidden: false
        }
    },
    {
        type: 'collapse',
        name: '折叠面板',
        icon: 'CopyOutlined',
        children: [],
        formItemProps: {
            isLayout: false,
            required: true
        },
        componentProps: {}
    },
    {
        type: 'space',
        name: '弹性间距',
        children: [],
        componentProps: {
            align: 'start',
            direction: 'horizontal',
            size: 8
        },
        formItemProps: {
            isLayout: false
        },
    },
    {
        type: 'title',
        name: '标题',
        componentProps: {
            title: 'Title',
            icon:''
        },
        formItemProps: {
            isLayout: false,
        },
        children: [
            {
                type: 'title-item',
                children: [],
                formItemProps: {
                    isLayout: false
                },
            },
        ]
    },
    {
        type: 'inline',
        name: '内联',
        children: [],
        componentProps: {
            gap: 24,
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        formItemProps: {
            isLayout: false
        },
    },
]
// 高级组件
export const pro: ISchema[] = [
    {
        type: 'org',
        name: '组织选择',
    },
    {
        type: 'user',
        name: '用户选择',
    },
    {
        type: 'role',
        name: '角色选择',
    },
    { // 需求未定
        type: 'geo',
        name: '地区',
    },
]

const iot: ISchema[] = [
    {
        type: 'product',
        name: '产品选择',
    },
    {
        type: 'device',
        name: '设备选择',
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
    }, {
        id: 'iot',
        name: 'iot组件',
        children: [...iot]
    }
]