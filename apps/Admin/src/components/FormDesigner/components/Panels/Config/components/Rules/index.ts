export const patternList = [
    {
        text: 'URL格式',
        value: "(((^https?:\\/(?:\\/\\/)?)(?:[-;:&=+\\$,\w]+@)?[A-Za-z0-9.-]+(?::\\d+)?|(?:www\\.|[-;:&=+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\\/\\[\\+~%\\/\\.\\w-_\\]*)?\\??(?:[-\\+=&;%@\\.\\w_]*)#?(?:[\\w]*))?)" //'(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$'
    },
    {
        text: '邮箱格式',
        value: '^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$'
    },
    {
        text: '数字格式',
        value: '^[0-9]+$'
    },
    {
        text: '整数格式',
        value: '^[1-9]\d*$'
    },
    {
        text: '身份证号格式',
        value: '(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)'
    },
    {
        text: '手机号格式',
        value: '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$'
    },
    {
        text: '中文格式',
        value: '^[\\u4e00-\\u9fa5]{0,}$'
    },
    {
        text: '日期格式',
        value: '^([0-9]{4})-([0-9]{2})-([0-9]{2})$'
    },
    {
        text: '时间格式',
        value: '^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$'
    },
    {
        text: '邮编格式',
        value: '^[1-9]\d{5}$'
    },
    // {
    //     text: 'IP格式',
    //     value: '^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$'
    // }
]