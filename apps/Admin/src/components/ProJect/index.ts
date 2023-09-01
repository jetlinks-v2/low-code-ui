import { randomString } from '@jetlinks/utils'
import { cloneDeep } from "lodash-es";
import Project from './project.vue'

//key:前端菜单key,value:后端对应provider,
export const providerEnum = {
    Module:'module',
    SQL:'rdb-sql-query',
    CRUD:'rdb-crud',
    Page:'page-code',
    Function:'script',
    //前端自定义，page-code
    HtmlPage:'page-html',
    ListPage:'page-list',
    FormPage:'page-form',
}

export const providerMap={
    [providerEnum.Module]:'模块',
    [providerEnum.SQL]:'SQL',
    [providerEnum.CRUD]:'增删改查',
    [providerEnum.Page]:'页面',
    [providerEnum.HtmlPage]:'自定义html',
    [providerEnum.ListPage]:'列表页模版',
    [providerEnum.FormPage]:'表单页模版',
    [providerEnum.Function]:'函数',
}

export const providerList = Object.keys(providerMap).map(key=>({
    title:providerMap[key],
    value:key
}))

//右键操作类
export const actionMap = {
  Profile:{
    key:'Profile',
    value:'显示简介'
  },
  Add:{
    key:'Add',
    value:'新建'
  },
  Copy:{
    key:'Copy',
    value:'复制'
  },
  Paste:{
    key:'Paste',
    value:'粘贴'
  },
  Rename:{
    key:'Rename',
    value:'重命名'
  },
  Delete:{
    key:'Delete',
    value:'删除'
  },
}

//重写id
export const restId = (arr: any[]) => {
    const list = cloneDeep(arr)
    if (list && list.length === 0) return []
    return list?.map(item => {
      if (item.id) {
        item.id = randomString(16)
      }
      if (item.children) {
        item.children = restId(item.children)
      }
      return item
    })
  }

  export default Project
