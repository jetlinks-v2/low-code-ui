export const getConfigList = (_type: string, obj: any, type: 'workflow' | 'low-code') => {
    const arr: any[] = []
    if (['root'].includes(unref(_type))) {
        arr.push({
            key: 'Form',
            header: '表单样式',
        })
    }

    if (!['root', 'grid-item', 'grid'].includes(unref(_type))) {
        arr.push({
            key: 'Base',
            header: '基础信息',
        })
    }

    if (
        [
            'input',
            'input-group',
            'textarea',
            'input-number',
            'input-password',
            'select-card',
            'upload',
            // 'switch',
            'tree-select',
            'select',
            'date-picker',
            'time-picker',
            'table',
            'org',
            'role',
            'user',
            'product',
            'device',
            'geo',
            'form',
            'editor',
            'number-step',
            'radio',
            'checkbox'
        ].includes(unref(_type))) {
        arr.push({
            key: 'Config',
            header: '组件属性',
        })
    }

    if (['select-card', 'tree-select', 'select', 'radio', 'checkbox'].includes(unref(_type))) {
        arr.push({
            key: 'Source',
            header: '数据来源',
        })
    }

    if (unref(_type) === 'form') {
        arr.push({
            key: 'SourceForm',
            header: '数据来源',
        })
    }

    if (unref(_type) === 'grid' || unref(_type) === 'grid-item') {
        arr.push({
            key: 'Grid',
            header: '网格配置',
        })
    }

    const list = [
        'root',
        'text',
        'input',
        'textarea',
        'input-number',
        'input-password',
        'select-card',
        'upload',
        'switch',
        'tree-select',
        'select',
        'radio',
        'checkbox',
        'date-picker',
        'time-picker',
        'table',
        'card',
        'title',
        'tabs',
        'collapse',
        'form',
        'editor',
        'number-step',
    ]
    const _list = ['geo', 'device', 'product', 'org', 'user', 'role']

    if (([...list, ..._list].includes(unref(_type)) && type === 'low-code') || [...list].includes(unref(_type)) && type === 'workflow') {
        arr.push({
            key: 'Status',
            header: '高级配置',
        })
    }
    if (_type === 'table-item' && !['table-item-index', 'table-item-actions'].includes(obj?.children?.[0]?.type)) {
        arr.push({
            key: 'Table',
            header: '组件属性',
        })
        if (['select', 'select-card', 'tree-select', 'radio', 'checkbox'].includes(obj?.children?.[0]?.type)) {
            arr.push({
                key: 'TableSource',
                header: '数据来源',
            })
        }
    }

    return [...arr]
}
