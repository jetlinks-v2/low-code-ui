import type { OperationConfigTreeItem } from './type'
export const commonUseBtn = [
  { title: '新增', type: 'Add', icon: 'PlusOutlined' },
  { title: '批量导入', type: 'Import', icon: 'ImportOutlined' },
  { title: '批量删除', type: 'Delete', icon: 'DeleteOutlined' },
  { title: '批量导出', type: 'Export', icon: 'ExportOutlined' },
  { title: '关系配置', type: 'Relation', icon: 'LinkOutlined' },
  { title: '查看详情', type: 'Detail', icon: 'EyeOutlined' },
  { title: '编辑', type: 'Update', icon: 'EditOutlined' },
  { title: '删除', type: 'Delete', icon: 'DeleteOutlined' },
]

export const validOperationsBtn = (tree: OperationConfigTreeItem[], functionOptions: any[], pages: any[]) => {
  const errorItems: any[] = [];
  const commonUseBtnNames = commonUseBtn.map((item) => item.title);

  function validate(data: OperationConfigTreeItem[]) {
    data.forEach((item) => {
      if(item.jsError?.length) {
        errorItems.push({
          key: item.key,
          errorKey: 'script',
          message: item.jsError
        })
      }
      if(item.cssError?.length) {
        errorItems.push({
          key: item.key,
          errorKey: 'style',
          message: item.cssError
        })
      }
      if (item.type !== 'customer') {
        if(['批量导入', '批量导出', '批量删除'].includes(item.title) && ['Delete', 'Export', 'Import'].includes(item.type)) {
           if(item.level == 0) {
            errorItems.push({
              key: item.key,
              errorKey: 'level',
              message: '该按钮不可以作为1级按钮使用',
            });
           }
        }
        if (item.type !== 'Detail') {
          if (!item.functions) {
            errorItems.push({
              key: item.key,
              errorKey: 'functions',
              message: '配置功能',
            });
          } else {
            const result = functionOptions.find(val => val.fullId === item.functions)
            if(!result) {
              errorItems.push({
                key: item.key,
                errorKey: 'functions',
                message: '绑定功能已被删除，请重新选择',
              });
            } else if(item.type === 'Relation') {
              if(!result?.configuration?.relation?.enabled) {
                errorItems.push({
                  key: item.key,
                  errorKey: 'functions',
                  message: '当前调用的功能未开启关系',
                });
              }
            }
          }
          if (!item.command && item.type !== 'Relation') {
            errorItems.push({
              key: item.key,
              errorKey: 'command',
              message: '配置指令',
            });
          }
        }
        if (!item.pages && (item.type === 'Add' || item.type === 'Detail' || item.type === 'Update')) {
          errorItems.push({
            key: item.key,
            errorKey: 'pages',
            message: '配置调用页面',
          });
        } else if(item.pages) {
          const result = pages.find(val => val.id == item.pages)
          if(!result) {
            errorItems.push({
              key: item.key,
              errorKey: 'pages',
              message: '绑定页面已被删除，请重新选择',
            });
          }
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
  validate(tree);

  return errorItems
};
