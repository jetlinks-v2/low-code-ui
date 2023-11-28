export const getConfigList = (_type: string) => {
    const arr: any[] = []
    if (['root'].includes(unref(_type))) {
        arr.push({
            key: 'PageConfig',
            header: '页面样式',
        })
    } 
    if(!['root', 'form', 'info', 'inline-item'].includes(unref(_type))){
        arr.push({
            key: 'Base',
            header: '基础信息',
        })
    }
    if(['button'].includes(unref(_type))){
        arr.push({
            key: 'Button',
            header: '按钮配置'
        })     
    }
    if (['form'].includes(unref(_type))) {
        arr.push({
            key: 'SourceForm',
            header: '表单设置',
        })
    }
    arr.push({
        key: 'Status',
        header: '高级配置',
    })
    return [...arr]
}
