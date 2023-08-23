import { defineStore } from 'pinia'

export const useListDataStore = defineStore('listData', () => {
  const listDataInfo = ref<any>({})
  const datasource = ref<any>([])
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
  const setDatasource = (data: any) => {
    datasource.value = data
  }
  const getDatasource = () => {
    return datasource.value
  }
  return {
    listDataInfo,
    setListDataInfo,
    getListDataInfo,
    setDatasource,
    getDatasource,
  }
})
