/**
 * 通过节点id查找对应节点
 * 节点存在branches[]和children{}下级关系
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
 * 通过变量id, 递归查找对应变量
 * @param vars 
 * @param id
 */
export function findVariableById(vars, id) {
    for (let i = 0; i < vars.length; i++) {
        if (vars[i].fullId === id) return vars[i]
        if (vars[i].children?.length) {
            const _res = findVariableById(vars[i].children, id)
            if (_res) return _res
        }
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
/**
 * 将对象数据里面节点id提取并处理为数组, 
 * 如: {
        "node1$eq": true,
        "node2$eq": true,
       } 
       => [node1, node2]
 * @param str 
 * @returns 
 */
export function handleObjToArr(obj: { [key: string]: boolean }) {
    const arr: string[] = []
    for (let key in obj) {
        const nodeId = key.split('$')[0]
        arr.push(nodeId)
    }
    return arr
}
/**
 * 将节点id数组处理为对象结构
 * 如: [node1, node2] 
       => {
            "node1$eq": true,
            "node2$eq": true,
          } 
 * @param str 
 * @returns 
 */
export function handleArrToObj(arr: string[] = []) {
    const obj: { [key: string]: boolean } = {}
    arr.forEach(item => {
        obj[`${item}$eq`] = true
    })
    return obj
}

/**
 * 前端筛选表单名称/字段名称/字段标识
 * @param list 
 * @param name 
 * @returns 
 */
export function filterFormByName(list, name) {
    console.log('list: ', list);
    return list?.filter(item => {
        // if (item.configuration) {
        //     item.configuration.children = filterFormByName(item.configuration.children, name)
        // }
        return item.formName.includes(name)
    })
}

/**
 * 对象求和
 * @param data 
 * @returns 
 */
export function sumValues(data: { [key: string]: number }) {
    let sum = 0;
    for (let key in data) {
        if (typeof data[key] === 'number') {
            sum += data[key];
        }
    }
    return sum;
}