namespace Draft {

  export type Provider = 'rdb-crud' | 'rdb-sql-query' | 'script' | 'file' | 'page-code'

  export type Info = {
    id: string
    name: string
    /**
     * 版本号
     */
    version: string
    /**
     * 草稿id
     */
    draftId: string
    /**
     * 草稿名称
     */
    draftName: string
    /**
     * 拓展信息,如数据源等
     */
    extensions: string
    /**
     * 模块信息
     */
    modules: Module[]
    /**
     * 附加信息
     * 前端维护，存储能力创建修改时间、能力间引用关系之类的数据
     */
    others: Record<string, any>
  }

  export type Module = {
    /**
     * id
     */
    id: string
    /**
     * 名称
     */
    name: string
    /**
     * 父模块id
     */
    parentId?: string
    /**
     * 子模块
     */
    children?: Module[]
    /**
     * 后端能力
     */
    functions?: Function[]
    /**
     * 前端资源
     */
    resources?: Resource[]
    /**
     * 其他配置
     */
    others?: Record<string, any>
  }

  export type Function = {
    /**
     * id
     */
    id: string
    /**
     * 名称
     */
    name: string
    provider: Provider
    /**
     * 根据provider不同
     */
    configuration: RdbCrud | RdbSqlQuery | Script | PageCode
    others: Record<string, any>
  }

  export type Resource = {
    /**
     * id
     */
    id: string
    /**
     * 名称
     */
    name: string
    provider: Provider
    /**
     * 根据provider不同
     */
    configuration: RdbCrud | RdbSqlQuery | Script | File | PageCode
    others: Record<string, any>
  }

  export type RdbCrud = {
    /**
     * 表名
     */
    tableName: string
    /**
     * 列信息
     */
    columns: RdbCrudColumns[]
    /**
     * 关系数据相关配置
     */
    relation: Record<string, any>
    /**
     * 资产数据权限控制相关配置
     */
    asset: Record<string, any>
  }

  export type RdbCrudColumns = {
    name: string
    alias: string
    previousName: string
    /**
     * 资产数据权限控制相关配置
     */
    comment: Record<string, any>
    jdbcType:	string
    javaType:	string
    length: number
    scale: number
    validator: any
    dictionary: any
    spec: any
  }

  export type RdbSqlQuery = {
    sql: string
  }

  export type Script = {
    lang: string
    script: string
  }

  export type File = {
    url: string
  }

  export type PageCode = {
    type: 'html' | 'form' | 'list' | string
    code: string
  }

  export type Command = 'GetTypes' | 'CheckTableName' | 'GetColumns' | 'CreateScriptCompletion'
}
