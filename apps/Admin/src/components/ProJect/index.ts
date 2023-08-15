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