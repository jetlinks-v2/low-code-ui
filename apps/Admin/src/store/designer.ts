import { defineStore } from 'pinia'

const rootConfig = {
    isSync: true,
    size: 'default',
    labelPosition: 'left',
    completeButton: {
        text: '提交',
        color: '',
        backgroundColor: ''
    }
}

export const useFormDesignerStore = defineStore('designer', () => {
    const model = ref<'preview' | 'edit'>('edit') // 预览；编辑
    const formData = ref<any[]>([]) // 表单数据
    const isShowConfig = ref<boolean>(false) // 是否展示配置
    const selected = ref({}) // 被选择数据

    // 设置数据被选中
    const setSelection = (node: any) => {
        let result: any = {}
        if (node === 'root') {
            result = rootConfig
        } else {
            if (node.type === 'inline') {
                result = node.columns[0]
            } else {
                result = node
            }
        }
        isShowConfig.value = selected.value === result
        selected.value = result
    }

    // 点击组件加入到右边
    const addFormItem = (element: any) => {
        console.log(element)
    }

    // 

    return {
        model,
        formData,
        isShowConfig,
        selected,
        setSelection,
        addFormItem
    }
})
