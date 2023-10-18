export const onEnd = (e: any, _data: any) => {
    if(e.to?.dataset?.layoutType !== 'filed-item'){
        if(e.items?.length){
            _data.setSelection('root')
        } else {
            _data.setSelection(e.item?._underlying_vm_ || 'root')
        }
    }
}