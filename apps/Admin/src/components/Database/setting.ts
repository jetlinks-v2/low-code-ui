export const defaultSetting = [
  {
    "name":"id",
    "alias":"id",
    "comment":"主键ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64,
    "updatable":false
  },
  {
    "name":"create_time",
    "alias":"createTime",
    "comment":"创建时间",
    "jdbcType":"BIGINT",
    "javaType":"Long",
    "length":64,
    "updatable":false
  },
  {
    "name":"creator_id",
    "alias":"creatorId",
    "comment":"创建人ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64,
    "updatable":false
  },
  {
    "name":"modify_time",
    "alias":"modifyTime",
    "comment":"修改时间",
    "jdbcType":"BIGINT",
    "javaType":"Long",
    "length":64
  },
  {
    "name":"modifier_id",
    "alias":"modifierId",
    "comment":"修改人ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64
  }
]

export const defaultTreeSetting = [
  {
    "name":"id",
    "alias":"id",
    "comment":"主键ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64,
    "updatable":false
  },
  {
    "name":"create_time",
    "alias":"createTime",
    "comment":"创建时间",
    "jdbcType":"BIGINT",
    "javaType":"Long",
    "length":64,
    "updatable":false
  },
  {
    "name":"creator_id",
    "alias":"creatorId",
    "comment":"创建人ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64,
    "updatable":false
  },
  {
    "name":"modify_time",
    "alias":"modifyTime",
    "comment":"修改时间",
    "jdbcType":"BIGINT",
    "javaType":"Long",
    "length":64
  },
  {
    "name":"modifier_id",
    "alias":"modifierId",
    "comment":"修改人ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64
  },
  {
    "name":"parent_id",
    "alias":"parentId",
    "comment":"上级节点ID",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":64
  },
  {
    "name":"sort_index",
    "alias":"sortIndex",
    "comment":"排序序号",
    "jdbcType":"BIGINT",
    "javaType":"Long",
    "length":64
  },
  {
    "name":"path",
    "alias":"path",
    "comment":"树目录结构",
    "jdbcType":"VARCHAR",
    "javaType":"String",
    "length":128
  },
  {
    "name":"level",
    "alias":"level",
    "comment":"树层级",
    "jdbcType":"INTEGER",
    "javaType":"Integer",
    "length":32
  }
]
