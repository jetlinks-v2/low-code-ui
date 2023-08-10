import dayjs from "dayjs"
import { cloneDeep } from "lodash-es"
import { wrapElement } from "./utils"
import { uid } from "./uid"


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

const findNode = (node, dir, key, fn, ignore = false) => {
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
            passArr.forEach((e, index) => {
                e.options.rowspan = passArr.length
                e.options.isMerged = !!index
                if (e.options.colspan > 1) {
                    const nodes = getNodes(e, 'colspan')
                    nodes.slice(col + 1, col + e.options.colspan).forEach((e) => {
                        e.options.rowspan = passArr.length
                    })
                }
                if (index) {
                    passArr[0].list = passArr[0].list.concat(e.list)
                    e.list = []
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
                    passArr[0].list = passArr[0].list.concat(e.list)
                    addContext(passArr[0], passArr[0].context.parent)
                    // console.log(passArr[0], passArr[0].context.parent)
                    e.list = []
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

const getValidNode = (node) => {
    const {
        context: {
            root
        }
    } = node
    const result: any[] = []
    const rows = root.rows
    for (let i0 = 0; i0 < rows.length; i0++) {
        for (let i1 = 0; i1 < rows[i0].columns.length; i1++) {
            const item: any = rows[i0].columns[i1]
            if (!item.options.isMerged) {
                result.push(item)
            }
        }
    }
    return result.filter((e) => {
        const {
            context: {
                root,
                col,
                row
            },
            options: {
                colspan,
                rowspan
            }
        } = e
        const offsetX = [col, col + (colspan > 1 ? colspan - 1 : 0)]
        const offsetY = [row, row + (rowspan > 1 ? rowspan - 1 : 0)]
        const status = node.context.col >= offsetX[0] && node.context.col <= offsetX[1] && node.context.row >= offsetY[0] && node.context.row <= offsetY[1]
        return status
    })[0]
}

const getNodeRange = (node: any) => {
    const {
        context: {
            root,
            col,
            row
        },
        options: {
            rowspan,
            colspan
        }
    } = node
    let count = row
    const result = []
    while (count < row + rowspan) {
        result.push([...root.rows[count].columns.slice(col, col + colspan)])
        count++
    }
    return result
}

const appendNodes = (node: any, dir: string, key: string) => {
    const {
        context: {
            root,
            col,
            row
        },
        options: {
            colspan,
            rowspan
        }
    } = node
    let index = -1
    let nodes = []
    if (dir === 'before') {
        if (key === 'colspan') {
            index = col
            if (index !== 0) {
                nodes = root.context.columns[index - 1]
            } else {
                nodes = root.context.columns[0]
            }
        } else {
            index = row
            if (index !== 0) {
                nodes = root.rows[index - 1].columns
            }
        }
    } else {
        if (key === 'colspan') {
            if (node.options.colspan > 1) {
                index = col + colspan - 1
            } else {
                index = col
            }
            nodes = root.context.columns[index]
        } else {
            if (node.options.rowspan > 1) {
                index = row + rowspan - 1
            } else {
                index = row
            }
            nodes = root.rows[index].columns
        }
    }
    if (key === 'colspan') {
        nodes.forEach((e: any) => {
            const newNode = wrapElement({
                type: 'td',
                options: {
                    colspan: 1,
                    rowspan: 1,
                    isMerged: false
                },
                list: [],
                style: {}
            })
            e.context.parent.columns.splice(dir === 'before' ? index : index + 1, 0, newNode)
            addContext(e.context.parent, root)
            if (!(index === 0 && dir === 'before')) {
                const validNode = getValidNode(e)
                const ranges = getNodeRange(validNode)
                const {
                    status,
                    x,
                    y
                } = checkStatus(ranges, e, 'colspan')
                if (/[1, 2]/.test(status)) {
                    newNode.options.isMerged = true
                    ranges[y].forEach(e => {
                        e.options.colspan = newNode.options.colspan = ranges[y].length + (y === 0 ? 1 : 0)
                        newNode.options.rowspan = e.options.rowspan
                    })
                }
            }
        })
    } else {
        const arr = nodes.map((e) => {
            const validNode = getValidNode(e)
            const ranges = getNodeRange(validNode)
            return {
                ...checkStatus(ranges, e, 'rowspan'),
                ranges
            }
        })
        const tr = wrapElement({
            type: 'tr',
            columns: Array.from(Array(node.context.parent.columns.length), (e, i0) => {
                const newNode = {
                    type: 'td',
                    options: {
                        colspan: 1,
                        rowspan: 1,
                        isMerged: false
                    },
                    list: [],
                    style: {}
                }
                if (index !== 0) {
                    const {
                        status,
                        ranges
                    } = arr[i0]
                    if (/[1, 2]/.test(status)) {
                        newNode.options.isMerged = true
                        for (let i0 = 0; i0 < ranges.length; i0++) {
                            for (let i1 = 0; i1 < ranges[i0].length; i1++) {
                                if (i1 === 0) {
                                    ranges[i0].forEach(e => {
                                        e.options.rowspan = newNode.options.rowspan = ranges.length + 1
                                        newNode.options.colspan = e.options.colspan
                                    })
                                }
                            }
                        }
                    }
                }
                return newNode
            })
        })
        root.rows.splice(dir === 'before' ? index : index + 1, 0, tr)
        root.rows.forEach((item) => {
            addContext(item, root)
        })
    }
}

export const addContext = (node: any, parent: any, fn?: any) => {
    let arr: any[] = []
    const isArray = Array.isArray(parent)
    if (isArray) {
        arr = parent
    } else {
        arr = parent.columns || parent.list || parent.rows
    }
    fn && fn(node)
    const context = {
        get props() {
            return () => computed(() => {
                const {
                    options
                } = node
                const result: any = {
                    disabled: options.disabled,
                    placeholder: options.placeholder,
                    clearable: options.clearable,
                    required: options.required
                }

                switch (node.type) {
                    case 'input':
                        if (options.isShowWordLimit) {
                            result.maxLength = options.max
                            result['show-word-limit'] = options.isShowWordLimit
                        }
                        result.showPassword = options.showPassword
                        result.prepend = options.prepend
                        result.append = options.append
                        break
                    case 'textarea':
                        result.type = 'textarea'
                        result.rows = options.rows
                        break
                    case 'number':
                        result.controls = options.controls
                        if (options.controls) {
                            result['controls-position'] = options.controlsPosition ? 'right' : ''
                        }
                        if (options.isShowWordLimit) {
                            result.min = options.min
                            result.max = options.max
                        }
                        result.step = options.step
                        result.precision = options.precision
                        break
                    case 'radio':
                    case 'checkbox':
                        break
                    case 'select':
                        break
                    case 'time':
                        result.format = options.format
                        result.valueFormat = options.valueFormat
                        break
                    case 'date':
                        result.placeholder = options.placeholder
                        result.startPlaceholder = options.startPlaceholder
                        result.endPlaceholder = options.endPlaceholder
                        result.format = options.format
                        result.type = options.type
                        result.disabledDate = (time) => {
                            const {
                                startTime,
                                endTime
                            } = options
                            const startDate = dayjs.unix(startTime)
                            const endDate = dayjs.unix(endTime)
                            const currentDate = dayjs(time)
                            const result = currentDate.isBefore(startDate) || currentDate.isAfter(endDate)
                            return result
                        }
                        break
                    case 'uploadfile':
                        result.multiple = options.multiple
                        result.action = options.action
                        result.limit = options.limit
                        result.size = options.size
                        result.accept = options.accept
                        break
                }
                return result
            })
        },
        get row() {
            let result: any = ''
            if (isArray || node.type === 'tr') {
                result = arr.indexOf(node)
            } else {
                result = parent.context.row
            }
            return result
        },
        get col() {
            let result: any = ''
            if (isArray) {
                result = 0
            } else {
                if (parent.type === 'grid' || parent.type === 'tr' || parent.type === 'td' || parent.type === 'col' || parent.type === 'tabsCol' || parent.type === 'collapseCol') {
                    result = arr.indexOf(node)
                } else {
                    result = parent.context.col
                }
            }
            return result
        },
        get root() {
            let result = {}
            switch (node.type) {
                case 'grid':
                case 'table':
                    result = node
                    break
                default:
                    result = parent.context.root
            }
            return result
        },
        state: node,
        parent,
        get parents() {
            const result: any = []
            let cursor = node
            while (cursor) {
                result.unshift(cursor)
                if (cursor.context.parent && !Array.isArray(cursor.context.parent)) {
                    cursor = cursor.context.parent
                } else {
                    cursor = ''
                }
            }
            return result
        },
        copy() {
            const index = arr.indexOf(node)
            const newNode = reactive(cloneDeep(toRaw(node)))
            delete newNode.context
            newNode.id = uid()
            newNode.key = `${newNode.type}_${newNode.id}`
            addContext(newNode, parent, (node) => {
                node.id = uid()
                node.key = `${node.type}_${node.id}-copy`
            })
            arr.splice(index + 1, 0, newNode)
        },
        delete() {
            arr.splice(arr.indexOf(node), 1)
        },
        appendCol() {
            const newNode = wrapElement({
                options: {
                    span: 6,
                    offset: 0,
                    pull: 0,
                    push: 0
                },
                type: 'col',
                list: [
                ]
            })
            node.columns.push(newNode)
            addContext(newNode, node)
        },
        get columns() {
            const result: any[] = []
            switch (node.type) {
                case 'table':
                    node.rows.forEach((item0, index0) => {
                        item0.columns.forEach((item1, index1) => {
                            if (!index0) {
                                result.push([])
                            }
                            result[index1].push(item1)
                        })
                    })
                    break
                default:
            }
            return result
        },
        get isDisableMargeLeft() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = root.rows[row].columns
            let result = col <= 0
            if (!result) {
                let onOff = true
                findNode(node, 'before', 'colspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.rowspan === node.options.rowspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeRight() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = root.rows[row].columns
            let result = col >= nodes.length - 1
            if (!result) {
                let onOff = true
                findNode(node, 'after', 'colspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.rowspan === node.options.rowspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeRow() {
            const nodes = getNodes(node, 'colspan')
            return this.isDisableDelRow || nodes.length === node.options.colspan
        },
        get isDisableMargeColumn() {
            const nodes = getNodes(node, 'rowspan')
            return this.isDisableDelColumn || nodes.length === node.options.rowspan
        },
        get isDisableMargeBottom() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const columns = root.context.columns
            let result = row >= columns[col].length - 1
            if (!result) {
                let onOff = true
                findNode(node, 'after', 'rowspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.colspan === node.options.colspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableMargeTop() {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const columns = root.context.columns
            let result = row <= 0
            if (!result) {
                let onOff = true
                findNode(node, 'before', 'rowspan', (nodes) => {
                    onOff = result = !nodes.every(e => e.options.colspan === node.options.colspan) || nodes.every(e => e.options.isMerged)
                })
                result = onOff
            }
            return result
        },
        get isDisableSplitColumn() {
            return node.options.colspan === 1
        },
        get isDisableSplitRow() {
            return node.options.rowspan === 1
        },
        get isDisableDelRow() {
            const nodes = getNodes(node, 'colspan')
            const rowspanNodes = getNodes(node, 'rowspan')
            return (rowspanNodes.length === 1 || rowspanNodes.filter(e => !e.options.isMerged).length === 1) || !nodes.every(e => e.options.rowspan === node.options.rowspan)
        },
        get isDisableDelColumn() {
            const nodes = getNodes(node, 'rowspan')
            const colspanNodes = getNodes(node, 'colspan')
            return (colspanNodes.length === 1 || colspanNodes.filter(e => !e.options.isMerged).length === 1) || !nodes.every(e => e.options.colspan === node.options.colspan)
        },
        merge(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            switch (type) {
                case 'left':
                    findNode(node, 'before', 'colspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'right':
                    findNode(node, 'after', 'colspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'top':
                    findNode(node, 'before', 'rowspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'bottom':
                    findNode(node, 'after', 'rowspan', (nodes, callBack) => {
                        callBack()
                    })
                    break
                case 'row':
                    while (root.rows[row].columns.length > root.rows[row].columns[0].options.colspan) {
                        findNode(root.rows[row].columns[0], 'after', 'colspan', (nodes, callBack) => {
                            callBack()
                        })
                    }
                    break
                case 'column':
                    while (root.context.columns[col].length > root.context.columns[col][0].options.rowspan) {
                        findNode(root.context.columns[col][0], 'after', 'rowspan', (nodes, callBack) => {
                            callBack()
                        })
                    }
                    break
                default:
            }
        },
        insert(type) {
            switch (type) {
                case 'left':
                    appendNodes(node, 'before', 'colspan')
                    break
                case 'right':
                    appendNodes(node, 'after', 'colspan')
                    break
                case 'top':
                    appendNodes(node, 'before', 'rowspan')
                    break
                case 'bottom':
                    appendNodes(node, 'after', 'rowspan')
                    break
            }
        },
        split(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = getNodes(node, type === 'column' ? 'colspan' : 'rowspan')
            switch (type) {
                case 'column':
                    //  zheliyoudu  没有考虑底层
                    nodes.slice(col, col + node.options.colspan).forEach((e: any) => {
                        e.options.colspan = 1
                        e.options.isMerged = false
                        if (e.options.rowspan > 1) {
                            const nodes = getNodes(e, 'rowspan')
                            nodes.slice(row + 1, row + e.options.rowspan).forEach((e: any) => {
                                e.options.colspan = 1
                            })
                        }
                    })
                    break
                case 'row':
                    nodes.slice(row, row + node.options.rowspan).forEach((e: any) => {
                        e.options.rowspan = 1
                        e.options.isMerged = false
                        if (e.options.colspan > 1) {
                            const nodes = getNodes(e, 'colspan')
                            nodes.slice(col + 1, col + e.options.colspan).forEach((e: any) => {
                                e.options.rowspan = 1
                            })
                        }
                    })
                    break
            }
        },
        del(type) {
            const {
                context: {
                    root,
                    col,
                    row
                }
            } = node
            const nodes = getNodes(node, type === 'column' ? 'colspan' : 'rowspan')
            // let result = false
            switch (type) {
                case 'column':
                    root.rows.forEach(e => {
                        e.columns.splice(col, node.options.colspan)
                        addContext(e, root)
                    })
                    break
                case 'row':
                    root.rows.splice(row, node.options.rowspan)
                    root.rows.forEach(e => {
                        addContext(e, root)
                    })
                    break
            }
        }
    }
    Object.defineProperty(node, 'context', {
        value: context,
        writable: false,
        enumerable: false,
        configurable: true
    })
    const nodes = node.columns || node.list || node.rows || []
    nodes.forEach(e => {
        addContext(e, node, fn)
    })
}