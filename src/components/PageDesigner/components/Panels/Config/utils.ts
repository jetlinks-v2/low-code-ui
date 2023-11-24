export const getConfigList = (_type: string) => {
    const arr: any[] = []

    if (['root'].includes(unref(_type))) {
        arr.push({
            key: 'Page',
            header: '页面样式',
        })
    } else {
        arr.push({
            key: 'Base',
            header: '基础信息',
        })
    }

    arr.push({
        key: 'Status',
        header: '高级配置',
    })
    return [...arr]
}
