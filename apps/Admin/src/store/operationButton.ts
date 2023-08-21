import { defineStore } from 'pinia'
import { ref } from 'vue'
import { randomString } from '@jetlinks/utils'

export const useOperationButton = defineStore('operationButton', () => {
  type TreeItem = {
    title: string;
    type: string;
    icon: string;
    script: string;
    key: string;
    functions?: string;
    command?: string;
    children: TreeItem[];
    level?: number;
    pages?: string;
  }
  const btnTree = ref<TreeItem[]>([])
  const columnsTree = ref<TreeItem[]>([])
  const parentKey = ref()
  const showColumns = ref(true)
  //常用按钮
  const commonUseBtn = [
    { title: '新增', type: 'add', icon: 'PlusOutlined' },
    { title: '批量导入', type: 'import', icon: 'ImportOutlined' },
    { title: '批量删除', type: 'delete', icon: 'DeleteOutlined' },
    { title: '批量导出', type: 'export', icon: 'ExportOutlined' },
  ]
  //校验失败数组
  /**
   * 添加按钮
   */
  const addBtn = (data: TreeItem) => {
    if (parentKey.value) {
      btnTree.value.forEach((item, index) => {
        if (item.key === parentKey.value) {
          item.children?.push({ ...data, key: randomString(16), level: 1 })
        }
      })
    } else {
      btnTree.value.push({ ...data, key: randomString(16), level: 0 })
    }
  }

  /**
   * 添加列操作按钮
   */
  const addColumnsBtn = (data: TreeItem) => {
    if (parentKey.value) {
      columnsTree.value.forEach((item, index) => {
        if (item.key === parentKey.value) {
          item.children.push({ ...data, key: randomString(16), level: 1 })
        }
      })
    } else {
      columnsTree.value.push({ ...data, key: randomString(16), level: 0 })
    }
  }
  /**
   * 编辑按钮
   */
  const editBtn = (data: TreeItem) => {
    btnTree.value.forEach((item) => {
      if (item.key === data.key) {
        Object.assign(item, data)
      } else {
        item.children?.forEach((child) => {
          if (child.key === data.key) {
            Object.assign(child, data)
          }
        })
      }
    })
  }


  /**
   * 编辑列操作按钮
   */
  const editColumnsBtn = (data: TreeItem) => {
    columnsTree.value.forEach((item) => {
      if (item.key === data.key) {
        Object.assign(item, data)
      } else {
        item.children?.forEach((child) => {
          if (child.key === data.key) {
            Object.assign(child, data)
          }
        })
      }
    })
  }
  /**
   * 删除按钮
   */
  const delBtn = (key: string) => {
    btnTree.value.forEach((item) => {
      if(item.key === key) {
        btnTree.value.splice(btnTree.value.indexOf(item), 1)
      }
      if (item.children && item.children.length) {
        item.children = item.children.filter((child) => child.key !== key)
      }
    })
  }

  /**
   * 删除列操作按钮
   */
  const delColumnsBtn = (key: string) => {
    columnsTree.value.forEach((item) => {
      if(item.key === key) {
        columnsTree.value.splice(columnsTree.value.indexOf(item), 1)
      }
      if (item.children && item.children.length) {
        item.children = item.children.filter((child) => child.key !== key)
      }
    })
  }
  /**
   * 修改btnTree
   */
  return {
    btnTree,
    parentKey,
    showColumns,
    columnsTree,
    commonUseBtn,
    addBtn,
    editBtn,
    delBtn,
    addColumnsBtn,
    editColumnsBtn,
    delColumnsBtn
  }
})
