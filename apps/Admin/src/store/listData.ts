import { defineStore } from 'pinia'

export const useListDataStore = defineStore('configuration', () => {
  const listDataInfo = ref<any>({})

  /**
   * 设置信息
   * @param data
   */
  const setListDataInfo = (data: any) => {
    listDataInfo.value = { ...data }
  }

  /**
   * 获取信息
   */
  const getListDataInfo = () => {
    return listDataInfo.value
  }

  return {
    listDataInfo,
    setListDataInfo,
    getListDataInfo,
  }
})
