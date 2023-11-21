import { omit } from "lodash-es"

export const handleRules = (element?: any) => {
  const rules: any[] = []
  if (element?.formItemProps?.required) {
    const ruleItem = {
      required: true,
      message: `请输入${element?.formItemProps?.label}`
    }
    if (['org', 'user', 'role', 'device', 'product', 'select-card', 'switch', 'tree-select', 'select', 'date-picker', 'time-picker'].includes(element.type)) {
      ruleItem.message = `请选择${element?.formItemProps?.label}`
      return rules
    } else {
      rules.push(ruleItem)
    }
  }

  (element?.formItemProps?.rules || []).forEach(item => {
    const trigger = item.trigger?.length > 1 ? item?.trigger : item.trigger?.join('')
    rules.push({
      trigger,
      async validator(rule, value, cb) {
        // 当输入框非必填的时候需要判断
        if ((value === undefined || value === null) && !element?.formItemProps?.required) {
          return Promise.resolve()
        }
        const errorMessage: Array<string> = []
        const len = element?.type === 'input-number' ? value : value?.length
        // validator
        if (item?.validator) {
          let customFn = new Function('rule', 'value', 'callback', item?.validator)
          try {
            await customFn(rule, value, cb)
          } catch (err: any) {
            errorMessage.push(err)
          }
        }

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
    })
  })
  return rules
}
const useProps = (element: any, _data: any, editable: boolean, __disabled: boolean, mode?: string) => {
  // formItemProps
  // let rules: any[] = (element?.formItemProps?.rules || []).map(item => {
  //   const trigger = item.trigger?.length > 1 ? item?.trigger : item.trigger?.join('')
  //
  //   return {
  //     trigger,
  //     async validator(rule, value, cb) {
  //       // 当输入框非必填的时候需要判断
  //       if ((value === undefined || value === null) && !element?.formItemProps?.required) {
  //         return Promise.resolve()
  //       }
  //       const errorMessage: Array<string> = []
  //       const len = element?.type === 'input-number' ? value : value?.length
  //       // validator
  //       if (item?.validator) {
  //         let customFn = new Function('rule', 'value', 'callback', item?.validator)
  //         try {
  //           await customFn(rule, value, cb)
  //         } catch (err: any) {
  //           errorMessage.push(err)
  //         }
  //       }
  //
  //       // max
  //       if (item.max && len !== undefined && len > item.max) {
  //         errorMessage.push(`长度或值不能大于${item.max}`)
  //       }
  //       // min
  //       if (item.min && len !== undefined && len < item.min) {
  //         errorMessage.push(`长度或值不能小于${item.min}`)
  //       }
  //       // pattern
  //
  //       if (item.pattern) {
  //         let _pattern: any;
  //         try {
  //           _pattern = new RegExp(item?.pattern)
  //           if (!_pattern.test(value)) {
  //             errorMessage.push(`该值不匹配${item?.pattern}`)
  //           }
  //
  //         } catch (error) {
  //         }
  //       }
  //       if (errorMessage.length) {
  //         return Promise.reject(item.message || errorMessage.toString())
  //       }
  //       return Promise.resolve()
  //     }
  //   }
  // })
  // // 处理内嵌表单的校验问题
  // if (element?.formItemProps?.required) {
  //   if (['org', 'user', 'role', 'device', 'product', 'select-card', 'switch', 'tree-select', 'select', 'date-picker', 'time-picker'].includes(element.type)) {
  //     rules = [{
  //       required: true,
  //       message: `请选择${element?.formItemProps?.label}`
  //     }]
  //   }
  // }

  const _disabled = element?.componentProps?.disabled || __disabled || !editable || (mode === 'edit' && !element?.componentProps?.editable)
  // componentProps
  const _componentProps: any = {
    ...omit(element?.componentProps, ['description', 'cssCode', 'editable', 'onChange', 'visible', 'source']),
    size: _data?.componentProps.size,
    disabled: _disabled
  }

  if (element.type === 'tree-select' && element.componentProps.showSearch) {
    _componentProps.treeNodeFilterProp = 'label'
  }

  if (element.type === 'select' && element.componentProps?.mode === 'multiple') {
    _componentProps.maxTagCount = "responsive"
  }

  if (element?.componentProps?.options) {
    _componentProps.options = element?.componentProps?.options || []
  }

  if (element?.componentProps?.treeData) {
    _componentProps.treeData = element?.componentProps?.treeData || []
  }

  return {
    ...element,
    formItemProps: { ...element?.formItemProps, rules: handleRules(element) },
    componentProps: _componentProps
  }
}

export default useProps