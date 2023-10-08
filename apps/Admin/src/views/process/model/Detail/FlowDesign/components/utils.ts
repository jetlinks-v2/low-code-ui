export function findDataById(node, id) {
    if (node.id === id) {
        return node
    } else if (node.branches?.length) {
        let _res = null
        for (let i = 0; i < node.branches.length; i++) {
            _res = findDataById(node.branches[i], id)
            if (_res) break
        }
        if (_res) return _res
    } else if (node.children) {
        const _res = findDataById(node.children, id)
        if (_res) return _res
    }
    return null
}