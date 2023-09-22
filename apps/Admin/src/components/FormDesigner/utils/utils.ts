import { uid } from "./uid"
import componentMap from "./componentMap"
import { ISchema } from "../typings"
import { queryDictionaryData, queryRuntime } from "@/api/form"
import { isObject, map, omit } from "lodash-es"

export const checkIsField = (node: any) => node?.type && (componentMap?.[node?.type]) || ['table'].includes(node?.type)

// 生成多个选项
export const generateOptions = (len: number) => {
    const result: any[] = []
    const length = len
    while (len--) {
        result.push({
            label: '选项' + (length - len),
            value: uid()
        })
    }
    return result
}

const arr = ['input', 'textarea', 'input-number', 'card-select', 'input-password', 'upload', 'switch', 'form', 'select', 'tree-select', 'date-picker', 'time-picker', 'table', 'geo', 'product', 'device', 'org', 'user', 'role']

const checkedConfigItem = (node: ISchema, allData: any[]) => {
    const _type = node.type || 'root'
    if (_type === 'root') {
        return false
    } else {
        if (arr.includes(_type)) {
            if (!node?.formItemProps?.label) {
                return {
                    key: node?.key,
                    message: (node.formItemProps?.label || node.name) + '配置错误'
                }
            }
        }
        if (!['space-item', 'card-item', 'grid-item', 'table-item'].includes(_type)) {
            if (!node?.formItemProps?.name) {
                return {
                    key: node?.key,
                    message: (node.formItemProps?.label || node.name) + '配置错误'
                }
            } else if (!(/^[a-zA-Z0-9_\-]+$/.test(node?.formItemProps?.name))) {
                return {
                    key: node?.key,
                    message: (node.formItemProps?.label || node.name) + '配置错误'
                }
            } else {
                const arr = getBrotherList(node?.key || '', allData)
                const flag = arr.filter((item) => item.key !== node.key).find((i) => i?.formItemProps?.name === node?.formItemProps?.name)
                if (flag) { // `标识${value}已被占用`
                    return {
                        key: node?.key,
                        message: (node.formItemProps?.label || node.name) + '配置错误'
                    }
                }
            }
        }
        if (['text'].includes(_type) && !node?.componentProps?.value) {
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
        if ('input-number' === _type && (node?.componentProps?.max === undefined || node?.componentProps?.min === undefined || node?.componentProps?.precision === undefined)) {
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
        if ('input-number' === _type && (node?.componentProps?.max !== undefined && node?.componentProps?.min !== undefined)) {
            if (node?.componentProps?.max < node?.componentProps?.min) {
                return {
                    key: node?.key,
                    message: (node.formItemProps?.label || node.name) + '配置错误'
                }
            }
        }
        if (['select', 'tree-select', 'select-card'].includes(_type)) {
            // 数据源
            if (node?.componentProps.source?.functionId && !node?.componentProps.source?.commandId) {
                return {
                    key: node?.key,
                    message: (node.formItemProps?.label || node.name) + '配置错误'
                }
            }
        }
        if ('upload' === _type && ((node?.componentProps?.maxCount !== 0 && !node?.componentProps?.maxCount) || (node?.componentProps?.fileSize !== 0 && !node?.componentProps?.fileSize))) {
            // 个数和单位
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
        if ('space' === _type && (node?.componentProps?.size !== 0 && !node?.componentProps?.size)) {
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
        if (['card'].includes(_type) && !(node?.componentProps?.title)) {
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
        if (node?.formItemProps?.isLayout && !node.formItemProps?.label) {
            return {
                key: node?.key,
                message: (node.formItemProps?.label || node.name) + '配置错误'
            }
        }
    }
    return false
}

// 校验配置项必填
const checkConfig = (node: ISchema, allData: any[]) => {
    const _data: any = checkedConfigItem(node, allData);
    let _rules: any[] = []
    if (_data) {
        _rules.push(_data)
    }
    if (node.children && node.children?.length) {
        node?.children.map(item => {
            const arr = checkConfig(item, allData)
            _rules = [..._rules, ...arr]
        })
    }
    return _rules
}

export const checkedConfig = (node: ISchema) => {
    return checkConfig(node, node?.children || [])
}

export const updateData = (list: ISchema[], item?: any) => {
    return (list || []).map(_item => {
        if (_item.key === item.key) {
            return {
                ..._item,
                ...item
            }
        }
        return {
            ..._item,
            children: updateData(_item?.children || [], item)
        }
    })
}

// 处理css 获取名称
export const extractCssClass = (formCssCode: string) => {
    if (!formCssCode) return []
    const regExp = /\..*{/g
    const result = formCssCode.match(regExp)
    const cssNameArray: string[] = []

    if (!!result && result.length) {
        result.forEach((rItem) => {
            let classArray = rItem.split(',')  //切分逗号分割的多个class
            if (classArray.length) {
                classArray.forEach((cItem) => {
                    let caItem = cItem.trim()
                    if (caItem.indexOf('.', 1) !== -1) {  //查找第二个.位置
                        let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf('.', 1))  //仅截取第一、二个.号之间的class
                        if (!!newClass) {
                            cssNameArray.push(newClass.trim())
                        }
                    } else if (caItem.indexOf(' ') !== -1) {  //查找第一个空格位置
                        let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf(' '))  //仅截取第一、二个.号之间的class
                        if (!!newClass) {
                            cssNameArray.push(newClass.trim())
                        }
                    } else {
                        if (caItem.indexOf('{') !== -1) {  //查找第一个{位置
                            let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf('{'))
                            cssNameArray.push(newClass.trim())
                        } else {
                            let newClass = caItem.substring(caItem.indexOf('.') + 1)
                            cssNameArray.push(newClass.trim())
                        }
                    }
                })
            }
        })
    }
    return Array.from(new Set(cssNameArray))  //数组去重
}

export const insertCustomCssToHead = (cssCode: string, formId: string) => {
    if (!cssCode || !formId) return
    let head = document.getElementsByTagName('head')[0]
    let oldStyle = document.getElementById(formId)
    if (!!oldStyle) {
        head.removeChild(oldStyle)  //先清除后插入！！
    }
    const id = `[data-id="${formId}"]`
    const result = cssCode.replace(/\.([a-zA-Z-]+)/g, `.$1${id}`)
        .replace(/#([a-zA-Z-]+)/g, `#$1${id}`)
        .replace(/([a-zA-Z-]+)(?=\s*\{)/g, `$1${id}`);

    let newStyle: HTMLStyleElement = document.createElement('style')
    newStyle.type = 'text/css'
    newStyle.rel = 'stylesheet'
    newStyle.id = formId
    try {
        newStyle.appendChild(document.createTextNode(result))
    } catch (ex) {
        newStyle.styleSheet.cssText = result
    }

    head.appendChild(newStyle)
}

// 查询数据
export const getBrotherList = (value: string | number, arr: any[]) => {
    if (Array.isArray(arr) && arr?.length) {
        for (let index = 0; index < arr?.length; index++) {
            const element = arr[index];
            if (element.key === value) {
                return arr
            }
            if (element?.children?.length) {
                return getBrotherList(value, element?.children)
            }
        }
    }
    return []
}

const getData = (key: string, obj: any) => {
    if (key) {
        const arr = Object.keys(obj) || []
        return arr.find(item => {
            if (item === key) {
                return obj?.[key]
            }
            if (isObject(obj[item])) {
                return getData(key, obj[item])
            }
        })
    }
    return obj
}

// 获取options
export const queryOptions = async (source: any, id: string) => {
    if (source?.type === 'dic' && source?.dictionary) {
        const resp = await queryDictionaryData(source?.dictionary)
        if (resp.success) {
            return resp.result.map(item => {
                return {
                    label: item.text,
                    value: item.value
                }
            })
        }
    }
    if (id && source?.type === 'end' && source?.functionId && source?.commandId && source?.label && source?.value) {
        const resp = await queryRuntime(id, source?.functionId, source?.commandId)
        if (resp.success) {
            const arr = getData(source?.source, resp?.result || {})
            if (Array.isArray(arr) && arr?.length) {
                return arr.map(item => {
                    return {
                        label: item[source?.label],
                        value: item[source?.value]
                    }
                })
            } else {
                return []
            }
        }
    }
    return []
}

// 删除数据并返回数据的后一个数据
export const deleteDataByKey = (arr: any[], _items: any[]) => {
    const _keys = map(_items, 'key')
    let _data: any = undefined
    const _arr = arr.filter((item, index) => {
        if (_keys.includes(item?.key)) {
            if (arr?.[index - 1]) {
                _data = arr[index - 1]
            }
            return false
        } else {
            if (item.children && item.children?.length) {
                const obj = deleteDataByKey(item.children, _items)
                item.children = obj?.arr
                _data = obj?.data
            }
        }
        return true
    })
    return {
        arr: _arr,
        data: _data
    }
}

// 插入数据，主要是为了粘贴
export const copyDataByKey = (arr: any[], newData: any[], _item: any) => {
    const _index = arr.findIndex(item => item?.key === _item?.key)
    if (_index === -1) {
        return arr.map(item => {
            return {
                ...item,
                children: item?.children?.length ? copyDataByKey(item.children, newData, _item) : []
            }
        })
    } else {
        return [...arr.slice(0, _index + 1), ...newData, ...arr.slice(_index + 1, arr?.length)]
    }
}

// 添加子组件flag: true: 开头， undefined: 尾部，false: 中间
export const appendChildItem = (arr: any[], newData: any, parent: any, flag?: boolean) => {
    return arr.map(item => {
        let child: any[] = item?.children || []
        if (item.key === parent?.key) {
            if (flag === undefined) {
                child = [...child, newData]
            }
            if (flag === false) {
                const _f = child.find(item => item?.formItemProps?.name === 'actions')
                if (_f) {
                    child.splice(child.length - 1, 0, newData)
                } else {
                    child.push(newData)
                }
            }
            if (flag === true) {
                child = [newData, ...child]
            }
            return {
                ...item,
                children: child
            }
        }
        if (item.children?.length) {
            child = appendChildItem(item.children, newData, parent)
        }
        return {
            ...item,
            children: [...child]
        }
    })
}

const getFieldChildrenData = (data: ISchema[]) => {
    let obj: any = {}
    data.map((item: any) => {
        obj = {
            ...obj,
            ...getFieldData(item),
        }
    })
    return obj
}

export const getFieldData = (data: ISchema) => {
    let obj: any = undefined
    if (data.children && data.children?.length) {
        obj = getFieldChildrenData(data?.children)
    }
    let _obj: any = {}
    if (data?.formItemProps?.name) {
        if (data.type === 'table') {
            _obj[data?.formItemProps?.name] = [omit(obj, ['actions', 'index'])]
        } else {
            _obj[data?.formItemProps?.name] = obj
        }
    } else {
        _obj = obj
    }
    return _obj
}

export const initData = {
    type: 'root',
    key: 'root',
    componentProps: {
        layout: 'horizontal',
        size: 'default',
        cssCode: '',
        eventCode: '',
    },
    children: [],
}

export const handleCopyData = (arr: any[]) => {
    return arr.map(item => {
        return {
            ...item,
            key: item.type + uid(6),
            children: handleCopyData(item.children || [])
        }
    })
}

// 查找父节点
export const findParentById = (tree: any, node: any) => {
    let result: any = []
    function find(node, tree) {
        tree?.children.forEach(item => {
            if (item.key === node.key) {
                result.push(tree)
            }
            if ('children' in item) {
                find(node, item)
            }
        })
    }
    find(node, tree)
    return result?.[0]
}