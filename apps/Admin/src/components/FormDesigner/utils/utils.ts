import { uid } from "./uid"
import componentMap from "./componentMap"
import { ISchema } from "../typings"
import { queryDictionary, queryDictionaryData, queryEndCommands, queryProject, queryRuntime } from "@/api/form"
import { isObject, map, omit } from "lodash-es"

// 查询数据字典或者项目列表
let _source = {
    end: [],
    dictionary: []
}
// 查询command
const _commandsMap = new Map()

export const searchTree = (arr: any[], _item: any) => {
    let _data: any = undefined
    arr?.map((item) => {
        if (item.id === _item) {
            _data = item
            return
        }
        if (item.children?.length) {
            _data = searchTree(item.children, _item)
        }
    })
    return _data
}

export const getArray = (arr: any[]) => {
    const _item = arr.find((i) => i.valueType?.type === 'array')
    if (_item) {
        return arr?.map((item) => {
            const children = item?.properties?.length ? getArray(item.properties) : []
            return {
                ...omit(item, 'properties'),
                label: item?.name,
                value: item?.id,
                children,
            }
        })
    } else {
        return []
    }
}
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

const checkedConfigItem = (node: ISchema, allData: any[], formList: any[], source: any, commandsMap: any) => {
    const obj = {
        key: node?.key,
        message: (node.formItemProps?.label || node.name) + '配置错误'
    }
    const _type = node.type || 'root'
    if (['root', 'table-item-index', 'table-item-actions'].includes(_type)) {
        return false
    } else {
        if (arr.includes(_type)) {
            if (!node?.formItemProps?.label) {
                return obj
            }
        }
        if (!['space-item', 'card-item', 'grid-item', 'table-item'].includes(_type)) {
            if (!node?.formItemProps?.name) {
                return obj
            } else if (!(/^[a-zA-Z0-9_\-]+$/.test(node?.formItemProps?.name))) {
                return obj
            } else {
                const arr = getBrotherList(node?.key || '', allData)
                const flag = arr.filter((item) => item.key !== node.key).find((i) => i?.formItemProps?.name === node?.formItemProps?.name)
                if (flag) { // `标识${value}已被占用`
                    return obj
                }
            }
        }
        if (['text'].includes(_type) && !node?.componentProps?.value) {
            return obj
        }
        if ('input-number' === _type && (node?.componentProps?.max === undefined || node?.componentProps?.min === undefined || node?.componentProps?.precision === undefined)) {
            return obj
        }
        if ('input-number' === _type && (node?.componentProps?.max !== undefined && node?.componentProps?.min !== undefined)) {
            if (node?.componentProps?.max < node?.componentProps?.min) {
                return obj
            }
        }
        if (['select', 'tree-select', 'select-card'].includes(_type)) {
            // 数据源
            if (!node?.componentProps.source?.type) {
                return obj
            } else {
                if (node?.componentProps.source?.type === 'dic') {
                    if (!node?.componentProps.source?.dictionary) {
                        return obj
                    } else {
                        const flag = (source.dictionary || []).find(i => node?.componentProps.source?.dictionary === i.id)
                        if (!flag) {
                            return obj
                        }
                    }
                } else {
                    if (!node?.componentProps.source?.projectId || !node?.componentProps.source?.functionId || !node?.componentProps.source?.commandId || !node?.componentProps.source?.label || !node?.componentProps.source?.value) {
                        return obj
                    }
                    if (node?.componentProps.source?.isSource && !node?.componentProps.source?.source) {
                        return obj
                    }
                    // 数据是否被删除
                    const _projects = (source.end || []).find(i => node?.componentProps.source?.projectId === i.id)
                    if (!_projects) {
                        return obj
                    }
                    const _functions = (commandsMap.get(node?.componentProps.source?.projectId) || []).find(i => node?.componentProps.source?.functionId === i.id)
                    if (!_functions) {
                        return obj
                    }
                    const _command = (_functions?.command || []).find(i => node?.componentProps.source?.commandId === i.id)
                    if (!_command) {
                        return obj
                    }
                    const list = (_command?.output?.properties || [])?.map((item) => {
                        return {
                            ...item,
                            label: item.name,
                            value: item.id,
                        }
                    })
                    let _array: any[] = []
                    if (node?.componentProps.source?.isSource) {
                        const _sourceList = getArray(list)
                        const _data = searchTree(_sourceList, node?.componentProps.source?.source)
                        if (!_data) {
                            return obj
                        }
                        if (_data?.valueType?.type === 'array') {
                            _array = _data.valueType?.elementType?.properties?.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.id,
                                }
                            })
                        }
                    } else {
                        _array = [...list]
                    }
                    if (!(map(_array, 'value').includes(node?.componentProps.source?.label) && map(_array, 'value').includes(node?.componentProps.source?.value))) {
                        return obj
                    }
                }
            }
        }
        if ('upload' === _type && ((node?.componentProps?.maxCount !== 0 && !node?.componentProps?.maxCount) || (node?.componentProps?.fileSize !== 0 && !node?.componentProps?.fileSize))) {
            // 个数和单位
            return obj
        }
        if ('space' === _type && (node?.componentProps?.size !== 0 && !node?.componentProps?.size)) {
            return obj
        }
        if (['card'].includes(_type) && !(node?.componentProps?.title)) {
            return obj
        }
        if (['form'].includes(_type)) {
            if (!(node.componentProps.source.value)) {
                return obj
            } else {
                const flag = formList.find((i) => i.value === node.componentProps.source.value)
                if (!flag) {
                    return obj
                }
            }
        }
        if (node?.formItemProps?.isLayout && !node.formItemProps?.label) {
            return obj
        }
        if (['org', 'role', 'user', 'product', 'device'].includes(_type)) {
            if (!node.componentProps?.keys?.length) {
                return obj
            }
        }
    }
    return false
}

// 后端能力
const _valEndData = async (node: ISchema) => {
    if (node.componentProps?.source?.type === 'dic' && !_source.dictionary?.length) {
        const resp = await queryDictionary()
        if (resp.success) {
            _source = {
                ..._source,
                dictionary: resp?.result || []
            }
        }
    }
    if (node.componentProps?.source?.type === 'end' && !_source.end?.length) {
        const resp = await queryProject()
        if (resp.success) {
            _source = {
                ..._source,
                end: resp?.result || []
            }
        }
    }
    if (node.componentProps?.source?.projectId && !_commandsMap.get(node.componentProps?.source?.projectId)) {
        const resp = await queryEndCommands(node.componentProps?.source?.projectId, ['rdb-crud'])
        if (resp.success) {
            _commandsMap.set(node.componentProps?.source?.projectId, resp.result || [])
        }
    }
}

const errorMap = new Map()
// 校验配置项必填
const checkConfig = async (node: ISchema, allData: any[], formList: any[]) => {
    if (['select', 'tree-select', 'select-card'].includes(node.type)) {
        await _valEndData(node)
    }
    const _data: any = checkedConfigItem(node, allData, formList, _source, _commandsMap);
    if (_data) {
        errorMap.set(node.key, _data)
    }
    if (node.children && node.children?.length) {
        for (let index = 0; index < node?.children?.length; index++) {
            const element = node?.children[index];
            await checkConfig(element, allData, formList)
        }
    }
}

export const checkedConfig = (node: ISchema, formList: any[]) => {
    _commandsMap.clear()
    errorMap.clear()
    _source = {
        end: [],
        dictionary: []
    }
    return new Promise(async (resolve) => {
        await checkConfig(node, node?.children || [], formList)
        resolve([...errorMap.values()])
    })
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

export const insertCustomCssToHead = (cssCode: string, formId: string, attrKey: string = 'data-id') => {
    if (!cssCode || !formId) return
    let head = document.getElementsByTagName('head')[0]
    let oldStyle = document.getElementById(formId)
    if (!!oldStyle) {
        head.removeChild(oldStyle)  //先清除后插入！！
    }
    const id = `[${attrKey}="${formId}"]`
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
        let _item = undefined;
        arr.map(item => {
            if (item === key) {
                _item = obj?.[key]
            } else if (isObject(obj[item])) {
                _item = getData(key, obj[item])
            }
        })
        return _item
    }
    return obj
}

function bubbleSort(arr: any[]) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j]?.ordinal > arr[j + 1]?.ordinal) {        //相邻元素两两对比
                const temp = arr[j + 1];        //元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

const _getData = (arr: any[]) => {
    return arr.map(item => {
        return {
            ordinal: item?.ordinal,
            label: item.text,
            value: item.value,
            children: _getData(item?.children || [])
        }
    })
}

const _getEndData = (arr: any[], source: any) => {
    return arr.map(item => {
        return {
            label: item[source?.label],
            value: item[source?.value],
            children: _getData(item?.children || [])
        }
    })
}

// 获取options
export const queryOptions = async (source: any) => {
    if (source?.type === 'dic' && source?.dictionary) {
        const resp = await queryDictionaryData(source?.dictionary)
        if (resp.success) {
            const list = _getData(resp.result || [])
            return bubbleSort(list)
        }
    }
    if (source?.projectId && source?.type === 'end' && source?.functionId && source?.commandId && source?.label && source?.value) {
        const resp = await queryRuntime(source?.projectId, source?.fullId, source?.commandId, {})
        if (resp.success) {
            const arr = getData(source?.source, resp?.result || [])
            if (Array.isArray(arr) && arr?.length) {
                return _getEndData(arr, source)
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

// 添加子组件_flag: start: 开头， end: 尾部  undefined：中间
export const appendChildItem = (arr: any[], newData: any, parent: any, _flag?: 'start' | 'end' | undefined) => {
    return arr.map(item => {
        let child: any[] = item?.children || []
        if (item.key === parent?.key) {
            if (!_flag) {
                const _f = child.find(item => item?.children?.[0]?.type === 'table-item-actions')
                if (_f) {
                    child.splice(child.length - 1, 0, newData)
                } else {
                    child.push(newData)
                }
            }
            if (_flag === 'end') {
                child = [...child, newData]
            }
            if (_flag === 'start') {
                child = [newData, ...child]
            }
            return {
                ...item,
                children: child
            }
        } else if (item.children?.length) {
            child = appendChildItem(item.children, newData, parent, _flag)
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
        } else if (data.type === 'switch') {
            _obj[data?.formItemProps?.name] = obj || false
        } else if (['org', 'role', 'user', 'product', 'device'].includes(data.type)) {
            if (data.componentProps?.mode === 'multiple') {
                _obj[data?.formItemProps?.name] = obj
            } else {
                data.componentProps.keys.map(i => {
                    _obj[i?.config?.source] = undefined
                })
            }
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