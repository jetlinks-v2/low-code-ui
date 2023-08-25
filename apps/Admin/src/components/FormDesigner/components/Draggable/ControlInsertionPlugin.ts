import { addContext } from "../../utils/addContext";

let prevEl: any;

const clearBorder = (el) => {
    const classNames = ['top', 'bottom', 'left', 'right']
    classNames.forEach(e => {
        el.classList.remove(`drag-line-${e}`)
    })
}

const setBorder = (el, className) => {
    clearBorder(el)
    el.classList.add(className)
}

const resetStates = () => {
    if (prevEl) {
        clearBorder(prevEl)
    }
    prevEl = undefined
}

const getOffset = (el, key) => {
    let offset = 0
    let parent = el

    while (parent) {
        offset += parent[key]
        parent = parent.offsetParent
    }

    return offset
}

export const onMove = (e: any, _data: any) => {
    resetStates()
    prevEl = e.related
    if (e.to === e.related) {
        setBorder(e.related, 'drag-line-top')
    } else {
        if (e.willInsertAfter) {
            setBorder(e.related, 'drag-line-bottom')
        } else {
            if (getOffset(e.dragged, 'offsetTop') > getOffset(e.related, 'offsetTop')) {
                setBorder(e.related, 'drag-line-top')
            } else {
                setBorder(e.related, 'drag-line-bottom')
            }
        }
    }
}

export const onEnd = (e: any, _data: any) => {
    resetStates() 
    if(e.to?.dataset?.layoutType !== 'filed-item') {
        // field的数据
        // _data.addFieldData(e.item?._underlying_vm_)
        addContext(e.item?._underlying_vm_, e?.to?.__draggable_component__?.list)
        _data.setSelection(e.item._underlying_vm_)
    }
}