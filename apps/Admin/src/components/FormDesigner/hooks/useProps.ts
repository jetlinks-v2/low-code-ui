import { omit } from "lodash-es"

const useProps = (element: any, _data: any, mode?: string) => {
  // formItemProps
  let rules: any[] = (element?.formItemProps?.rules || []).map(item => {
    const trigger = item.trigger?.length > 1 ? item?.trigger : item.trigger?.join('')
    if (item?.validator) { // 处理自定义校验函数
      return {
        ...omit(item, ['validator', 'key']),
        trigger,
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
        trigger,
        pattern: _pattern
      }
    }
    return { ...omit(item, 'key'), trigger }
  })
  // 处理内嵌表单的校验问题
  if (element?.formItemProps?.required) {
    if (['org', 'user', 'role', 'device', 'product', 'select-card', 'switch', 'tree-select', 'select', 'date-picker', 'time-picker'].includes(element.type)) {
      rules = [{
        required: true,
        message: `请选择${element?.formItemProps?.label}`
      }]
    }
  }
  // componentProps
  const _componentProps = {
    ...omit(element?.componentProps, ['description', 'cssCode', 'editable', 'onChange', 'visible', 'source']),
    size: _data?.componentProps.size,
    disabled: element?.componentProps?.disabled || (mode === 'edit' && !element?.componentProps?.editable)
  }
  if (element?.componentProps?.options) {
    _componentProps.options = element?.componentProps?.options || []
  }

  if (element?.componentProps?.treeData) {
    _componentProps.treeData = element?.componentProps?.treeData || []
  }

  const result = {
    ...element,
    formItemProps: { ...element?.formItemProps, rules },
    componentProps: _componentProps
  }

  return result
}

export default useProps
