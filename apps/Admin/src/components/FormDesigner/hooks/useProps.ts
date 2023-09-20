import { omit } from "lodash-es"

const useProps = (element: any, _data: any, isEditModel: boolean, mode?: string) => {
  // formItemProps
  let rules: any[] = (element.formItemProps?.rules || []).map(item => {
    if (item?.validator) { // 处理自定义校验函数
      return {
        ...omit(item, ['validator', 'key']),
        validator(rule, value, callback) {
          let customFn = new Function('rule', 'value', 'callback', item?.validator)
          return customFn(rule, value, callback)
        }
      }
    }
    if (item?.pattern) {
      let _pattern: any;
      try {
        _pattern = new RegExp(item?.pattern)
      } catch (error) {
      }

      return {
        ...omit(item, ['pattern', 'key']),
        pattern: _pattern
      }
    }
    return { ...omit(item, 'key') }
  })
  if (element?.formItemProps.required) {
    if (['org', 'user', 'role', 'device', 'product', 'select-card', 'switch', 'tree-select', 'select', 'date-picker', 'time-picker'].includes(element.type)) {
      rules = [{
        required: true,
        message: `请选择${element?.formItemProps?.label}`
      }]
    }
  }
  // componentProps
  const _componentProps = {
    ...omit(element.componentProps, ['description']),
    size: _data?.componentProps.size,
    disabled: element?.componentProps?.disabled || (mode === 'edit' && !element?.componentProps?.editable)
  }
  if (element?.componentProps?.options) {
    _componentProps.options = element?.componentProps?.options || []
  }

  const result = {
    ...element,
    formItemProps: { ...element?.formItemProps, rules },
    componentProps: _componentProps
  }

  return result
}

export default useProps
