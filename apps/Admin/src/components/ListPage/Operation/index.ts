import type { OperationConfigTreeItem } from './type'
export const commonUseBtn = [
  { title: '新增', type: 'Add', icon: 'PlusOutlined' },
  { title: '批量导入', type: 'Import', icon: 'ImportOutlined' },
  { title: '批量删除', type: 'Delete', icon: 'DeleteOutlined' },
  { title: '批量导出', type: 'Export', icon: 'ExportOutlined' },
  { title: '查看详情', type: 'Detail', icon: 'EyeOutlined' },
  { title: '编辑', type: 'Update', icon: 'EditOutlined' },
  { title: '删除', type: 'Delete', icon: 'DeleteOutlined' },
]

export const validOperationsBtn = async (tree: OperationConfigTreeItem[]) => {
  const errorItems: any[] = [];
  const commonUseBtnNames = commonUseBtn.map((item) => item.title);

  function validate(data: OperationConfigTreeItem[]) {
    data.forEach((item) => {
      if (item.type !== 'customer') {
        if (item.type !== 'Detail') {
          if (!item.functions) {
            errorItems.push({
              key: item.key,
              errorKey: 'functions',
              message: '配置功能',
            });
          }
          if (!item.command) {
            errorItems.push({
              key: item.key,
              errorKey: 'command',
              message: '配置指令',
            });
          }
        }
        if (!item.pages && (item.type === 'Add' || item.type === 'Detail')) {
          errorItems.push({
            key: item.key,
            errorKey: 'pages',
            message: '配置调用页面',
          });
        }
      } else {
        if (commonUseBtnNames.includes(item.title)) {
          errorItems.push({
            key: item.key,
            errorKey: 'title',
            message: '与常用按钮重名',
          });
        } else if (item.title.length < 2 || item.title.length > 8) {
          errorItems.push({
            key: item.key,
            errorKey: 'title',
            message: '按钮名称长度在2-8之间',
          });
        }
      }
      if (item.children?.length) {
        validate(item.children);
      }
    });
  }
  console.log(errorItems);
  validate(tree);

  if (errorItems.length > 0) {
    throw errorItems;
  } else {
    return [];
  }
};
