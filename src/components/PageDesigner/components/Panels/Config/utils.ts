export const getConfigList = (_type: string) => {
    const arr: any[] = []
    if (['root'].includes(unref(_type))) {
        arr.push({
            key: 'PageConfig',
            header: '页面样式',
        })
    }
    if(!['root', 'inline-item', 'card-item', 'timeline-item'].includes(unref(_type))){
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
    if(['dropdown'].includes(unref(_type))) {
        arr.push({
            key: 'Dropdown',
            header: '组件配置'
        })
    }

    if (['form'].includes(unref(_type))) {
        arr.push({
            key: 'SourceForm',
            header: '表单设置',
        })
    }

    if (['page'].includes(unref(_type))) {
        arr.push({
            key: 'SourcePage',
            header: '页面设置',
        })
    }
    
    arr.push({
        key: 'Status',
        header: '高级配置',
    })
    return [...arr]
}
