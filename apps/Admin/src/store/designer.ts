import { ISchema } from '@/components/FormDesigner/typings'
import { defineStore } from 'pinia'

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

    const setModel = (_type: 'preview' | 'edit') => {
        model.value = _type
    }

    return {
        model,
        formData,
        isShowConfig,
        selected,
        setSelection,
        setModel
    }
})
