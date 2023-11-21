import { uid } from "./uid"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.style) {
        result.style = {}
    }
    // if (!result?.cssCode) {
    //     result.cssCode = ''
    // }
    // if (!result?.onChange) {
    //     result.onChange = ''
    // }
    // if (!result?.disabled) {
    //     result.disabled = false
    // }
    return result
}

const generatorData = (node: any) => {
    const result: any = { ...node }
    if (!result.key) {
        result.key = `${result.type}_${uid()}`
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
