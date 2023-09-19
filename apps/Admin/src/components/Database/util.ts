export const TYPE_PROVIDE = Symbol('crud_java_type')

export const SETTING_FORM_MODEL = Symbol('setting_form_model')
export const SETTING_FORM_REF = Symbol('setting_form_ref')

export const CRUD_COLUMNS = Symbol('crud_columns')
export const WARP_REF = Symbol('warp_ref')

export const DataActions = [
  {
    label: '导入',
    value: 'canImport'
  },
  {
    label: '导出',
    value: 'canExport'
  },
]


export const TypeList = [
  {
    value: 'int',
    label: 'int(整数型)',
  },
  {
    value: 'long',
    label: 'long(长整数型)',
  },
  {
    value: 'float',
    label: 'float(单精度浮点型)',
  },
  {
    value: 'double',
    label: 'double(双精度浮点数)',
  },
  {
    value: 'string',
    label: 'text(字符串)',
  },
  {
    value: 'boolean',
    label: 'boolean(布尔型)',
  },
  {
    value: 'date',
    label: 'date(时间型)',
  },
  {
    value: 'enum',
    label: 'enum(枚举)',
  },
  {
    value: 'array',
    label: 'array(数组)',
  },
  {
    value: 'object',
    label: 'object(结构体)',
  },
]

export const AdvancedRelationColumns = [
  {
    dataIndex: 'relationType',
    title: '关系标识',
    width: 250,
    form: {
      rules: [{
        asyncValidator: (_, value) => {
          if (!value) {
            return Promise.reject('请输入关系标识')
          }
          if(value.length > 64) {
            return Promise.reject('最多可输入64位字符')
          }
          return Promise.resolve()
        }
      }]
    }
  },
  {
    dataIndex: 'relationTypeName',
    title: '关系名称',
    width: 250,
    form: {
      rules: [{
        asyncValidator: (_, value) => {
          if (!value) {
            return Promise.reject('请输入关系名称')
          }
          return Promise.resolve()
        }
      }]
    }
  },
]

export const AdvancedApiColumns = [
  {
    dataIndex: 'ability',
    title: '能力',
    width: 100
  },
  {
    dataIndex: 'api',
    title: 'API'
  },
  {
    dataIndex: 'instruction',
    title: '指令',
    width: 100
  },
  {
    dataIndex: 'description',
    title: '说明',
    width: 120
  },
]

export const proAll = (array: Array<() => Promise<any>>) => {
  return new Promise((resolve, reject) => {
    const length = array.length
    const error: any[] = []
    const success: any[] = []
    let count = 0

    const jump = () => {
      if (count >= length) {
        error.length ? reject(error) : resolve(success)
      }
    }

    for (let i=0;i<length;i++) {
      array[i]().then(r => {
        success.push(r)
        count++
        jump()
      }, (e) => {
        error.push(e)
        count++
        jump()
      })
    }
  })
}

type ErrorField = {
  name: string[]
  errors: string[]
}

export const formErrorFieldsToObj = (errorFields: ErrorField[]) => {
  const obj:any = {}
  errorFields.forEach(item => {
    const key = item.name[0]
    obj[key] = item.errors[0]
  })
  return obj
}
