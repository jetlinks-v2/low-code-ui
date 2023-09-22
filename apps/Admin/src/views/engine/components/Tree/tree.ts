//找对应节点
export const loop = (data: any[], key: string | number, callback: any) => {
    data.forEach((item, index) => {
        if (item.key === key) {
            return callback(item, index, data);
        }
        if (item.children) {
            return loop(item.children, key, callback);
        }
    });
};

