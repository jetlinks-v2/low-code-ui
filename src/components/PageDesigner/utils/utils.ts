import { map } from "lodash-es"
import { ISchema } from "../typings"
import { uid } from "./uid"

// 添加子组件
export const appendChildItem = (arr: any[], newData: any, parent: any) => {
    return arr.map(item => {
        let child: any[] = item?.children || []
        if (item.key === parent?.key) {
            child = [...child, newData]
            return {
                ...item,
                children: child
            }
        } else if (item.children?.length) {
            child = appendChildItem(item.children, newData, parent)
        }
        return {
            ...item,
            children: [...child]
        }
    })
}

// 更新数据
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

export const handleCopyData = (arr: any[]) => {
    return arr.map(item => {
        return {
            ...item,
            key: item.type + uid(6),
            children: handleCopyData(item.children || [])
        }
    })
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

export const _getData = (arr: any[]) => {
    return arr.map(item => {
        return {
            ordinal: item?.ordinal,
            label: item.text,
            value: item.value,
            children: _getData(item?.children || [])
        }
    })
}
