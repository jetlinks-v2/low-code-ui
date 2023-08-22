import { uid } from "./uid"
import componentMap from "./componentMap"
import { ISchema } from "../typings"
import { concat } from "lodash-es"

export const checkIsField = (node: any) => node?.type && (componentMap?.[node?.type] || ['grid', 'card', 'tabs', 'collapse'].includes(node?.type))

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

const checkKey = (obj: any, arr: string[]) => {
    return arr.filter(item => {
        return !obj?.[item] && obj?.[item] !== false
    })
}

const checkedConfigItem = (node: ISchema) => {
    const _type = node.type || 'root'
    let arr: string[] = []
    if(['input', 'textarea', 'switch', 'select'].includes(_type)) {
        arr = concat(arr, checkKey(node?.formItemProps, ['name', 'label']))
    }

    return arr.length ? {
        key: node.key,
        value: arr
    } : undefined
}

// 校验配置项必填
export const checkedConfig = (node: ISchema) => {
    const _data: any = checkedConfigItem(node);
    const _rules: any[] = []
    if (_data) {
        _rules.push(_data)
    }
    if (node.children && node.children?.length) {
        node?.children.map(item => {
            const _item = checkedConfig(item)
            if (_item) {
                _rules.push(_item)
            }
        })
    }

    return _rules
}