// 输入框操作符
const operatorInput = [
    {
        label: '=',
        value: 'eq',
    },
    {
        label: '!=',
        value: 'neq',
    },
    {
        label: '包含',
        value: 'like',
    },
    {
        label: '不包含',
        value: 'nlike',
    },
]
// 下拉框操作符
const operatorSelect = [
    {
        label: '=',
        value: 'eq',
    },
    {
        label: '!=',
        value: 'neq',
    },
    {
        label: '在...之中',
        value: 'in',
    },
    {
        label: '不在...之中',
        value: 'nin',
    },
]
// 开关操作符
const operatorSwitch = [
    {
        label: '=',
        value: 'eq',
    },
    {
        label: '!=',
        value: 'neq',
    }
]
// 时间操作符
const operatorDate = [
    {
        label: '>',
        value: 'gt',
    },
    {
        label: '>=',
        value: 'gte',
    },
    {
        label: '<',
        value: 'lt',
    },
    {
        label: '<=',
        value: 'lte',
    }
]

export const operatorMap = {
    default: operatorInput,
    input: operatorInput,
    password: operatorInput,
    number: operatorInput,
    textarea: operatorInput,
    select: operatorSelect,
    switch: operatorSwitch,
    date: operatorDate,
    'date-picker': operatorDate,
    'time-picker': operatorDate,
    'select-card': operatorSelect,
    'input-password': operatorInput,
    'tree-select': operatorSelect,
    'input-number': operatorInput,
    'product': operatorSelect,
    'user': operatorSelect,
    'org': operatorSelect,
    'device': operatorSelect,
    'role': operatorSelect,
    'text': operatorInput,
}

// 高级组件
export const advancedComponents = [
    'org', 'user', 'role', 'product', 'device'
]