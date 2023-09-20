<template>
  <j-modal
    visible
    title="用户选择"
    :width="1000"
    @cancel="close"
    @ok="submitData"
  >
    <j-radio-group v-model:value="sourceType" @change="changeSourceType">
      <a-radio-button value="tissue">按组织</a-radio-button>
      <a-radio-button value="role">按角色</a-radio-button>
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
        <div style="margin-top: 10px">
          <j-spin :spinning="loading" :delay="300">
            <j-tree
              v-if="treeData.length > 0"
              :tree-data="treeData"
              @select="selectGroup"
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
            ></j-tree>
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
            selectedRowKeys: _selectedRowKeys,
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
import { getDepartmentList_api } from '@/api/user'
import { getUserList, getRoleList, getTissue } from '@/api/form'
import { onMounted, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'

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

const onSelectChange = (row: any, _select: boolean) => {
  if (props.mode !== 'multiple') {
    _selectedRowKeys.value = [row.id]
  } else {
    const arr: any = new Set(_selectedRowKeys.value)
    if (_select) {
      arr.add(row.id)
    } else {
      arr.delete(row.id)
    }
    _selectedRowKeys.value = [...arr.values()]
  }
}

const selectAll = (_select: boolean, _: any, changeRows: any) => {
  if (_select) {
    const list = cloneDeep(_selectedRowKeys.value) || []
    changeRows.map((i: any) => {
      if (!list.includes(i.id)) {
        list.push(i.id)
      }
    })
    _selectedRowKeys.value = list
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: string[] = []
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i)) {
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
      sorts: [
        {
          name: 'createTime',
          order: 'desc',
        },
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
      sorts: [
        {
          name: 'createTime',
          order: 'desc',
        },
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
    })
  } else if (sourceType.value === 'role') {
    getRoleList(params, searchType.value === 'name' ? true : false).then(
      (res: any) => {
        if (res.status === 200 && res.result) {
          treeData.value = dealTreeData(res.result)
          selectId.value = res.result[0]?.roles[0]?.id
          selectedKeys.value = [res.result[0]?.roles[0]?.id]
          expandedKeys.value = [res.result[0]?.groupId]
        }
      },
    )
  }
  loading.value = false
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
                  ? 'id$in-dimension$org$not'
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
    _selectedRowKeys.value = newVal || []
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
<style lang="less" scoped>
.leftTree {
  flex: 1;
  border-right: 1px solid #d9d9d9;
  padding: 18px 10px;
}

.rightTable {
  flex: 2;
}

.table {
  height: 400px;
  overflow: auto;
  min-height: auto;
}
</style>