<!-- 基础信息配置表单 -->
<template>
  <div class="config-form">
    <j-button class="btn" @click="visible = true">
      <span>表单配置</span>
      <span class="icon" v-show="selectedRow.length">
        <img :src="getImage('/members/check.png')" />
      </span>
    </j-button>
    <!-- 已选表单回显 -->
    <div class="selected-form">
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
              <div
                class="preview-item-box"
                :class="{ 'is-delete': item.isDelete }"
              >
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
                <j-tooltip title="流程表单不存在" v-if="item.isDelete">
                  <AIcon class="delete-icon" type="WarningOutlined" />
                </j-tooltip>
              </div>
            </j-list-item>
          </template>
        </j-list>
      </j-scrollbar>
    </div>
  </div>
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
    <div class="drawer-box">
      <div class="header">
        选择多个流程表单时将以流程表单名称隔开拼接整合为新表单
      </div>
      <div class="content">
        <div class="left">
          <j-input-search
            v-model:value="searchText"
            placeholder="搜索流程表单名称"
            @search="onSearch"
            style="margin-bottom: 10px"
          />
          <!-- 表单列表 -->
          <j-scrollbar max-height="700">
            <div class="form-list">
              <j-empty v-if="!formList.length" />
              <div
                class="form-list-item"
                :class="{ active: isActive(item.key) }"
                v-for="(item, index) in formList"
                :key="index"
                @click="onSelectChange(item)"
              >
                <j-ellipsis line-clamp="1">
                  {{ item.name }}
                </j-ellipsis>
              </div>
            </div>
          </j-scrollbar>
        </div>
        <div class="right">
          <h3>请配置表单展示样式</h3>
          <j-scrollbar max-height="700">
            <draggable
              v-model="selectedRow"
              handle=".sort"
              group="form"
              animation="500"
              chosen-class="chosen-class"
              @start="drag = true"
              @end="drag = false"
              item-key="key"
            >
              <template #item="{ element }">
                <div
                  class="selected-item"
                  :class="{ 'is-delete': element.isDelete }"
                >
                  <div class="name">
                    <j-ellipsis line-clamp="1">
                      {{ element.formName }}
                    </j-ellipsis>
                  </div>
                  <div class="type">
                    <j-radio-group
                      v-model:value="element.multiple"
                      button-style="solid"
                      size="small"
                    >
                      <j-space>
                        <j-radio-button :value="false">
                          <img
                            :src="getImage(`/flow-designer/form.png`)"
                            style="height: 14px"
                          />
                          表单
                        </j-radio-button>
                        <j-radio-button :value="true">
                          <img
                            :src="getImage(`/flow-designer/list.png`)"
                            style="height: 14px"
                          />
                          列表
                        </j-radio-button>
                      </j-space>
                    </j-radio-group>
                  </div>
                  <div class="opt">
                    <PermissionButton
                      size="small"
                      type="link"
                      danger
                      :popConfirm="{
                        title: `确认删除？`,
                        onConfirm: () => onSelectChange(element),
                      }"
                    >
                      <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                    <PermissionButton
                      size="small"
                      class="sort"
                      type="link"
                      :disabled="selectedRow?.length === 1"
                    >
                      <AIcon type="HolderOutlined" />
                    </PermissionButton>
                  </div>
                </div>
              </template>
            </draggable>
          </j-scrollbar>
        </div>
      </div>
    </div>
  </j-drawer>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import draggable from 'vuedraggable'
import { queryFormNoPage_api } from '@/api/process/model'
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
// 表单列表
const formList = ref<any>([])
// 是否选中
const isActive = computed(() => (key) => {
  return selectedRow.value?.map((i) => i.formId).includes(key)
})

const params = ref<any>({
  paging: false,
  sorts: [{ name: 'createTime', order: 'desc' }],
  terms: [
    { terms: [] },
    {
      value: 'true',
      termType: 'eq',
      type: 'and',
      column: 'latest',
    },
    // 过滤未配置的表单
    {
      value: '',
      termType: 'notnull',
      column: 'configuration',
    },
    {
      value: {},
      termType: 'not',
      column: 'configuration',
    },
  ],
})

/**
 * 获取表单不分页列表
 */
const getFormList = async () => {
  const { result } = await queryFormNoPage_api(params.value)
  formList.value = result
  // 返回存在的表单的keys, 以供父级验证是否已配置表单是否存在
  return formList.value.map((m) => m.key)
}

/**
 * 搜索
 */
const onSearch = (searchValue: string) => {
  params.value.terms[0].terms = [
    {
      terms: [
        {
          type: 'or',
          value: `%${searchValue}%`,
          termType: 'like',
          column: 'name',
        },
      ],
    },
  ]
  getFormList()
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
    if (selectedRow.value.some((item: any) => item.formId === row.key)) return
    // row没有formId字段, 则表示左侧表格选中
    selectedRow.value.push({
      formId: row.key,
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
    else getFormList()
  },
  { deep: true },
)

defineExpose({
  getFormList,
})
</script>
<style scoped lang="less">
:deep(.ant-table-cell) {
  padding: 0 0 5px 0 !important;
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

  .selected-form {
    :deep(.ant-list) {
      overflow: hidden;
      .ant-list-item {
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        background: #f6f7f9;
      }
    }
    .preview-item-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.is-delete {
        color: #999;
      }
      .delete-icon {
        color: #e50012;
      }
    }
  }
}

.drawer-box {
  .header {
    margin-bottom: 10px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e0e0e0;
    .left {
      flex: 1;
      position: relative;
      padding: 15px;
      &::after {
        content: '';
        height: 100%;
        width: 1px;
        background: #e0e0e0;
        position: absolute;
        right: 0;
        top: 0;
      }
      .form-list {
        .form-list-item {
          height: 40px;
          line-height: 40px;
          border-radius: 4px;
          background: #f6f7f9;
          margin-top: 8px;
          padding-left: 8px;
          cursor: pointer;
          &.active {
            background: #e5ebff;
            color: #315efb;
          }
        }
      }
    }
    .right {
      flex: 1;
      padding: 15px;
      .selected-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f6f7f9;
        margin-bottom: 16px;
        padding: 9px 16px;
        &.is-delete {
          background: #fdebec;
          color: #e50012;
        }
        .name {
          flex: 1;
        }
        .type {
          width: 140px;
        }
        .opt {
          width: 66px;
          text-align: right;
        }
      }
    }
  }
}
</style>
