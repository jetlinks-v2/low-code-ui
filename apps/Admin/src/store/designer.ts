import { ISchema } from '@/components/FormDesigner/typings'
import generatorData from '@/components/FormDesigner/utils/generatorData'
import { checkIsField, generateOptions } from '@/components/FormDesigner/utils/utils'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

// const rootConfig = {
//     isSync: true,
//     size: 'default',
//     labelPosition: 'left',
//     completeButton: {
//         text: '提交',
//         color: '',
//         backgroundColor: ''
//     }
// }


export const useFormDesignerStore = defineStore('designer', () => {
    const initData = {
        type: 'root',
        key: 'root',
        componentProps: {
            layout: 'horizontal'
        },
        children: []
    }
    const model = ref<'preview' | 'edit'>('edit') // 预览；编辑
    const formData = ref<ISchema>(initData) // 表单数据
    const fields = ref<any[]>([])
    const data = ref<any>({})
    const isShowConfig = ref<boolean>(false) // 是否展示配置
    const selected = ref<ISchema>() // 被选择数据

    // 设置数据被选中
    const setSelection = (node: any) => {
        let result: any = {}
        if (node === 'root') {
            result = initData
        } else {
            if (Array.isArray(node)) {
                result = node?.[0]
            } else {
                result = node
            }
        }
        selected.value = result
        isShowConfig.value = selected.value?.key === result?.key
    }

    const addFieldData = (node: any, isCopy = false) => {
        if (/^(radio|checkbox|select)$/.test(node.type)) {
            if (isCopy) {
                data.value[node.key] = cloneDeep(data.value[node.componentProps?.dataKey])
                node.componentProps = {
                    ...node.componentProps,
                    dataKey: node.key
                }
            } else {
                if (!data.value[node.key]) {
                    node.componentProps = {
                        ...node.componentProps,
                        dataKey: node.key
                    }
                    data.value[node.key] = {
                        type: node.type,
                        list: generateOptions(3).map((e, i) => {
                            e.label += i + 1
                            return e
                        }),
                    }
                }
            }
        }
        if (/^(uploadfile|html)$/.test(node.type)) {
            node.options.action = '' //props.fileUploadURI
        }
    }

    const addField = (node: any) => {
        if (checkIsField(node)) {
            const findIndex = fields.value.findIndex((item: any) => {
                return (node.key = item.key)
            })
            if (findIndex === -1) {
                fields.value.push(node)
            } else {
                fields.value.splice(findIndex, 1, node)
            }
        }
    }

    const setModel = (_type: 'preview' | 'edit') => {
        model.value = _type
    }

    return {
        model,
        formData,
        isShowConfig,
        selected,
        fields,
        data,
        setSelection,
        addFieldData,
        addField,
        setModel
    }
})
