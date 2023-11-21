import { ISchema } from "../typings";

// 基础组件
export const basic: ISchema[] = [
    {
        type: 'input',
        name: '文本框',
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
        children: [
            {
                type: 'card-item',
                children: [],
            },
        ]
    },
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
]