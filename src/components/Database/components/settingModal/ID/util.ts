export const addItem = () => {
    return {
        condition: [
            {
                terms: [{
                    column: undefined,
                    termType: undefined,
                    value: undefined,
                    type: 'and'
                }],
                matched: []
            }
        ]
    }
}

export const validatorTerms = (terms: any[]) => {
    const { column, termType, value } = terms[0]
    if (!column) {
        return '请选择条件变量'
    }

    if (!termType) {
        return '请选择运算符'
    }

    if (!['notnull', 'isnull'].includes(termType) && value === undefined) {
        return '请输入条件值'
    }

    return ''
}

export const ruleValidator = (val: any[]) => {
    if (val?.length) {
        let errorMes = ''
        val.some((item, index) => {
            const { terms, matched } = item.condition[0]
            const termsError = validatorTerms(terms)

            if (termsError) {
                errorMes = `规则 ${index+1}: ${termsError}`
                return true
            }

            if (!matched.length) {
                errorMes = `规则 ${index+1}: 请选择编码生成规则`
                return true
            } else {
                matched.some((a: any) => {
                    if (a.type === 'var') {
                        errorMes =  a.var?.length > 64 ? `规则 ${index+1}: 【常量】请输入长度在64以内的字符` : ''
                        return a.var?.length > 64
                    }
                    return false
                })
            }

            errorMes = ''
            return  false
        })

        if (errorMes) {
            return Promise.reject(errorMes)
        } else {
            return Promise.resolve()
        }
    }

    return Promise.resolve()
}
