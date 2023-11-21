// 添加子组件
export const appendChildItem = (arr: any[], newData: any, parent: any) => {
    return arr.map(item => {
        let child: any[] = item?.children || []
        if (item.key === parent?.key) {
            child = [...child, newData]
            return {
                ...item,
                children: child
            }
        } else if (item.children?.length) {
            child = appendChildItem(item.children, newData, parent)
        }
        return {
            ...item,
            children: [...child]
        }
    })
}