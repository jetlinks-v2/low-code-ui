import { omit } from "lodash-es"

const useProps = (element: any, _data: any, mode?: string) => {
  // formItemProps
  let rules: any[] = (element?.formItemProps?.rules || []).map(item => {
    const trigger = item.trigger?.length > 1 ? item?.trigger : item.trigger?.join('')
    // if (item?.validator) { // 处理自定义校验函数
    //   return {
    //     ...omit(item, ['validator', 'key']),
    //     trigger,
    //     validator(rule, value, callback) {
    //       let customFn = new Function('rule', 'value', 'callback', item?.validator)
    //       return customFn(rule, value, callback)
    //     }
    //   }
    // }
    // if (item?.pattern) {
    //   let _pattern: any;
    //   try {
    //     _pattern = new RegExp(item?.pattern)
    //   } catch (error) {
    //   }
    //
    //   return {
    //     ...omit(item, ['pattern', 'key']),
    //     trigger,
    //     pattern: _pattern
    //   }
    // }

    const elementValueType = element?.formItemProps?.type || 'string'

    return {
      trigger,
      validator(rule,value,cb) {
        const errorMessage: Array<string> = []
        const len = elementValueType === 'number' ? value : value?.length
        // validator
        let customFn = new Function('rule', 'value', 'callback', item?.validator)
        customFn(rule, value, cb)?.catch?.(err => {
          errorMessage.push(err)
        })

        // max
        if (item.max && len !== undefined && len > item.max) {
          errorMessage.push(`长度或值不能大于${item.max}`)
        }
        // min
        if (item.min && len !== undefined && len < item.min) {
          errorMessage.push(`长度或值不能小于${item.min}`)
        }
        // pattern

        if (item.pattern) {
          let _pattern: any;
          try {
            _pattern = new RegExp(item?.pattern)
            if (!_pattern.test(value)) {
              errorMessage.push(`该值不匹配${item?.pattern}`)
            }

          } catch (error) {
          }
        }

        if (errorMessage.length) {
          return Promise.reject(item.message || errorMessage.toString())
        }
        return Promise.resolve()
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
