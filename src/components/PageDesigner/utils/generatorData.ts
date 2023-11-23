import { uid } from "./uid"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.cssCode) {
        result.cssCode = ''
    }
    if (!result?.onChange) {
        result.onChange = ''
    }
    if (!result?.onCreated) {
        result.onCreated = ''
    }
    if (!result?.onMounted) {
        result.onMounted = ''
    }
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
