import { uid } from "./uid"
import { checkIsField, generateOptions } from "./utils"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.style) {
        result.style = {}
    }
    if (checkIsField(node) && node.type !== 'switch') {
        result.style = {
            width: '100%'
        }
        result.description = result?.description || ''
    }
    if (!result?.placeholder) {
        if (/^(select)$/.test(node.type)) {
            result.placeholder = '请选择'
        }
        if (/^(input|textarea|input-password)$/.test(node.type)) {
            result.placeholder = '请输入'
        }
    }

    switch (node.type) {
        case 'input':
            result.maxLength = result?.maxLength || 64
            break
        case 'textarea':
            result.maxLength = result?.maxLength || 200
            break
        case 'input-password':
            result.maxLength = result?.maxLength || 64
            break
        case 'input-number':
            result.max = result?.max || Infinity
            result.min = result?.min || Infinity
            result.precision = result?.precision || 2
            break
        case 'select-card':
            result.options = generateOptions(3)
            result.mode = ''
            break
        case 'select':
            result.options = generateOptions(3)
            result.mode = ''
            break
        case 'tree-select':
            result.treeData = generateOptions(3)
            result.showSearch = false
            result.mode = ''
            result.treeCheckStrictly = false
            break
    }
    return result
}

const generatorData = (node: any) => {
    const result: any = { ...node, visible: true, editable: true }
    if (!result.key) {
        result.key = `${result.type}_${uid()}`
    }
    if (checkIsField(result)) {
        result.formItemProps = {
            name: '',
            label: result?.name,
            required: false,
            rules: [],
            ...result?.formItemProps
        }
    }
    result.componentProps = handleProps(node)

    if (Array.isArray(node?.children) && node?.children?.length > 0) {
        result.children = (node?.children || [])?.map(i => {
            return generatorData(i)
        })
    }

    return result
}

export default generatorData