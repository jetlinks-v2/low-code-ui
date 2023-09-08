import { cloneDeep } from "lodash-es"
import { uid } from "./uid"
import generatorData from "./generatorData"

const getNodes = (node: any, key: string) => {
    const {
        context: {
            root,
            col,
            row
        }
    } = node
    let nodes = []
    if (key === 'rowspan') {
        nodes = root.context.columns[col]
    } else if (key === 'colspan') {
        nodes = root.rows[row].columns
    }
    return nodes
}

const findNode = (node, dir, key, fn) => {
    const {
        context: {
            root,
            col,
            row
        }
    } = node
    let count = key === 'rowspan' ? row : col
    let passArr = []
    const nodes = getNodes(node, key)
    const callBack = () => {
        // rowspan
        if (key === 'rowspan') {
            passArr.forEach((e: any, index) => {
                e.options.rowspan = passArr.length
                e.options.isMerged = !!index
                if (e.options.colspan > 1) {
                    const nodes = getNodes(e, 'colspan')
                    nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
                        e.options.rowspan = passArr.length
                    })
                }
                if (index) {
                    passArr[0].children = passArr[0].children.concat(e.list)
                    e.children = []
                }
            })
        } else if (key === 'colspan') {
            passArr.forEach((e, index) => {
                e.options.colspan = passArr.length
                e.options.isMerged = !!index
                if (e.options.colspan > 1) {
                    const nodes = getNodes(e, 'rowspan')
                    nodes.slice(row + 1, row + e.options.rowspan).forEach((e) => {
                        e.options.colspan = passArr.length
                    })
                }
                if (index) {
                    passArr[0].children = passArr[0].children.concat(e.children)
                    addContext(passArr[0], passArr[0].context.parent)
                    // console.log(passArr[0], passArr[0].context.parent)
                    e.children = []
                }
            })
        }
    }
    if (dir === 'after') {
        while (++count) {
            const item = nodes[count]
            if (!item) {
                fn(passArr)
                break
            }
            passArr.push(item)
            if (!item.options.isMerged) {
                if (item.options[key] > 1) {
                    const lastNode = passArr[passArr.length - 1]
                    passArr = passArr.concat(nodes.slice(lastNode.context[key.slice(0, 3)] + 1, lastNode.context[key.slice(0, 3)] + item.options[key]))
                }
                passArr.unshift(node)
                fn(passArr, callBack)
                break
            }
        }
    } else {
        while (count--) {
            const item = nodes[count]
            if (!item) {
                fn(passArr)
                break
            }
            let arr = []
            passArr.unshift(item)
            if (!item.options.isMerged) {
                if (node.options[key] > 1) {
                    findNode(passArr[0], 'after', key, (nodes) => {
                        arr = nodes
                    })
                }
                passArr.push(node)
                if (arr.length) {
                    passArr = arr
                }
                fn(passArr, callBack)
                break
            }
        }
    }
}

const onAppendItem = (node: any) => {
    let _props: any = {
        type: node.type + '-item',
        children: [],
        componentProps: {}
    };
    switch (node.type) {
        case 'grid':
            _props.componentProps = {
                span: 6,
                offset: 0,
                pull: 0,
                push: 0
            }
            break
        case 'tabs':
            _props.componentProps = {
                tab: 'Tab' + uid(6)
            }
            break
        case 'collapse':
            _props.componentProps = {
                header: 'Collapse' + uid(6)
            }
            break
        case 'table':
            _props.componentProps = {
                title: '列名' + uid(6)
            }
            _props.formItemProps = {
                name: '',
                required: false,
                rules: []
            }
            break
    }
    return _props
}

export const addContext = (node: any, parent: any, fn?: any) => {
    let arr: any[] = []
    const isArray = Array.isArray(parent)
    if (isArray) {
        arr = parent
    } else {
        arr = parent.children
    }
    fn && fn(node)
    const context = {
        updateProps(_val, key) {
            if (node?.componentProps && key) {
                node.componentProps[key] = _val
            }
        },
        copy() {
            const index = arr.indexOf(node)
            const newNode = reactive(cloneDeep(toRaw(node)))
            delete newNode.context
            newNode.key = `${newNode.type}_${uid()}`
            addContext(newNode, parent, (node) => {
                node.key = `${node.type}_${uid()}-copy`
            })
            arr.splice(index + 1, 0, newNode)
        },
        paste(_data: any) {
            const index = arr.indexOf(node)
            const newNode = reactive(cloneDeep(toRaw(_data)))
            delete newNode.context
            newNode.key = `${newNode.type}_${uid()}-paste`
            addContext(newNode, parent, (node) => {
                node.key = `${node.type}_${uid()}-paste`
            })
            arr.splice(index + 1, 0, newNode)
        },
        delete() {
            arr.splice(arr.indexOf(node), 1)
        },
        appendItem() {
            let _props = onAppendItem(node)
            if (_props) {
                const newNode = generatorData(_props)
                if (node.type === 'table') {
                    const _index = node.children?.findIndex(i => i.formItemProps?.name === 'actions')
                    if (_index === -1) {
                        node.children.push(newNode)
                    } else {
                        addContext(newNode, node)
                        node.children.splice(node.children.length - 1, 0, newNode)
                        return
                    }
                } else {
                    node.children.push(newNode)
                }
                addContext(newNode, node)
            }
        },
        appendTableAction() {
            let _props: any = {
                type: node.type + '-item',
                children: [],
                componentProps: {
                    name: '操作',
                    width: 60,
                },
                formItemProps: {
                    name: 'actions',
                    required: false,
                    rules: []
                }
            };
            if (_props) {
                const newNode = generatorData(_props)
                node.children.push(newNode)
                addContext(newNode, node)
            }
        },
        appendTableIndex() {
            let _props: any = {
                type: node.type + '-item',
                children: [],
                componentProps: {
                    title: '索引',
                    width: 60,
                },
                formItemProps: {
                    name: 'index',
                    required: false,
                    rules: []
                }
            };
            if (_props) {
                const newNode = generatorData(_props)
                addContext(newNode, node)
                node.children.splice(0, 0, newNode)
            }
        }
    }
    Object.defineProperty(node, 'context', {
        value: context,
        writable: false,
        enumerable: false,
        configurable: true
    })
    const nodes = node.children || []
    nodes.forEach(e => {
        addContext(e, node, fn)
    })
}