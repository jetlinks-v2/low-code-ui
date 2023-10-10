/**
 * 通过节点id查找对应节点
 * @param node 
 * @param id 
 * @returns 
 */
export function findNodeById(node, id) {
    if (node.id === id) {
        return node
    } else if (node.branches?.length) {
        let _res = null
        for (let i = 0; i < node.branches.length; i++) {
            _res = findNodeById(node.branches[i], id)
            if (_res) break
        }
        if (_res) return _res
    } else if (node.children) {
        const _res = findNodeById(node.children, id)
        if (_res) return _res
    }
    return null
}

/**
 * 查找分支最后一个节点
 * @param node 
 */
export function findBranchLastNode(node) {
    return !Object.keys(node.children).length ? node : findBranchLastNode(node.children)
}

/**
 * 将数组处理为特殊字符串, 如: [node1, node2] => '[node1]&[node2]'
 * @param arr 
 * @returns 
 */
export function handleArrToStr(arr: string[] = []) {
    let str = ``
    arr.forEach(item => {
        str += `[${item}]&`
    })
    return str.slice(0, -1)
}

/**
 * 将特殊字符串处理为数组, 如: '[node1]&[node2]' => [node1, node2]
 * @param str 
 * @returns 
 */
export function handleStrToArr(str: string = '') {
    return str.replace(/\[/g, '').replace(/\]/g, '').split('&')
}