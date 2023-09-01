import { uid } from "./uid"
import componentMap from "./componentMap"
import { ISchema } from "../typings"

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

const arr = ['input', 'textarea', 'input-number', 'card-select', 'input-number', 'upload', 'switch', 'form', 'select', 'tree-select', 'date-picker', 'time-picker', 'table', 'geo']
// 容器组件
const layout = ['card', 'grid', 'tabs', 'collapse', 'space']

const checkedConfigItem = (node: ISchema) => {
    const _type = node.type || 'root'
    if (_type === 'root') {
        return false
    } else {
        if (['text'].includes(_type) && !(node?.formItemProps?.name)) {
            return node?.key
        }
        if (arr.includes(_type)) {
            if (!(node?.formItemProps?.label && node?.formItemProps?.name)) {
                return node?.key
            } else if (!(/^[a-zA-Z0-9_\-]+$/.test(node?.formItemProps?.name))) {
                return node?.key
            }
        }
        if ('upload' && !(node?.componentProps?.maxCount && node?.componentProps?.size)) {
            // 个数和单位
            return node?.key
        }
        if ('table') {
            // 数据绑定
        }
        if (['card'].includes(_type) && !(node?.componentProps?.title)) {
            return node?.key
        }
    }
    return ''
}

// 校验配置项必填
export const checkedConfig = (node: ISchema) => {
    const _data: any = checkedConfigItem(node);
    let _rules: any[] = []
    if (_data) {
        _rules = [..._rules, _data]
    }
    if (node.children && node.children?.length) {
        node?.children.map(item => {
            const _item = checkedConfig(item)
            _rules = [..._rules, ..._item]
        })
    }

    return _rules
}

export const updateData = (list: ISchema[], item: ISchema) => {
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

export const insertCustomCssToHead = (cssCode, formId) => {
    let head = document.getElementsByTagName('head')[0]
    let oldStyle = document.getElementById(formId)
    if (!!oldStyle) {
        head.removeChild(oldStyle)  //先清除后插入！！
    }
    if (!!formId) {
        oldStyle = document.getElementById(formId)
        !!oldStyle && head.removeChild(oldStyle)  //先清除后插入！！
    }

    let newStyle: HTMLStyleElement = document.createElement('style')
    newStyle.type = 'text/css'
    newStyle.rel = 'stylesheet'
    newStyle.id = formId
    try {
        newStyle.appendChild(document.createTextNode(cssCode))
    } catch (ex) {
        newStyle.styleSheet.cssText = cssCode
    }

    head.appendChild(newStyle)
}

// 查询数据
export const getBrotherList = (value: string, arr: any[]) => {
    if(Array.isArray(arr) && arr?.length){
        for (let index = 0; index < arr?.length; index++) {
            const element = arr[index];
            if(element.key === value) {
                return arr
            }
            if(element?.children?.length){
                return getBrotherList(value, element?.children)
            }
        }
    }
    return []
}