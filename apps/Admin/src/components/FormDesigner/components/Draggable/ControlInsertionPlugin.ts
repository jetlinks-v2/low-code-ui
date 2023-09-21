// export const onMove = (e: any, _data: any) => {
//     // resetStates()
//     // prevEl = e.related
//     // if (e.to === e.related) {
//     //     setBorder(e.related, 'drag-line-top')
//     // } else {
//     //     if (e.willInsertAfter) {
//     //         setBorder(e.related, 'drag-line-bottom')
//     //     } else {
//     //         if (getOffset(e.dragged, 'offsetTop') > getOffset(e.related, 'offsetTop')) {
//     //             setBorder(e.related, 'drag-line-top')
//     //         } else {
//     //             setBorder(e.related, 'drag-line-bottom')
//     //         }
//     //     }
//     // }
// }

export const onEnd = (e: any, _data: any) => {
    // console.log(e)  && !e.items?.length e.item?._underlying_vm_ || 
    if(e.to?.dataset?.layoutType !== 'filed-item'){
        _data.setSelection('root')
    }
}