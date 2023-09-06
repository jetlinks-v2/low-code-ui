import { defineStore } from 'pinia'

export const useFormDesigner = defineStore('form-designer', () => {
    const copyData = ref<Record<string, any>[]>([])

    const setCopyData = (_data: any[]) => {
        copyData.value = _data
    }

    const getCopyData = () => {
        return copyData.value
    }

    const deleteData = () => {
        copyData.value = []
    }

    return {
        copyData,
        setCopyData,
        getCopyData,
        deleteData
    }
})
