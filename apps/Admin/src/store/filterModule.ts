import { defineStore } from 'pinia'

export const useFilterModuleStore = defineStore('filterModule', () => {
  const configurationInfo = ref<any>({
    enum: {},
    string: {},
    number: {},
    date: {},
  })
  const datasource = ref<any>([])
/**
 * 设置信息
 * @param data 
 * @param type 
 */
  const setConfigurationInfo = (data: any, type: string) => {
    configurationInfo.value[type] = { ...data }
  }

/**
 * 获取信息
 * @param type 
 * @returns 
 */
  const getConfigurationInfo = (type: string) => {
    return configurationInfo.value[type]
  }
/**
 * 设置数据
 * @param data 
 */
  const setData = (data: any) => {
    datasource.value = data
  }
/**
 * 获取数据
 * @returns 
 */
  const getData = () => {
    return datasource.value
  }

  return {
    configurationInfo,
    setConfigurationInfo,
    getConfigurationInfo,
    setData,
    getData
  }
})
