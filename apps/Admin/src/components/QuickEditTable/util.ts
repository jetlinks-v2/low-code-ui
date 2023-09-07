import { randomString } from '@jetlinks/utils'
import Schema from 'async-validator';

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

  let ruleObj = {}

  const createPath = (dataIndex, id): string => {
    return `${dataIndex}__${id}`
  }

  const handleColumns = (columns) => {
    ruleObj = {}
    columns.forEach(item => {
      if (item.form && item.form.rules) {
        ruleObj[item.dataIndex] = item.form.rules
      }
    })
  }

  const hasValidate = (name) => {
    return !!ruleObj[name]
  }

  const createValidate = (columns) => {
    handleColumns(columns)
    console.log(ruleObj)
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
            console.log(err, path, hasName)
            if (err && hasName) { // 有错误
              errorMap.value[path] = hasName.message
              reject({ [path]:[hasName] })
            } else { // 无错误
              resolve(false)
              if (errorMap.value[path]) {
                delete errorMap.value[path]
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
          await validate(key, item[key], item)?.then(res => {
            console.log(res)
          })?.catch(e => {
            console.log(e)
            errorMsg = {
              ...e,
              ...errorMsg
            }
          })
        }
      }
      console.log('validates', errorMsg)
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

