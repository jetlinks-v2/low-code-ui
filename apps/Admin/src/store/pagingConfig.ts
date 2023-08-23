import { defineStore } from 'pinia'

export const usePagingConfigStore = defineStore('pagingConfig', () => {
  const pagingData = ref([
    { pageSize: 12 },
    { pageSize: 24 },
    { pageSize: 48 },
    { pageSize: 96 },
  ])
  /**
   * 设置信息
   * @param data
   */
  const setPagingDataInfo = (data: any) => {
    pagingData.value = data
  }

  /**
   * 获取信息
   */
  const getPagingDataInfo = () => {
    return pagingData.value
  }

  return {
    usePagingConfigStore,
    setPagingDataInfo,
    getPagingDataInfo,
  }
})
