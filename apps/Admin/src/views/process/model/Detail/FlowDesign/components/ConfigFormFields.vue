<!-- 节点-配置表单/字段 -->
<template>
  <j-button class="btn" block @click="visible = true">
    <span>配置表单内容</span>
    <!-- <span class="icon">
      <img :src="getImage('/members/check.png')" />
    </span> -->
  </j-button>
  <!-- <div v-for="(fields, index) in forms" :key="index">
    <div v-for="(field, idx) in fields">{{ field }}</div>
  </div> -->
  <j-modal
    :maskClosable="false"
    v-model:visible="visible"
    width="900px"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <template #title>
      <j-space>
        <span>请确认当前节点需要候选人办理的表单内容</span>
        <j-tooltip placement="right">
          <template #title>
            未提供“读”权限的表单子字段对当前节点的办理人加密展示
          </template>
          <AIcon type="QuestionCircleOutlined" />
        </j-tooltip>
      </j-space>
    </template>
    <j-row :gutter="20">
      <j-col :span="8">
        <j-input
          v-model:value="keywords"
          @keyup.enter="handleSearch"
          placeholder="搜索字段名称"
        >
          <template #suffix>
            <AIcon type="SearchOutlined" />
          </template>
        </j-input>
        <div class="fields-box">
          <div class="check-all">
            <j-checkbox
              v-model:checked="checkAll"
              @change="handleAllCheck"
              style="margin: 5px 0"
            >
              全部内容
            </j-checkbox>
          </div>
          <j-scrollbar height="500">
            <div v-if="loading" style="text-align: center">
              <j-spin />
            </div>
            <j-empty v-if="!filterFormList?.length" />
            <j-collapse v-model:activeKey="collapseActive" :bordered="false">
              <template #expandIcon="{ isActive }">
                <AIcon type="CaretRightOutlined" v-show="!isActive" />
                <AIcon type="CaretDownOutlined" v-show="isActive" />
              </template>
              <j-collapse-panel
                v-for="(form, index) in filterFormList"
                :key="index"
              >
                <template #header>
                  <div class="form-title">
                    <div class="name">
                      <j-ellipsis line-clamp="1">
                        {{ form.name }}
                      </j-ellipsis>
                    </div>
                    <div class="permission">
                      <j-checkbox-group
                        v-model:value="form.accessModes"
                        :options="permissions"
                        @change="handleFormCheck(form)"
                        @click="(event) => event.stopPropagation()"
                      />
                    </div>
                  </div>
                </template>
                <div
                  class="form-fields"
                  v-for="(field, idx) in form.configuration?.children?.filter(
                    (f) => !unDisplayFieldsType.includes(f.type),
                  )"
                  :key="'field' + idx"
                >
                  <div class="field-title">
                    <div class="name">
                      <j-ellipsis line-clamp="1">
                        {{ field.formItemProps?.label }}
                      </j-ellipsis>
                    </div>
                    <div class="permission">
                      <j-checkbox-group
                        v-model:value="field.accessModes"
                        :options="permissions"
                        @change="handleFieldCheck(form, field)"
                      />
                    </div>
                  </div>
                </div>
              </j-collapse-panel>
            </j-collapse>
          </j-scrollbar>
        </div>
      </j-col>
      <j-col :span="16">
        <h1 class="preview-title">标题模板</h1>
        <div class="preview-box">
          <j-scrollbar height="525">
            <div
              class="preview-item"
              v-for="(item, index) in previewData"
              :key="index"
            >
              <div class="name">
                <img
                  :src="getImage(`/flow-designer/preview-form.png`)"
                  style="height: 16px"
                />
                <span>{{ item.name }}</span>
              </div>
              <FormPreview v-if="!item.multiple" :data="item.configuration" />
              <TableFormPreview
                v-model:data-source="tableData"
                :columns="
                  getTableColumns(
                    item.configuration?.children?.filter(
                      (f) => !unDisplayFieldsType.includes(f.type),
                    ),
                  )
                "
                v-else
              />
            </div>
          </j-scrollbar>
        </div>
      </j-col>
    </j-row>
  </j-modal>
</template>

<script setup lang="ts">
import { queryFormNoPage_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { filterFormByName } from './utils'
import { cloneDeep } from 'lodash-es'
import FormPreview from '@/components/FormDesigner/preview.vue'
import TableFormPreview from './TableFormPreview.vue'
import { PropType } from 'vue'
import { getImage } from '@jetlinks/utils'

const flowStore = useFlowStore()

type Emits = {
  (e: 'update:value', data: any): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
})

const collapseActive = ref([0, 1, 2, 3])
const visible = ref(false)
const forms = computed({
  get: () => props.value,
  set: (val) => emits('update:value', val),
})

const permissions = ref([
  { label: '读', value: 'read', disabled: true },
  { label: '写', value: 'write' },
])

/**
 * 获取所有表单字段数据, 不分页, 并根据forms渲染已经存在的字段权限
 */
const loading = ref(false)
const keywords = ref('')
const filterFormList = ref<any[] | undefined>([])
const allFormList = ref<any[] | undefined>([])
// 表单预览数据
const previewData = ref<any[]>([])
// 不用展示的表单字段类型: 卡片, 网格, 选项卡, 折叠面板, 弹性间距...
const unDisplayFieldsType = ref(['card', 'grid', 'tabs', 'collapse', 'space'])
const getFormList = async () => {
  // 过滤已经删除的表单
  const existForms = flowStore.model.config.forms?.filter((f) => !f.isDelete)

  // 查询预览表单参数
  const params = {
    paging: false,
    terms: [
      {
        column: 'key',
        termType: 'in',
        value: existForms?.map((m) => m.formId),
      },
      {
        column: 'latest',
        termType: 'eq',
        value: 'true',
      },
    ],
  }
  const { result } = await queryFormNoPage_api(params)
  // 左侧表单读写操作列表
  filterFormList.value = result?.map((m) => {
    const _fields = m.configuration?.children
    // 已经存在的字段
    const existFields = forms.value[m.key]
    if (existFields && existFields.length) {
      _fields?.forEach((p) => {
        const _currentField = existFields.find(
          (f) => f.id === p.formItemProps.name,
        )
        p['accessModes'] = _currentField ? _currentField.accessModes : ['read']
        // 只有"写"权限时, 表单才可编辑
        p.componentProps.disabled = !p.accessModes.includes('write')
      })

      // 如果表单下每个字段都有读写, 则表单也有读写权限
      return {
        accessModes: _fields?.every((e) => e.accessModes.length === 2)
          ? ['read', 'write']
          : ['read'],
        ...m,
      }
    } else {
      _fields?.forEach((p) => {
        p['accessModes'] = ['read']
        // 初始状态没有权限, 不可编辑
        p.componentProps.disabled = true
      })
      return { accessModes: ['read'], ...m }
    }
  })
  // 右侧预览数据
  previewData.value = result.map((m) => {
    // 过滤不需要展示的字段
    m.configuration.children = m.configuration.children?.filter(
      (f) => !unDisplayFieldsType.value.includes(f.type),
    )
    return {
      ...m,
      multiple: existForms?.find((f) => f.formId === m.key)?.multiple,
    }
  })

  // 所有表单数据, 用于前端筛选
  allFormList.value = cloneDeep(filterFormList.value)

  // 设置全部内容全选状态
  setCheckAll()
}

const handleSearch = () => {
  filterFormList.value = filterFormByName(allFormList.value, keywords.value)
}

/**
 * 全部内容勾选/取消勾选
 */
const checkAll = ref(false)
const handleAllCheck = () => {
  if (checkAll.value) {
    filterFormList.value?.forEach((item) => {
      item.accessModes = ['read', 'write']
      handleFormCheck(item)
    })
  } else {
    filterFormList.value?.forEach((item) => {
      item.accessModes = ['read']
      handleFormCheck(item)
    })
  }
}

/**
 * 设置全部内容全选状态
 */
const setCheckAll = () => {
  checkAll.value =
    filterFormList.value?.every((e) => e.accessModes.length === 2) || false
}

/**
 * 表单读写勾选/取消勾选
 */
const handleFormCheck = (form: any) => {
  const _fields = form.configuration?.children
  _fields?.forEach((p) => {
    p.accessModes = form.accessModes
    p.componentProps.disabled = !p.accessModes.includes('write')
  })
  // 设置全部内容全选状态
  setCheckAll()
}

/**
 * 字段勾选/取消"写", 自动勾选/取消"读"
 */
const handleFieldCheck = (form, field) => {
  // 字段有写权限, 必有读
  if (field.accessModes.length === 1 && field.accessModes[0] === 'write') {
    field.accessModes = ['read', 'write']
  }
  // 只有"写"权限时, 表单才可编辑
  field.componentProps.disabled = !field.accessModes.includes('write')

  // 设置表单全选状态
  form.accessModes = form.configuration?.children?.every(
    (e) => e.accessModes.length === 2,
  )
    ? ['read', 'write']
    : ['read']
  // 设置全部内容全选状态
  setCheckAll()
}

const tableData = ref<any>([{}])
const getTableColumns = (fields: any[]) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    width: 200,
    ...m,
  }))

  _columns?.forEach((item) => {
    tableData.value[0][item.dataIndex] = undefined
  })

  return _columns
}

/**
 * 确认之后, 将数据同步至父组件的basicFormData.forms
 */
const handleOk = () => {
  filterFormList.value?.forEach((item) => {
    const _fields = item.configuration?.children
    forms.value[item.key] = []
    _fields?.forEach((p) => {
      if (p.accessModes.length) {
        forms.value[item.key].push({
          id: p.formItemProps.name,
          required: true,
          accessModes: p.accessModes,
        })
      }
    })
  })
  visible.value = false
  //   console.log('forms.value: ', forms.value)
}

watch(
  () => visible.value,
  (val) => {
    if (val) getFormList()
  },
)
</script>

<style lang="less" scoped>
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

.fields-box {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 10px;
  .check-all {
    margin-bottom: 10px;
    background: #f8f8f8;
    padding-left: 10px;
  }
  .form-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    .name {
      max-width: 100px;
    }
  }
  .form-fields {
    padding-left: 30px;
    .field-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      .name {
        max-width: 100px;
      }
    }
  }
}

.preview-title {
  text-align: center;
}
.preview-box {
  background: #fafafa;
  .preview-item {
    padding: 16px;
    .name {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}

:deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
  background: #fff;
}
:deep(.ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content) {
  background-color: #fff;
}
:deep(
    .ant-collapse-borderless > .ant-collapse-item,
    .ant-collapse-borderless > .ant-collapse-item .ant-collapse-header
  ) {
  border: none;
}
:deep(.ant-collapse-borderless > .ant-collapse-item .ant-collapse-header) {
  background: #fff;
  padding: 0px 10px;
}
:deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 10px;
}
</style>
