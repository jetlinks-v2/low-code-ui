<template>
  <div>
    <j-button @click="handleClick" style="width: 200px">表单配置</j-button>
    <ul>
      <li v-for="item of selectedRow">
        {{ item }}
      </li>
    </ul>
    <j-drawer
      v-model:visible="visible"
      class="custom-class"
      title="表单配置"
      :closable="false"
      placement="right"
      width="50%"
      @close="submit"
      :contentWrapperStyle="{
        // width: 'auto',
        minWidth: '50%',
        maxWidth: '66.6%',
      }"
      :footerStyle="{ textAlign: 'right' }"
    >
      <j-row :gutter="[16, 16]">
        <j-col :span="24">
          <div>选择多个流程表单时将以流程表单名称隔开拼接整合为新表单</div>
        </j-col>
        <j-col :span="12">
          <j-input-search
            v-model:value="searchText"
            placeholder="搜索流程表单名称"
            @search="onSearch"
          />
          <JProTable
            ref="tableRef"
            model="list"
            size="small"
            :showHeader="false"
            :columns="columns"
            :params="params"
            :request="query"
            :gridColumn="3"
            :defaultParams="{
              sorts: [{ name: 'createTime', order: 'desc' }],
            }"
          >
            <template #name="slotProps">
              <div
                style="padding: 10px"
                :class="{ active: isActive(slotProps.id) }"
                @click="onSelectChange(slotProps)"
              >
                {{ slotProps.name }}
              </div>
            </template>
          </JProTable>
        </j-col>
        <j-col :span="12">
          <div>请配置表单展示样式</div>
          <draggable
            v-model="selectedRow"
            handle=".sort"
            group="form"
            animation="500"
            chosen-class="chosen-class"
            @start="drag = true"
            @end="drag = false"
            item-key="id"
          >
            <template #item="{ element }">
              <div>
                <div>{{ element.name }}</div>
                <j-space>
                  <j-radio-group
                    v-model:value="element.value1"
                    button-style="solid"
                  >
                    <j-space>
                      <j-radio-button value="form">
                        <AIcon type="FormOutlined" />
                        表单
                      </j-radio-button>
                      <j-radio-button value="list">
                        <AIcon type="OrderedListOutlined" />
                        列表
                      </j-radio-button>
                    </j-space>
                  </j-radio-group>
                  <j-button type="link" @click="onSelectChange(element)"
                    >删除</j-button
                  >
                  <j-button
                    class="sort"
                    type="link"
                    :disabled="selectedRow.length === 1"
                  >
                    <!-- <AIcon type="DragOutlined" /> -->
                    移动
                  </j-button>
                </j-space>
              </div>
            </template>
          </draggable>
        </j-col>
      </j-row>

      <template #footer>
        <j-space>
          <j-button @click="close">取消</j-button>
          <j-button type="primary" @click="submit">确认</j-button>
        </j-space>
      </template>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import draggable from 'vuedraggable'

const props = defineProps<{
  modelValue: any
}>()
const emits = defineEmits(['update:modelValue', 'change'])

const drag = ref(true)
const moveable = (flag) => {
  console.log(`output->1`, 1)
  drag.value = flag
}

const handleClick = () => {
  visible.value = true
}
const drawerState = reactive({
  visible: false,
  close: () => {
    selectedRow.value = []
    drawerState.visible = false
  },
  /**
   * 保存数据
   */
  submit: () => {
    if (selectedRow.value.length < 1) {
      onlyMessage('请至少选择一条数据', 'error')
      return
    } else {
      emits('update:modelValue', selectedRow.value)
      emits('change', selectedRow.value)
      drawerState.visible = false
    }
  },
})
const { visible, close, submit } = toRefs(drawerState)

const searchText = ref('')
const onSearch = (searchValue: string) => {
  params.value = {
    terms: [
      {
        type: 'or',
        value: `%${searchValue}%`,
        termType: 'like',
        column: 'name',
      },
    ],
  }
}

const params = ref<any>({})
const columns = [
  {
    title: '流程名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    scopedSlots: true,
  },
]
const query = (params) => {
  return new Promise<any>((resolve, reject) => {
    resolve({
      result: {
        data: [
          {
            id: 1,
            name: '表单1',
            value1: 'form',
            createTime: '2021-05-11 16:11:11',
          },
          {
            id: 2,
            name: '表单2',
            createTime: '2021-05-11 16:11:11',
          },
          {
            id: 3,
            name: '表单3',
            createTime: '2021-05-11 16:11:11',
          },
        ],
        pageIndex: 0,
        pageSize: 12,
        total: 40,
      },
      status: 200,
    })
  })
}

// 是否选中
const isActive = computed(() => (key) => {
  return selectedRow.value.map((i) => i.id).includes(key)
})
// 选中项
const selectedRow = ref<any>([])
/**
 * 选中
 */
const onSelectChange = (row: any) => {
  if (isActive.value(row.id)) {
    selectedRow.value = selectedRow.value.filter(
      (item: any) => item.id !== row.id,
    )
  } else {
    selectedRow.value.push(row)
  }
}

watch(
  () => props.modelValue,
  () => {
    selectedRow.value = props.modelValue
  },
  { immediate: true },
)
</script>
<style scoped lang="less">
:deep(.ant-table-cell) {
  padding: 0 0 5px 0 !important;
}
.active {
  background: #1890ff;
}
.chosen-class {
  // background: #1890ff;
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}
</style>
