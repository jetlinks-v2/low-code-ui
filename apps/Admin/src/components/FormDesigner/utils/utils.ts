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
    // let flag: boolean = false // false: 没错误， true: 有错误
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

export const insertCustomCssToHead = (cssCode, formId) => {
    let head = document.getElementsByTagName('head')[0]
    console.log(head, formId)
    // let oldStyle = document.getElementById('vform-custom-css')
    // if (!!oldStyle) {
    //     head.removeChild(oldStyle)  //先清除后插入！！
    // }
    // if (!!formId) {
    //     oldStyle = document.getElementById('vform-custom-css' + '-' + formId)
    //     !!oldStyle && head.removeChild(oldStyle)  //先清除后插入！！
    // }

    // let newStyle = document.createElement('style')
    // newStyle.type = 'text/css'
    // newStyle.rel = 'stylesheet'
    // newStyle.id = !!formId ? 'vform-custom-css' + '-' + formId : 'vform-custom-css'
    // try {
    //     newStyle.appendChild(document.createTextNode(cssCode))
    // } catch (ex) {
    //     newStyle.styleSheet.cssText = cssCode
    // }

    // head.appendChild(newStyle)
}