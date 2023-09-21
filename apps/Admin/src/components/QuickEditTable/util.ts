import { randomString } from '@jetlinks/utils'
import Schema from 'async-validator';
import {isArray} from "lodash-es";

export const dataAddID = (data: any[], rowHeight: number) => {
  return data.map((item, index ) => {
    item.offsetTop = (index) * rowHeight
    item.index = index + 1

    if (!item._quick_id) {
      item._quick_id = randomString(32)
    }
    return item
  })
}

export const useValidate = (dataSource) => {
  const validateRef = ref()
  const errorMap = ref({})
  const watch = {}

  let ruleObj = {}

  const createPath = (dataIndex, id): string => {
    return `${dataIndex}__${id}`
  }

  const handleColumns = (columns) => {
    ruleObj = {}
    columns.forEach(item => {
      if (item.form) {
        if (item.form.rules) {
          ruleObj[item.dataIndex] = item.form.rules
        }

        if (item.form.watch && isArray(item.form.watch)) {
          item.form.watch.forEach(key => {
            ruleObj[key] = item.form.rules
            watch[key] = item.dataIndex
          })
        }
      }
    })
  }

  const hasValidate = (name) => {
    return !!ruleObj[name]
  }

  const createValidate = (columns) => {
    handleColumns(columns)
    validateRef.value = new Schema(ruleObj)
  }

  const validate = (name, value, record) => {
    if (name && hasValidate(name)) {
      return new Promise((resolve, reject) => {
        validateRef.value.validate(
          { [name]: value, record },
          { firstFields: true },
          (err) => {

            const hasName = err?.find(item => item.field === name)
            const path = createPath(name, record._quick_id)

            if (err && hasName) { // 有错误
              if (!watch[hasName.field]) {
                errorMap.value[path] = hasName.message

                reject({ [path]:[hasName] })
              }
            } else { // 无错误
              resolve(false)
              if (errorMap.value[path]) {
                delete errorMap.value[path]
              }
              if (watch[name]) {
                const watchPath = createPath(watch[name], record._quick_id)
                delete errorMap.value[watchPath]
              }
            }
          }
        )
      })
    }
  }

  const validates = () => {
    return new Promise(async (resolve, reject) => {
      let errorMsg = {}
      for (const item of dataSource) {
        for (const key in ruleObj) {
          await validate(key, item[key], item)?.catch(e => {
            errorMsg = {
              ...e,
              ...errorMsg
            }
          })
        }
      }
      if (Object.keys(errorMsg).length) {
        reject(errorMsg)
      } else {
        resolve(dataSource)
      }
    })
  }


  return {
    hasValidate,
    validate,
    createValidate,
    createPath,
    validates,
    errorMap
  }
}

