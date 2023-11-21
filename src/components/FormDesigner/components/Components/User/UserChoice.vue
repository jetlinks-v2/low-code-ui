<template>
  <j-modal
    visible
    title="用户选择"
    :width="1000"
    @cancel="close"
    @ok="submitData"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <j-radio-group v-model:value="sourceType" @change="changeSourceType">
      <j-radio-button value="tissue">按组织</j-radio-button>
      <j-radio-button value="role">按角色</j-radio-button>
    </j-radio-group>
    <div style="display: flex; margin-top: 20px">
      <div class="leftTree">
        <div style="display: flex">
          <j-select
            v-if="sourceType === 'role'"
            :options="[
              { label: '角色名', value: 'name' },
              { label: '分组', value: 'group' },
            ]"
            style="min-width: 90px"
            v-model:value="searchType"
          ></j-select>
          <j-input
            v-model:value="searchValue"
            :placeholder="
              sourceType === 'tissue' ? '请输入组织名称' : '请输入角色'
            "
            class="search-input"
            allowClear
            @pressEnter="search"
          >
            <template #suffix>
              <AIcon type="SearchOutlined" @click="search" />
            </template>
          </j-input>
        </div>
        <div  class="tree">
          <j-spin :spinning="loading" :delay="300">
            <j-tree
              v-if="treeData.length > 0"
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
              :tree-data="treeData"
              :height="400"
              @select="selectGroup"
            >
            <!-- 不知道为什么把v-model的提上去了就不报错了 -->
              <template #title="{ title }">
                <div class="treeItem">
                  <j-ellipsis>
                    {{ title }}
                  </j-ellipsis>
                </div>
              </template>
            </j-tree>
            <j-empty v-else description="暂无数据" />
          </j-spin>
        </div>
      </div>
      <div class="rightTable">
        <pro-search
          style="padding-bottom: 0"
          type="simple"
          :columns="columns"
          @search="handleSearch"
        ></pro-search>
        <j-pro-table
          model="TABLE"
          :columns="columns"
          :params="params"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
          }"
          :request="queryUser"
          ref="tableRef"
          class="table"
          rowKey="id"
          :rowSelection="{
            selectedRowKeys: map(_selectedRowKeys, 'id'),
            onSelect: onSelectChange,
            onSelectNone: () => (_selectedRowKeys = []),
            onSelectAll: selectAll,
            type: mode === 'multiple' ? 'checkbox' : 'radio',
          }"
        >
          <template #status="slotProps">
            <BadgeStatus
              :status="slotProps.status"
              :text="slotProps.status === 1 ? '正常' : '禁用'"
              :statusNames="{
                1: 'processing',
                2: 'error',
              }"
            ></BadgeStatus>
          </template>
        </j-pro-table>
      </div>
    </div>
  </j-modal>
</template>

<script lang="ts" setup>
import { getUserList, getRoleList, getTissue } from '@LowCode/api/form'
import { onMounted, ref, watch } from 'vue'
import { cloneDeep, map } from 'lodash-es'
import { Search as ProSearch , BadgeStatus } from '@LowCode/components/index'

const sourceType = ref('tissue')
const props = defineProps({
  selected: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['closeModal', 'selectedUser'])
const searchValue = ref()
const treeData = ref([])
const searchType = ref('name')

const loading = ref(false)
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    search: {
      type: 'select',
      options: [
        {
          label: '正常',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
    },
    scopedSlots: true,
  },
]

const params = ref({})
const selectId = ref()
const tableRef = ref()

const search = () => {
  queryTree(searchValue.value)
}

const changeSourceType = () => {
  searchValue.value = ''
  queryTree()
}

const handleSearch = (i: any) => {
  params.value = i
}

const selectedKeys: any = ref([])
const expandedKeys: any = ref([])
const _selectedRowKeys: any = ref([])

const onSelectChange = (row: any) => {
  if (props.mode !== 'multiple') {
    _selectedRowKeys.value = [row]
  } else {
    const _index = _selectedRowKeys.value?.findIndex(item => item?.id === row?.id)
    if (_index === -1) {
      _selectedRowKeys.value.push(row)
    } else {
      _selectedRowKeys.value.splice(_index, 1)
    }
  }
}

const selectAll = (_select: boolean, _: any, changeRows: any) => {
  if (_select) {
    const list = map(_selectedRowKeys.value, 'id') || []
    changeRows.map((i: any) => {
      if (!list.includes(i.id)) {
        _selectedRowKeys.value.push(i)
      }
    })
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: string[] = []
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i.id)) {
        _ids.push(i)
      }
    })
    _selectedRowKeys.value = _ids
  }
}

const dealTreeData = (tree: any) => {
  if (sourceType.value === 'tissue') {
    return tree?.map((item: any) => {
      if (item?.children) {
        return {
          title: item?.name,
          key: item?.id,
          children: dealTreeData(item.children),
        }
      } else {
        return {
          title: item?.name,
          key: item?.id,
        }
      }
    })
  } else {
    return tree?.map((item: any) => {
      return {
        title: item.groupName,
        key: item.groupId,
        disabled: true,
        children: item.roles?.map((i: any) => {
          return {
            title: i.name,
            key: i.id,
          }
        }),
      }
    })
  }
}

const queryTree = (searchValue?: any) => {
  loading.value = true
  let params
  if (searchValue) {
    params = {
      paging:false,
      sorts: [
        {name: "sortIndex", order: "asc"}
      ],
      terms: [
        {
          terms: [
            {
              column: 'name',
              value: `%${searchValue}%`,
              termType: 'like',
            },
          ],
        },
      ],
    }
  } else {
    params = {
      paging:false,
      sorts: [
        {name: "sortIndex", order: "asc"}
      ],
    }
  }
  if (sourceType.value === 'tissue') {
    getTissue(params).then((res: any) => {
      if (res.status === 200 && res.result) {
        treeData.value = dealTreeData(res.result)
        selectId.value = res.result[0]?.id
        selectedKeys.value = [res.result[0]?.id]
      }
    }).finally(()=>{
      loading.value = false
    })
  } else if (sourceType.value === 'role') {
    getRoleList(params, searchType.value === 'name' ? true : false).then(
      (res: any) => {
        if (res.status === 200 && res.result) {
          treeData.value = dealTreeData(res.result)
          selectId.value = res.result[0]?.roles?.[0]?.id
          selectedKeys.value = [res.result?.[0]?.roles?.[0]?.id]
          if(searchValue){
            const list = res.result.filter(item => item.roles?.length).map(i => i?.groupId)
            expandedKeys.value = [...list]
          } else {
            expandedKeys.value = [res.result?.[0]?.groupId]
          }
        }
      },
    ).finally(()=>{
      loading.value = false
    })
  }

}

const queryUser = async (params: any) => {
  if (selectId.value) {
    const res = await getUserList({
      ...params,
      terms: [
        ...params.terms,
        {
          terms: [
            {
              column:
                sourceType.value === 'tissue'
                  ? 'id$in-dimension$org'
                  : 'id$in-dimension$role',
              value: selectId.value,
            },
          ],
          type: 'and',
        },
      ],
    })
    if (res.status === 200) {
      return {
        code: res.status,
        result: res.result,
        status: res.status,
      }
    }
  }
  return {
    code: 200,
    result: {
      data: [],
      pageIndex: 0,
      pageSize: 0,
      total: 0,
    },
    status: 200,
  }
}

const selectGroup = (selectedKeys: any) => {
  selectId.value = selectedKeys[0]
}

const close = () => {
  emit('closeModal')
}

const submitData = () => {
  emit('selectedUser', _selectedRowKeys.value)
}

onMounted(() => {
  queryTree()
})

watch(
  () => selectId.value,
  () => {
    tableRef.value?.reload()
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => props.selected,
  (newVal) => {
    const _newValue = newVal.filter(item => {
      return item && Object.keys(item)?.length
    })
    _selectedRowKeys.value = cloneDeep(_newValue || [])
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
<style lang="less" scoped>
.leftTree {
  width: 300px;
  border-right: 1px solid #f0f0f0;
  padding: 18px 10px;
  .tree{
    margin-top: 10px;
    max-height: 400px;
    overflow-y: auto;
    .treeItem{
      max-width: 316px;
    }
  }
}

.rightTable {
  flex: 1;
}

.table {
  height: 400px;
  overflow: auto;
  min-height: auto;
}
</style>
