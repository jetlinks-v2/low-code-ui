import { cloneDeep, pick } from 'lodash-es'
import { advancedComponents } from './const'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

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
    } else if (nodes.type === 'CONCURRENTS') {
        nodes.children.props = {
            ...nodes.children.props,
            ...pick(nodes.props, ['type', 'complexType', 'weight'])
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
        const _node = findNodeById(flowStore.model.nodes, nodeId)
        const _parentNode = findNodeById(flowStore.model.nodes, _node.parentId)
        if (_parentNode.type === 'CONDITION') {
            // 父节点为条件节点, 直接取父节点id
            arr.push(_parentNode.id)
        } else {
            // 父节点为分支, 取唯一没有业务节点的分支节点id
            const _noChild = _parentNode.branches?.filter(f => !Object.keys(f.children).length)[0]
            arr.push(_noChild.id)
        }
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
        const _conditionNode = findNodeById(flowStore.model.nodes, item)
        let _id
        if (Object.keys(_conditionNode.children).length) {
            // 条件节点下方节点存在, 直接去第一个节点的id
            _id = _conditionNode.children.id
        } else {
            // 条件节点下方没有节点, 取整个分支下面的空节点id
            const _branchNode = findNodeById(
                flowStore.model.nodes,
                _conditionNode.props.branchBy,
            )
            _id = _branchNode.children.id
        }
        obj[`${_id}$eq`] = true
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
            if (f.formItemProps.label) {
                // 常规组件
                return f.formItemProps.label.includes(name)
            } else {
                // 布局组件没有formItemProps.label, 直接用componentProps?.name匹配
                return f.componentProps?.name?.includes(name)
            }
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
export function setDefaultFormBinds(forms, oldFormBinds?: any) {
    console.log('forms: ', forms);
    console.log('oldFormBinds: ', oldFormBinds);
    const res = {};
    forms?.forEach((item) => {
        res[item.key] = []
        item.flattenFields?.forEach((p) => {
            // res[item.key].push({
            //     id: p.formItemProps.name,
            //     required: p.formItemProps.required,
            //     accessModes: oldFormBinds ? (oldFormBinds[item.key]?.find(f => f.id === p.formItemProps.name)?.accessModes || ['read']) : ['read'],
            // })

            // 处理单选高级组件, 平铺keys至formBinds
            if (
                !(
                    p.componentProps.hasOwnProperty('mode') &&
                    p.componentProps.mode === 'multiple'
                ) &&
                advancedComponents.includes(p.type)
            ) {
                // 高级组件, 并且为单选模式时, 将componentProps.keys平铺存入formBinds
                p.componentProps.keys?.forEach((k) => {
                    res[item.key].push({
                        id: k.config.source,
                        required: p.formItemProps.required,
                        accessModes: p.accessModes,
                        ownerBy: p.formItemProps.name, // key所属高级组件, 用于回显
                    })
                })
            } else {
                res[item.key].push({
                    id: p.formItemProps.name,
                    required: p.formItemProps.required,
                    accessModes: oldFormBinds ? (oldFormBinds[item.key]?.find(f => f.id === p.formItemProps.name)?.accessModes || ['read']) : ['read'],
                })
            }
        })
    })
    console.log('res: ', res);
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
        // if (field.children?.length) {
        //     flattened = flattened.concat(flattenTree(field.children, field, depth + 1))
        // } else {
        //     // if (!field.formItemProps.hasOwnProperty('isLayout')) flattened.push(field)
        //     if (!(
        //         field.formItemProps.hasOwnProperty('isLayout') &&
        //         !field.formItemProps.isLayout
        //     )) flattened.push(field)
        // }
        if (field.formItemProps?.hasOwnProperty('isLayout') &&
            !field.formItemProps.isLayout) {
            flattened = flattened.concat(flattenTree(field.children, field, depth + 1))
        } else {
            flattened.push(field)
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
            // 设置布局组件禁用状态
            fields[i].componentProps.disabled = !currentField.accessModes.includes('write')
            // 设置布局组件内部组件禁用状态
            fields[i].children?.forEach(item => {
                item.componentProps.disabled = fields[i].componentProps.disabled
                item.children?.forEach(inner => {
                    inner.componentProps.disabled = fields[i].componentProps.disabled
                })
            })
            return
        }
        if (fields[i].children?.length) {
            updateFieldDisabled(fields[i].children, currentField)
        }
    }
    return
}

/**
 * 处理表单数据, 用于变量查询接口参数数据结构处理
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
                (f) => !(
                    f.formItemProps.hasOwnProperty('isLayout') &&
                    !f.formItemProps.isLayout
                ),
            ),
            ..._layoutFields,
        ]
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

/**
 * 查找所有分支节点
 */
export function findBranches(nodes, result: any[] = []) {
    if (nodes.type === 'CONDITIONS') {
        result.push(nodes)
    }
    if (nodes.branches?.length) {
        for (let i = 0; i < nodes.branches.length; i++) {
            findBranches(nodes.branches[i], result)
        }
    }
    if (nodes.children && Object.keys(nodes.children).length) {
        findBranches(nodes.children, result)
    }
    return result
}
