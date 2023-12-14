import { uid } from "./uid"

const handleProps = (node: any) => {
    const result: any = { ...node.componentProps }
    if (!result?.cssCode) {
        result.cssCode = ''
    }
    if (!result?.createdCode) {
        result.createdCode = ''
    }
    if (!result?.mountedCode) {
        result.mountedCode = ''
    }
    if (!result?.request) {
        result.request = {
            methods: 'post'
        }
    }
    if(['form', 'page'].includes(node.type)){
        if (!result?.source) {
            result.source = {}
        }
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
        result.children = (node?.children || [])?.map((i: any)=> {
            return generatorData(i)
        })
    }

    return result
}

export default generatorData
