import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const usePageDesigner = defineStore('page-designer', () => {
    const copyData = ref<Record<string, any>>({})

    const setCopyData = (id: string, _data: any[]) => {
        copyData.value = {
            key: id,
            list: cloneDeep(_data)
        }
    }

    const getCopyData = () => {
        return copyData.value || {}
    }

    const deleteData = () => {
        copyData.value = {}
    }

    return {
        copyData,
        setCopyData,
        getCopyData,
        deleteData
    }
})
