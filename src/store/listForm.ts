import { defineStore } from '@jetlinks-web/stores'
import { clone, cloneDeep } from 'lodash-es'

export const useAllListDataStore = defineStore('allListData', () => {
  const listData = ref<any>(new Map())
  const listDataInfo = ref<any>({})
  const InitialValue = reactive<any>({
    listFormInfo: {
      customIcon: '',
      dynamicIcon: '',
      field2Title: '',
      field3Title: '',
      field1: '',
      field2: '',
      field3: '',
      emphasisField: '',
      specialStyle: `{
      "error": "",
      "offline": "",
      "warning": "#13c2c2"
    }`,
    },
    showType: {
      type: 'list',
      configured: ['list'],
      configurationShow: false,
      defaultForm: 'list',
    },
    pagingData: [
      { pageSize: 12 },
      { pageSize: 24 },
      { pageSize: 48 },
      { pageSize: 96 },
    ],
    listDataInfo: {},
    datasource: [],
    searchData: [],
    dataBind: {
      data: {
        function: undefined,
        command: undefined,
      },
      functionInfo: [],
    },
    configurationInfo: {
      enum: {},
      string: {},
      number: {},
      date: {},
    },
    menu: {
      pageName:'',
      main: true,
      name: '',
      icon: '',
    },
    addButton: [], //表头按钮
    actionsButton: [], //row操作按钮
  })
  /**
   * 设置信息
   * @param data
   * @param type
   */
  const setALLlistDataInfo = (type: string, data: any, id: string) => {
    const record = listData.value.get(id)

    const configurationInfo =
      type === 'enum' ||
      type === 'string' ||
      type === 'number' ||
      type === 'date'
    if (record) {
      if (configurationInfo) {
        record.configurationInfo[type] = data
      } else {
        record[type] = data
      }
    } else {
      listDataInfo.value = cloneDeep(InitialValue)
      if (configurationInfo) {
        listDataInfo.value.configurationInfo[type] = data
      } else {
        listDataInfo.value[type] = data
      }
      listData.value.set(id, listDataInfo.value)
    }
  }
  /**
   * 获取信息
   * @param type
   * @returns
   */
  const getALLlistDataInfo = (id: any) => {
    const data = listData.value.get(id)
    if (data) {
      return data
    } else {
      return cloneDeep(InitialValue)
    }
  }
  /**
   *
   * @returns 保存所有数据
   */
  const saveListDataInfo = () => {
    const data = JSON.stringify(listDataInfo.value)
    const subValue = {
      configuration: {
        type: 'list',
        code: data,
      },
    }
    return subValue
  }
  /**
   * 初始值
   */
  const getInitialDataInfo = (value: any) => {
    const data = JSON.parse(value)
    listDataInfo.value = { ...data }
  }
  return {
    listData,
    listDataInfo,
    setALLlistDataInfo,
    getALLlistDataInfo,
    saveListDataInfo,
    getInitialDataInfo,
  }
})
