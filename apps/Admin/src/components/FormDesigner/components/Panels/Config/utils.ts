export const getConfigList = (_type: string) => {
    const arr: any[] = []
    if (['root'].includes(unref(_type))) {
        arr.push({
            key: 'Form',
            header: '表单样式',
        })
    }
    if (!['root'].includes(unref(_type))) {
        arr.push({
            key: 'Base',
            header: '基础信息',
        })
    }
    if (['upload'].includes(unref(_type))) {
        arr.push({
            key: 'UploadLimit',
            header: '上传限制'
        })
    }
    if (['tabs'].includes(unref(_type))) {
        arr.push({
            key: 'TabsConfig',
            header: '选项卡配置'
        })
    }
    if (['space'].includes(unref(_type))) {
        arr.push({
            key: 'Space',
            header: '弹性间距配置'
        })
    }
    if (
        ['input-password', 'input-number'].includes(
            unref(_type),
        )
    ) {
        arr.push({
            key: 'InputLimit',
            header: '输入限制',
        })
    }
    if (
        !['collapse-item', 'tabs-item', 'grid', 'card', 'tabs', 'collapse', 'space', 'root', 'text'].includes(
            unref(_type),
        )
    ) {
        arr.push({
            key: 'Rules',
            header: '校验规则',
        })
    }
    if (['select-card'].includes(unref(_type))) {
        arr.push({
            key: 'Source',
            header: '数据来源',
        })
    }
    if (
        [
            'input',
            'textarea',
            'select-card',
            'input-password',
            'switch',
            'input-number',
            'tree-select',
            'select',
            'date-picker',
            'time-picker',
            'table',
            'geo',
            'card'
        ].includes(unref(_type))
    ) {
        arr.push({
            key: 'Descriptions',
            header: '说明',
        })
    }
    if (
        [
            'root',
            'text',
            'input',
            'textarea',
            'select-card',
            'input-password',
            'switch',
            'input-number',
            'tree-select',
            'select',
            'date-picker',
            'time-picker'
        ].includes(unref(_type))
    ) {
        arr.push({
            key: 'Event',
            header: '整体配置',
        })
    }
    if (
        [
            'text',
            'input',
            'textarea',
            'select-card',
            'input-password',
            'switch',
            'input-number',
            'tree-select',
            'select',
            'date-picker',
            'time-picker',
            'table',
            'geo',
            'card'
        ].includes(unref(_type))
    ) {
        arr.push({
            key: 'Status',
            header: '状态配置',
        })
    }

    if (unref(_type) === 'grid') {
        arr.push({
            key: 'Grid',
            header: '网格配置',
        })
    }

    return [...arr]
}