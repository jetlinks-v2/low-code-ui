import { uid } from "./uid"
import { checkIsField } from "./utils"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.style) {
        result.style = {}
    }
    if (checkIsField(node) && node.type !== 'switch') {
        result.style = {
            width: '100%'
        }
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
            result.description = result?.description || ''
            break
        case 'textarea':
            result.maxLength = result?.maxLength || 200
            result.description = result?.description || ''
            break
        case 'input-password':
            result.maxLength = result?.maxLength || 64
    }
    return result
}

const generatorData = (node: any) => {
    const result: any = { ...node, visible: true }
    if (!result.key) {
        result.key = `${result.type}_${uid()}`
    }
    if (checkIsField(result)) {
        result.label = result?.name
        result.formItemProps = {
            name: '',
            required: false,
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