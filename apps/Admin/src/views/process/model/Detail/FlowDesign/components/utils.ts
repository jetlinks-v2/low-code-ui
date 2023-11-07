import { cloneDeep } from 'lodash-es'

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
    }
    if (node.branches?.length) {
        let _res = null
        for (let i = 0; i < node.branches.length; i++) {
            _res = findNodeById(node.branches[i], id)
            if (_res) break
        }
        if (_res) return _res
    }
    if (node.children && Object.keys(node.children).length) {
        const _res = findNodeById(node.children, id)
        if (_res) return _res
    }
    return null
}

/**
 * 获取条件分支下所有节点id
 * @param branches 
 * @returns 
 */
function getBranchNodeIds(branches: any[]) {
    let branchNodeIds: string[] = []
    branches.forEach((branchNode) => {
        branchNodeIds.push(branchNode.id)
        branchNodeIds.push(branchNode.children.id)
        if (branchNode.children?.type === 'CONDITIONS' || branchNode.children?.type === 'CONCURRENTS') {
            branchNodeIds = [...branchNodeIds, ...getBranchNodeIds(branchNode.children.branches)]
        } else {
            // setEmptyNodeProps(branchNode.children)
        }
    })
    // console.log('branchNodeIds: ', branchNodeIds);
    return branchNodeIds
}
/**
 * 设置条件节点的children节点的props
 */
export function setEmptyNodeProps(nodes: any) {
    if (!nodes) return
    if (nodes.type === 'CONDITIONS') {
        const branchNodeIds: string[] = getBranchNodeIds(nodes.branches)

        nodes.children.props = {
            ...nodes.children.props,
            type: 'complex',
            complexType: 'allComplete',
            allCompleteNodeId: branchNodeIds
        }
    } else {
        setEmptyNodeProps(nodes.children)
    }
    // console.log('setEmptyNodeProps: ', nodes);
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
 * 前端筛选字段名称
 * @param list 
 * @param name 
 * @returns 
 */
export function filterFormByName(list, name) {
    // console.log('list: ', list);
    const _res = []
    list?.forEach(item => {
        const _fields = item.flattenFields || []
        const _filterFields = _fields.filter(f => {
            return f.formItemProps.label.includes(name)
        })
        if (_filterFields.length) {
            // @ts-ignore
            _res.push({
                ...item,
                flattenFields: _filterFields
            })
        }
    })
    return _res
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


/**
 * 表单字段全部默认有"读"权限, 设置formBinds字段初始值
 * @param forms 
 * @param type conditionSelect: 条件节点设置默认值, forms为接口返回的数据
 * @param oldFormBinds 根节点配置好的表单
 * @returns 
 */
export function setDefaultFormBinds(forms, type?: string, oldFormBinds?: any) {
    const res = {};
    forms?.forEach((item) => {
        const _fields = type === 'conditionSelect' ? item.flattenFields : item.fullInfo.configuration?.children
        const _key = type === 'conditionSelect' ? item.key : item.formId
        res[_key] = []
        _fields?.forEach((p) => {
            res[_key].push({
                id: p.formItemProps.name,
                required: true,
                accessModes: oldFormBinds[_key]?.find(f => f.id === p.key)?.accessModes || ['read'],
            })
        })
    })
    return res
}


/**
 * 校验是否配置成员
 * @param _
 * @param value
 */
export const isSelectMember = async (_, value) => {
    if (
        !Object.keys(value).length ||
        Object.values(value)?.every((e: any) => !e.length)
    ) {
        return Promise.reject(`请选择可参与审批的候选成员`)
    } else {
        return Promise.resolve()
    }
}

/**
 * 表单字段, 树形数据扁平化
 * @param fields 
 * @param parent 
 * @param depth 
 * @returns 
 */
export function flattenTree(fields, parent = null, depth = 0) {
    let flattened: any[] = []
    for (let field of fields) {
        field.depth = depth
        field.parent = parent
        if (field.children?.length) {
            flattened = flattened.concat(flattenTree(field.children, field, depth + 1))
        } else {
            if (!field.formItemProps.hasOwnProperty('isLayout')) flattened.push(field)
        }
    }
    return flattened
}

/**
 * 根据key更新表单字段可编辑状态
 * @param fields 表单下的所有字段
 * @param currentField 当前操作的字段
 */
export function updateFieldDisabled(fields, currentField) {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].key === currentField.key) {
            fields[i].componentProps.disabled = !currentField.accessModes.includes('write')
            return
        }
        if (fields[i].children?.length) {
            updateFieldDisabled(fields[i].children, currentField)
        }
    }
    return
}

/**
 * 处理表单数据
 * @param data 
 * @returns 
 */
export function handleFormList(data) {
    return data?.map((m) => {
        // 布局组件内部字段, 取出平铺
        let _layoutFields = cloneDeep(
            m.configuration?.children?.filter(
                (f) =>
                    f.formItemProps.hasOwnProperty('isLayout') &&
                    !f.formItemProps.isLayout,
            ),
        )
        _layoutFields = cloneDeep(flattenTree(_layoutFields))

        // 平铺字段
        const flattenFields = [
            ...m.configuration?.children?.filter(
                (f) => !f.formItemProps.hasOwnProperty('isLayout'),
            ),
            ..._layoutFields,
        ]
        // console.log('flattenFields: ', flattenFields)
        flattenFields?.forEach((p) => {
            p['accessModes'] = ['read']
        })
        return {
            ...m,
            accessModes: ['read'],
            flattenFields,
        }
    })
}