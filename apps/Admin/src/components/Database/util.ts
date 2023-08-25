export const TYPE_PROVIDE = Symbol('crud_java_type')

export const SETTING_FORM_MODEL = Symbol('setting_form_model')
export const SETTING_FORM_REF = Symbol('setting_form_ref')

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
