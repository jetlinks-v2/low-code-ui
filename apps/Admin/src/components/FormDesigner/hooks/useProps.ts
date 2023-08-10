import { computed, isRef } from 'vue'
import dayjs from 'dayjs'
import { get } from 'lodash-es'

const addValidate = (result, node) => {
  const {
    options
  } = node
  result.prop = node.context && node.context.parents.map((e, index) => {
    let result = ''
    if (!index) {
      result = e.context.parent.indexOf(e)
    } else {
      const parent = e.context.parent
      let nodes = []
      if (parent.columns) {
        nodes = parent.columns
        result += 'columns.'
      } else if (parent.list) {
        nodes = parent.list
        result += 'list.'
      } else if (parent.rows) {
        nodes = parent.rows
        result += 'rows.'
      }
      result += nodes.indexOf(e)
    }
    return result
  }).join('.') + '.options.defaultValue'

  const obj: any = {}
  const validator = (...arg0) => new Promise((resolve, reject) => {
    let value = arg0[1]
    if (/^(signature|radio|checkbox|select|html)$/.test(node.type)) {
      value = options.defaultValue
    }
    const newValue = options.isShowTrim ? value.trim() : value
    if (result.required && (newValue === '' || newValue === null || newValue === undefined || (Array.isArray(newValue) && !newValue.length))) {
      reject('必填')
      return
    }
    switch (node.type) {
      // resolve('')
    }
  })
  obj.required = options?.required
  obj.asyncValidator = validator
  result.rules = [obj]
}


const useProps = (state: any, data: any, isRoot?: boolean, specialHandling?: any) => {
  return computed(() => {
    let node = isRoot ? data.config : data
    if (isRoot) {
      return {
        model: data.store,
        size: node?.pc?.size,
        labelPosition: node?.pc?.labelPosition
      }
    }
    if (isRef(data)) {
      node = data.value
    }
    let result: any = {}
    const {
      options
    } = node

    result = {
      label: node.label || '', // options.isShowLabel ? node.label : '',
      disabled: options?.disabled,
      placeholder: options?.placeholder,
      clearable: options?.clearable,
      required: options?.required
    }
    if (state.mode === 'preview') {
      const fieldState = state.fieldsLogicState.get(node)
      const required = get(fieldState, 'required', undefined)
      const readOnly = get(fieldState, 'readOnly', undefined)
      if (readOnly === undefined) {
        result.disabled = options.disabled
      } else {
        result.disabled = readOnly === 1
      }
      if (required === undefined) {
        result.required = result.disabled ? false : result.required
      } else {
        result.required = result.disabled ? false : required === 1
      }
    }
    addValidate(result, node)

    result.labelWidth = options?.isShowLabel ? options?.labelWidth + 'px' : 'auto'

    switch (node.type) {
      case 'input':
        if (options?.isShowWordLimit) {
          result.maxLength = options.max
          result['show-word-limit'] = options?.isShowWordLimit
        }
        // result.showPassword = options?.showPassword
        // result.prepend = options.prepend
        // result.append = options.append
        break
      case 'textarea':
        if (options?.isShowWordLimit) {
          result.maxLength = options.max
          result['show-word-limit'] = options?.isShowWordLimit
        }
        result.type = 'textarea'
        result.rows = options.rows
        break
      case 'number':
        result.controls = options.controls
        if (options.controls) {
          result['controls-position'] = options.controlsPosition ? 'right' : ''
        }
        if (options?.isShowWordLimit) {
          result.min = options.min
          result.max = options.max
        } else {
          result.min = Number.NEGATIVE_INFINITY
          result.max = Number.POSITIVE_INFINITY
        }
        result.step = options.step
        result.precision = options.precision
        break
      case 'radio':
      case 'checkbox':
        result.options = get(state, `data[${options?.dataKey}].list`, [])
        break
      case 'select':
        result.options = get(state, `data[${options?.dataKey}].list`, [])
        result.multiple = options.multiple
        result.filterable = options.filterable
        break
      case 'time':
        result.format = options.format
        result.valueFormat = options.valueFormat
        break
      case 'date':
        result.placeholder = options.placeholder
        result.format = options.format
        result.type = options.type
        result.valueFormat = 'X'
        if (options.type === 'daterange') {
          result.rangeSeparator = ''
          result.startPlaceholder = options.placeholder
        }
        result.disabledDate = (time) => {
          const {
            startTime,
            endTime,
          } = options
          const startDate = dayjs.unix(startTime)
          const endDate = dayjs.unix(endTime)
          const currentDate = dayjs(time)
          let result = false
          if (options?.isShowWordLimit) {
            result = currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
          }
          return result
        }
        break
      case 'cascader':
        result.options = get(state, `data[${options.dataKey}].list`, [])
        result.props = {
          multiple: options.multiple,
          checkStrictly: options.checkStrictly
        }
        break
      case 'html':
        result.type = 'textarea'
        result.rows = 4
        result.action = options.action
        result.maxSize = options.size * 1024 * 1024
        result.config = {
          placeholder: options.placeholder
        }
        break
      case 'uploadfile':
        result.multiple = options.multiple
        result.action = options.action
        result.accept = options.accept
        result.maxSize = options.size * 1024 * 1024
        result.limit = options.limit
        break
    }
    specialHandling && specialHandling(node.type, result)
    return result
  })
}

export default useProps
