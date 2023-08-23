import { defineStore } from 'pinia'

export const useListFormStore = defineStore('listForm', () => {
  const listFormInfo = ref<any>({
    customIcon: '',
    dynamicIcon: '',
    field2Titel: '',
    field3Titel: '',
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
  const showType = ref<any>({
    type: 'list',
    configured: ['list'],
    configurationShow: false,
    defaultForm: 'list',
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
  /**
   * 设置信息
   * @param data
   */
  const setListFormType = (data: any) => {
    showType.value = { ...data }
  }

  /**
   * 获取信息
   */
  const getListFormType = () => {
    return showType.value
  }
  return {
    listFormInfo,
    setListFormInfo,
    getListFormInfo,
    setListFormType,
    getListFormType,
  }
})
