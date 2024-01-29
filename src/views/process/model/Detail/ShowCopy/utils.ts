import { advancedComponents } from "../FlowDesign/components/const"

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
 * 生成随机背景色，并且保证黑色文字可读性
 */
export function generateRandomColor() {
    // Generate random values for red, green, and blue channels
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);

    // Calculate the luminance of the color
    let luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    // If the luminance is too low, adjust the color to ensure readability
    if (luminance < 0.5) {
        red = Math.floor((red + 128) / 2);
        green = Math.floor((green + 128) / 2);
        blue = Math.floor((blue + 128) / 2);
    }

    // Return the generated color
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

/**
 * 分离变量数据中的表单数据(弹窗展示), 和其他变量数据(页面展示)
 * @param treeData
 * @returns
 */
export function separateData(treeData: any[], result: { formList: any[]; otherFields: any[] }) {
    if (!result.otherFields) result.otherFields = []
    treeData.forEach(item => {
        if (item.children && item.children.length) {
            if (item.fullId === 'process.form') {
                result.formList = item.children
            } else {
                separateData(item.children, result)
            }
        } else {
            result.otherFields?.push({
                label: item.name,
                value: item.fullId,
                color: randomColor(),
                isOther: true // 非表单字段, 不能删除
            })
        }
    })
    return result
}


export const filterFormVariables = (data: any[], id: string, formItem: any) => {
  return data.some(item => {
    if (item.configuration) {
      return filterFormVariables(item.configuration?.children || [], id, formItem)
    }
    const { key, children } = item
    if (children?.length) {
      return filterFormVariables(children, id, formItem)
    }
    if (!(
        item.componentProps?.hasOwnProperty('mode') &&
        item.componentProps?.mode === 'multiple'
    ) && advancedComponents.includes(item.type)) {
        // 高级组件单选模式
        return item.componentProps?.keys?.some((s) => s.config.source === id)
    } else {
        if (item.formItemProps.name === id && item.formItemProps?.label) {
          formItem.label = item.formItemProps.label
        }
        return item.formItemProps.name === id
    }
  })
}


export const rdmRgbColor = () => {
  let arr: number[] = []
  for (let i = 0;i < 3; i++) {
    // 暖色
    arr.push(Math.floor(Math.random() * 128 + 64));
    // 亮色
    // arr.push(Math.floor(Math.random() * 128 + 128));
    // 暗色
    // arr.push(Math.floor(Math.random() * 128));
  }

  let [r, g, b] = arr;
  // 16进制颜色
  const color = `#${r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${
    b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)}`;
  return color;
}
