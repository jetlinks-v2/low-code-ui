import { defineStore } from 'pinia'
import { ref } from 'vue'
import { randomString } from '@jetlinks/utils'

export const useOperationButton = defineStore('operationButton', () => {
  const btnTree = ref<Record<string, any>[]>([])
  const parentKey = ref()
  /**
   * 添加按钮
   */
  const addBtn = (data: Record<string, any>) => {
    if (parentKey.value) {
      btnTree.value.forEach((item, index) => {
        if (item.key === parentKey.value) {
          item.children.push({ ...data, key: randomString(16), level: 1 })
        }
      })
    } else {
      btnTree.value.push({ ...data, key: randomString(16), level: 0 })
    }
  }

  /**
   * 编辑按钮
   */
  const editBtn = (data: Record<string, any>) => {
    console.log(data)
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
   * 修改btnTree
   */
  return {
    btnTree,
    parentKey,
    addBtn,
    editBtn,
    delBtn
  }
})
