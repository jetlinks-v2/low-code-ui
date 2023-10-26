
/**
 * 生成随机背景色，并且保证黑色文字可读性
 * @returns 
 */
export function randomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    do {
        color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
    } while (isDarkColor(color))

    return color
}
/**
 * 判断是否是深色
 * @param hexColor 
 * @returns 
 */
export function isDarkColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
}

/**
 * 提取变量数据中的表单数据
 * @param treeData 
 * @returns 
 */
export function getForms(treeData: any[]) {
    // const formFields: any[] = []
    // data.forEach(item => {
    //     formFields.push({
    //         id: item.id,
    //         required: item.required,
    //         accessModes: item.accessModes
    //     })
    // })
    // return formFields

}