import { randomString } from '@jetlinks-web/utils'
import { cloneDeep } from "lodash-es";
import Project from './project.vue'
import { getImage } from '@jetlinks-web/utils'


//key:前端菜单key,value:后端对应provider,
export const providerEnum = {
  Module: 'module',
  SQL: 'rdb-sql-query',
  CRUD: 'rdb-crud',
  Page: 'page-code',
  Function: 'script',
  //前端自定义，page-code
  HtmlPage: 'page-html',
  ListPage: 'page-list',
  FormPage: 'page-form',
  PageDesign:'page-design'
}

export const providerMap = {
  [providerEnum.Module]: '模块',
  [providerEnum.SQL]: 'SQL',
  [providerEnum.CRUD]: '增删改查',
  [providerEnum.Page]: '页面',
  [providerEnum.HtmlPage]: '自定义html',
  [providerEnum.ListPage]: '标准列表页',
  [providerEnum.FormPage]: '表单页',
  [providerEnum.Function]: '函数',
  [providerEnum.PageDesign]: '页面设计器',
  'project': '项目'
}

export const providerList = Object.keys(providerMap).map(key => ({
  title: providerMap[key],
  value: key
}))

export const providerImages = {
  [providerEnum.Module]: getImage('/tree/module.svg'),
  [providerEnum.SQL]: getImage('/tree/sql.svg'),
  [providerEnum.CRUD]: getImage('/tree/curd.svg'),
  [providerEnum.Page]: getImage('/tree/page.svg'),
  [providerEnum.ListPage]: getImage('/tree/page.svg'),
  [providerEnum.HtmlPage]: getImage('/tree/page.svg'),
  [providerEnum.FormPage]: getImage('/tree/page.svg'),
  [providerEnum.Function]: getImage('/tree/function.svg'),
  [providerEnum.PageDesign]: getImage('/project/page_designer.svg'),
  'project': getImage('/tree/project.svg'),
}

export const typeImages = {
  [providerEnum.Module]: getImage('/project/module.svg'),
  [providerEnum.SQL]: getImage('/project/sql.svg'),
  [providerEnum.CRUD]: getImage('/project/curd.svg'),
  [providerEnum.ListPage]: getImage('/project/list.svg'),
  [providerEnum.HtmlPage]: getImage('/project/html.svg'),
  [providerEnum.FormPage]: getImage('/project/form.svg'),
  [providerEnum.Function]: getImage('/project/function.svg'),
  [providerEnum.PageDesign]: getImage('/project/page_designer.svg'),
  'project': getImage('/project/project.svg'),
}

export const projectList = [
  {
    title: '通用能力',
    children: [
      {
        type: providerEnum.Module,
        img: getImage('/project/module.png'),
        text: '使用模块对项目进行分层管理'
      }
    ]
  },
  {
    title: '前端资源',
    children: [
      {
        type: providerEnum.HtmlPage,
        img: getImage('/project/html.png'),
        text: '高度灵活，自由扩展定制化页面需求'
      },
      {
        type: providerEnum.ListPage,
        img: getImage('/project/list.png'),
        text: '通用页面格式，5分钟快速完成数据标准列表页配置'
      },
      {
        type: providerEnum.FormPage,
        img: getImage('/project/form.png'),
        text: '拖拽组件自定义完成表单页设计'
      },
    ]
  },
  {
    title: '后端能力',
    children: [
      {
        type: providerEnum.CRUD,
        img: getImage('/project/curd.png'),
        text: '用于管理业务数据、提供增删改查等能力'
      },
      {
        type: providerEnum.SQL,
        img: getImage('/project/sql.png'),
        text: '定制化查询能力'
      },
      {
        type: providerEnum.Function,
        img: getImage('/project/function.png'),
        text: '使用脚本自定义业务逻辑'
      }
    ]
  },
]

export const projectListMenu = [
  {
    type: providerEnum.Module,
    img: getImage('/project/module.svg'),
    text: '使用模块对项目进行分层管理'
  },
  {
    type: providerEnum.HtmlPage,
    img: getImage('/project/html.svg'),
    text: '高度灵活，自由扩展定制化页面需求'
  },
  {
    type: providerEnum.ListPage,
    img: getImage('/project/list.svg'),
    text: '通用页面格式，5分钟快速完成数据标准列表页配置'
  },
  {
    type: providerEnum.FormPage,
    img: getImage('/project/form.svg'),
    text: '拖拽组件自定义完成表单页设计'
  },
  {
    type: providerEnum.CRUD,
    img: getImage('/project/curd.svg'),
    text: '用于管理业务数据、提供增删改查等能力'
  },
  {
    type: providerEnum.SQL,
    img: getImage('/project/sql.svg'),
    text: '定制化查询能力'
  },
  {
    type: providerEnum.Function,
    img: getImage('/project/function.svg'),
    text: '使用脚本自定义业务逻辑'
  },
  {
    type: providerEnum.PageDesign,
    img: getImage('/project/page_designer.svg'),
    text: '页面设计器'
  }
]

//右键操作类
export const actionMap = {
  Profile: {
    key: 'Profile',
    value: '显示简介'
  },
  Add: {
    key: 'Add',
    value: '新建'
  },
  Copy: {
    key: 'Copy',
    value: '复制'
  },
  Paste: {
    key: 'Paste',
    value: '粘贴'
  },
  Rename: {
    key: 'Rename',
    value: '重命名'
  },
  Delete: {
    key: 'Delete',
    value: '删除'
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
