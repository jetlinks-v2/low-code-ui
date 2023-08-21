import { defineStore } from 'pinia'

export const useListFormStore = defineStore('listForm', () => {
  const listFormInfo = ref<any>({
    customIcon: '',
    dynamicIcon: '',
    field1: '',
    field2: '',
    field3: '',
    emphasisField: '',
    specialStyle: `{
      "error": "",
      "offline": "",
      "warning": "#13c2c2"
    }`,
  })

  /**
   * 设置信息
   * @param data
   */
  const setListFormInfo = (data: any) => {
    listFormInfo.value = { ...data }
  }

  /**
   * 获取信息
   */
  const getListFormInfo = () => {
    return listFormInfo.value
  }

  return {
    listFormInfo,
    setListFormInfo,
    getListFormInfo,
  }
})
