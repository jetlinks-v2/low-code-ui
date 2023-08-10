import { get, isEmpty, isArray, isObject } from "lodash-es"
import { uid } from "./uid"

const fieldsRe = /^(input|textarea|number|radio|checkbox|select|time|date|rate|switch|slider|html|cascader|uploadfile|signature|region)$/

export const checkIsField = (node) => fieldsRe.test(node.type)

export const checkIdExistInLogic = (fieldId, logic) => {
    return new RegExp(`"${fieldId}"`).test(JSON.stringify(logic))
}

export const removeLogicDataById = (fieldId, logic) => {
    for (const rules of Object.values(logic)) {
        for (let i0 = 0; i0 < rules.length; i0++) {
            const conditions = get(rules[i0], 'ifRules.filters[0].conditions', [])
            for (let i1 = 0; i1 < conditions.length; i1++) {
                if (conditions[i1].property === fieldId) {
                    conditions.splice(i1--, 1)
                }
            }
            if (!conditions.length) {
                rules.splice(i0--, 1)
            }
        }
    }
    for (const key in logic) {
        if (!logic[key].length) {
            delete logic[key]
        }
    }

    for (const rules of Object.values(logic)) {
        for (let i0 = 0; i0 < rules.length; i0++) {
            const conditions = get(rules[i0], 'thenRules.filters[0].conditions', [])
            for (let i1 = 0; i1 < conditions.length; i1++) {
                for (let i2 = 0; i2 < conditions[i1].value.length; i2++) {
                    if (conditions[i1].value[i2] === fieldId) {
                        conditions[i1].value.splice(i2--, 1)
                    }
                }
                if (!conditions[i1].value.length) {
                    conditions.splice(i1--, 1)
                }
            }
            if (!conditions.length) {
                rules.splice(i0--, 1)
            }
        }
    }
    for (const key in logic) {
        if (!logic[key].length) {
            delete logic[key]
        }
    }
}

export const deepTraversal = (node, fn) => {
    fn(node)
    const nodes = node.list || node.rows || node.columns || node.children || []
    nodes.forEach(e => {
        deepTraversal(e, fn)
    })
}

export const renderFieldData = (type) => {
    const result = {
        id: uid(),
        type,
        label: '',
        list: [],
        style: {}
    }
    return result
}

export const wrapElement = (element: any, fn?: any) => {
    const result = element
    deepTraversal(result, (node) => {
        if (!node.style) {
            node.style = {}
        }
        if (!node.id) {
            node.id = uid()
        }
        if (!node.key) {
            node.key = `${node.type}_${node.id}`
        }
        // if (/^(grid|tabs|collapse|table|divider)$/.test(node.type)) {
        //     node.style = {
        //         width: '100%'
        //     }
        // }
        if (checkIsField(node)) {
            node.style = {
                width: '100%'
            }
        }
        // if (/^(tabs)$/.test(node.type)) {
        //     node.columns = new Array(3).fill('').map((e, index) => {
        //         const data = renderFieldData('tabsCol')
        //         data.label = `Tab ${index + 1}`
        //         data.options = {}
        //         return data
        //     })
        // }
        // if (/^(collapse)$/.test(node.type)) {
        //     node.columns = new Array(3).fill('').map((e, index) => {
        //         const data = renderFieldData('collapseCol')
        //         data.label = `Tab ${index + 1}`
        //         data.options = {}
        //         return data
        //     })
        // }

        fn && fn?.(node)
    })
    return result
}

// 生成多个选项
export const generateOptions = (len: number) => {
    const result: any[] = []
    while (len--) {
        result.push({
            label: 'Option',
            value: uid()
        })
    }
    return result
}

const calculateAverage = (count, total = 100) => {
    const base: number = Number((total / count).toFixed(2))
    const result: number[] = []
    for (let i = 0; i < count; i++) {
        result.push(base)
    }
    return result
}

export const syncWidthByPlatform = (node, platform, syncFullPlatform = false, value?: any) => {
    // debugger
    const _isArray = isArray(node)
    if (!_isArray) {
        if (isObject(node.style.width)) {
            if (syncFullPlatform) {
                node.style.width.pc = node.style.width.mobile = value + '%'
            } else {
                node.style.width[platform] = value + '%'
            }
        } else {
            node.style.width = value + '%'
        }
    }
    const otherNodes = _isArray ? node : node.context.parent.columns.filter(e => e !== node)
    const averageWidths = calculateAverage(otherNodes.length, _isArray ? 100 : 100 - value)
    otherNodes.forEach((node, index) => {
        // const isFieldWidth = isObject(node.style.width)
        // if (isFieldWidth) {
        //     if (syncFullPlatform) {
        //         node.style.width.pc = node.style.width.mobile = averageWidths[index] + '%'
        //     } else {
        //         node.style.width[platform] = averageWidths[index] + '%'
        //     }
        // } else {
        //     node.style.width = averageWidths[index] + '%'
        // }
    })
}