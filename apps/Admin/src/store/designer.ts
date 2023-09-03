import { defineStore } from 'pinia'

export const useFormDesigner = defineStore('form-designer', () => {
    const copyData = ref<Record<string, any> | undefined>(undefined)

    const setCopyData = (_data: Record<string, any>) => {
        copyData.value = _data
    }

    const getCopyData = () => {
        return copyData.value
    }

    const deleteData = () => {
        copyData.value = undefined
    }

    return {
        copyData,
        setCopyData,
        getCopyData,
        deleteData
    }
})
