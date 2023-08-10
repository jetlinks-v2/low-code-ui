import { wrapElement } from "./utils"

const generatorData = (node: any, isWrap = true, isCreateLabel = true, eachBack) => {
    const newNode = isWrap
        ? {
            type: 'inline',
            columns: [
                node
            ]
        }
        : node
    const result = wrapElement(newNode) // , !!eachBack

    if (isCreateLabel) {
        node.label = node.name
        if (/^(select|date|time)$/.test(node.type)) {
            node.options = {
                placeholder: '请选择'
            }
        }
        if (/^(input|textarea|html)$/.test(node.type)) {
            node.options = {
                placeholder: '请输入'
            }
        }
    }
    return result
}

export default generatorData