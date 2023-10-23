<!-- 基础信息配置表单 -->
<template>
  <div class="config-form">
    <j-button class="btn" @click="visible = true">
      <span>表单配置</span>
      <span class="icon" v-show="selectedRow.length">
        <img :src="getImage('/members/check.png')" />
      </span>
    </j-button>
    <!-- <ul>
      <li v-for="(item, index) of selectedRow" :key="index">
        {{ item.formName || '-' }}
      </li>
    </ul> -->
    <!-- 列表 -->
    <j-scrollbar max-height="172px">
      <j-list
        v-show="selectedRow.length"
        :grid="{ gutter: 8, column: 3 }"
        :data-source="selectedRow"
        size="small"
        :split="false"
      >
        <template #renderItem="{ item }">
          <j-list-item>
            <j-space>
              <img
                :src="
                  getImage(
                    `/flow-designer/${item.multiple ? 'list' : 'form'}.png`,
                  )
                "
                style="height: 16px"
              />
              <j-ellipsis line-clamp="1">
                {{ item.formName }}
              </j-ellipsis>
            </j-space>
          </j-list-item>
        </template>
      </j-list>
    </j-scrollbar>
    <j-drawer
      v-model:visible="visible"
      class="custom-class"
      title="表单配置"
      :closable="false"
      placement="right"
      width="50%"
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
            :request="queryForm_api"
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
                <div>{{ element.formName || '-' }}</div>
                <j-space>
                  <j-radio-group
                    v-model:value="element.multiple"
                    button-style="solid"
                  >
                    <j-space>
                      <j-radio-button :value="false">
                        <AIcon type="FormOutlined" />
                        表单
                      </j-radio-button>
                      <j-radio-button :value="true">
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
                    :disabled="selectedRow?.length === 1"
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
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import draggable from 'vuedraggable'
import { queryForm_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { getImage } from '@jetlinks/utils'

const flowStore = useFlowStore()

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:modelValue', 'change'])

const drag = ref(true)
const visible = ref(false)
const searchText = ref('')
// 选中项
const selectedRow = ref<any>([])
// 是否选中
const isActive = computed(() => (key) => {
  console.log('key: ', key)
  console.log('selectedRow.value: ', selectedRow.value)
  return selectedRow.value?.map((i) => i.formId).includes(key)
})

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
/**
 * 搜索
 */
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

/**
 * 表格选中/右侧已选删除
 */
const onSelectChange = (row: any) => {
  if (row.formId) {
    // row存在formId字段, 表示为右侧删除已选
    selectedRow.value.splice(
      selectedRow.value.findIndex((item: any) => item.formId === row.formId),
      1,
    )
  } else {
    // 如果已经存在, 则不做操作
    if (selectedRow.value.some((item: any) => item.formId === row.id)) return
    // row没有formId字段, 则表示左侧表格选中
    selectedRow.value.push({
      formId: row.id,
      formName: row.name,
      multiple: false,
      // 表单完整信息: 仅供前端使用
      fullInfo: row,
    })
  }
  //   console.log('selectedRow.value: ', selectedRow.value)
}

const submit = () => {
  if (selectedRow.value?.length < 1) {
    onlyMessage('请至少选择一条数据', 'error')
    return
  } else {
    emits('update:modelValue', selectedRow.value)
    emits('change', selectedRow.value)
    visible.value = false
  }
}

watch(
  () => props.modelValue,
  () => {
    selectedRow.value = props.modelValue
  },
  { immediate: true },
)
watch(
  () => visible.value,
  (val) => {
    if (!val) submit()
  },
  { deep: true },
)
</script>
<style scoped lang="less">
:deep(.ant-table-cell) {
  padding: 0 0 5px 0 !important;
}

.active {
  background: #e5ebff;
  color: #315efb;
}
.chosen-class {
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}
.config-form {
  width: 100%;
  .btn {
    width: 100%;
    margin-bottom: 8px;
    .icon {
      position: absolute;
      top: -4px;
      right: 0;
      & > img {
        width: 20px;
        height: 20px;
      }
    }
  }

  :deep(.ant-list) {
    overflow: hidden;
    .ant-list-item {
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      background: #f6f7f9;
    }
  }
}
</style>
