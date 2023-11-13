import { uid } from "./uid"
import { checkIsField, generateOptions } from "./utils"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.style) {
        result.style = {}
    }
    if (!result?.cssCode) {
        result.cssCode = ''
    }
    if (!result?.onChange) {
        result.onChange = ''
    }
    if (!result?.disabled) {
        result.disabled = false
    }

    result.description = result?.description || ''
    if (checkIsField(node) && node.type !== 'switch') {
        result.style = {
            width: '100%'
        }
    }
    if (/^(select|select-card|tree-select)$/.test(node.type)) {
        result.placeholder = '请选择'
        result.source = {
            dictionary: undefined,
            type: 'dic', // 
        }
    }
    if (/^(input|textarea|input-password|input-number)$/.test(node.type)) {
        result.placeholder = '请输入'
    }
    if (/^(date-picker)$/.test(node.type)) {
        result.placeholder = '请选择日期'
        result.format = "YYYY-MM-DD"
        result.showTime = false
        result.valueFormat = "YYYY-MM-DD"
    }
    if (/^(time-picker)$/.test(node.type)) {
        result.placeholder = '请选择时间'
        result.format = "HH:mm:ss"
        result.valueFormat = "HH:mm:ss"
    }

    switch (node.type) {
        case 'input-number':
            result.max = undefined
            result.min = undefined
            result.precision = undefined
            break
        case 'select-card':
            result.options = generateOptions(3)
            result.multiple = false
            break
        case 'select':
            result.options = generateOptions(3)
            result.mode = undefined
            result.showSearch = false
            break
        case 'tree-select':
            result.treeData = [
                ...generateOptions(3),
                {
                    label: '选项4',
                    value: uid(),
                    children: generateOptions(3)
                }
            ]
            result.showSearch = false
            result.multiple = false
            result.treeCheckStrictly = false
            break
        case 'upload':
            result.listType = 'text'
            result.maxCount = 1
            result.fileSize = 2
            result.unit = 'M'
            break
        case 'geo':
            result.level = 'all'
            result.geoType = 'country'
            break
        case 'grid':
            result.inlineMax = 4
            result.rowSpan = 5
            result.colSpan = 10
            break
        case 'form':
            result.source = {
                value: undefined,
                code: ''
            }
            break
        case 'space':
            result.align = 'center'
            result.direction = 'vertical'
            break
    }

    return result
}

const handleFormItemProps = (node: any) => {
    return {
        label: node?.name,
        required: false,
        rules: [],
        name: node?.key,
        ...node?.formItemProps
    }
}

const generatorData = (node: any) => {
    const result: any = { ...node }
    if (!result.key) {
        result.key = `${result.type}_${uid()}`
    }
    if (checkIsField(result) && result.type !== 'table-item') {
        result.formItemProps = handleFormItemProps(result)
    }

    if (result.type === 'card' || result.type === 'grid' || result.type === 'space' || result.type === 'collapse' || result.type === 'tabs') {
        result.formItemProps = {
            isLayout: false
        }
    }

    result.componentProps = {
        ...handleProps(node),
        keys: [],
        visible: true,
        editable: true
    }

    if (Array.isArray(node?.children) && node?.children?.length > 0) {
        result.children = (node?.children || [])?.map(i => {
            return generatorData(i)
        })
    }

    return result
}

export default generatorData
