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
                  v-for="(field, idx) in form.flattenFields"
                  :key="'field' + idx"
                >
                  <div class="field-title">
                    <div class="name">
                      <j-ellipsis line-clamp="1">
                        {{
                          field.formItemProps?.label ||
                          field.componentProps?.name
                        }}
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
                :columns="getTableColumns(item.configuration?.children)"
                :hasRules="true"
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
import { filterFormByName, updateFieldDisabled, flattenTree } from './utils'
import { cloneDeep } from 'lodash-es'
import FormPreview from '@/components/FormDesigner/preview.vue'
import TableFormPreview from './TableFormPreview.vue'
import { PropType } from 'vue'
import { getImage } from '@jetlinks/utils'
import { advancedComponents } from './const'

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
// 左侧展示的表单
const filterFormList = ref<any[] | undefined>([])
// 所有表单数据, 用于前端筛选
const allFormList = ref<any[] | undefined>([])
// 右侧表单预览数据
const previewData = ref<any[]>([])
// 不用展示的表单字段类型: 卡片, 网格, 选项卡, 折叠面板, 弹性间距...
const unDisplayFieldsType = ref(['card', 'grid', 'tabs', 'collapse', 'space'])
// 过滤已经删除的表单
const existForms = computed(() =>
  flowStore.model.config.forms?.filter((f) => !f.isDelete),
)
const getFormList = async () => {
  const params = {
    paging: false,
    terms: [
      {
        column: 'key',
        termType: 'in',
        value: existForms.value?.map((m) => m.formId),
      },
      {
        column: 'latest',
        termType: 'eq',
        value: 'true',
      },
    ],
  }
  const { result } = await queryFormNoPage_api(params)
  // 基础信息配置的表单key, 用于节点配置表单的排序
  const _formKeys = flowStore.model.config.forms?.map((m) => m.formId)
  const _sortResult = result
    ?.map((m) => ({
      ...m,
      sort: _formKeys?.indexOf(m.key),
    }))
    .sort((a, b) => a.sort - b.sort)
  // 左侧表单读写操作列表
  filterFormList.value = _sortResult?.map((m) => {
    // 布局组件内部字段, 取出平铺
    let _layoutFields = cloneDeep(
      m.configuration?.children?.filter(
        (f) =>
          f.formItemProps.hasOwnProperty('isLayout') &&
          !f.formItemProps.isLayout,
      ),
    )
    _layoutFields = cloneDeep(flattenTree(_layoutFields))

    // 平铺字段
    const flattenFields = [
      ...m.configuration?.children?.filter(
        // (f) => !f.formItemProps.hasOwnProperty('isLayout'),
        (f) =>
          !(
            f.formItemProps.hasOwnProperty('isLayout') &&
            !f.formItemProps.isLayout
          ),
      ),
      ..._layoutFields,
    ]
    // console.log('flattenFields: ', flattenFields)

    // 已经存在的字段
    const existFields = forms.value[m.key]
    if (existFields && existFields.length) {
      flattenFields?.forEach((p) => {
        const _currentField = existFields.find((f) => {
          if (
            !(
              p.componentProps.hasOwnProperty('mode') &&
              p.componentProps.mode === 'multiple'
            ) &&
            advancedComponents.includes(p.type)
          ) {
            return p.componentProps?.keys
              ?.map((source) => source.config.source)
              ?.includes(f.id)
          } else {
            return f.id === p.formItemProps.name
          }
        })
        p['accessModes'] = _currentField ? _currentField.accessModes : ['read']
      })

      return {
        ...m,
        accessModes: flattenFields?.every((e) => e.accessModes.length === 2)
          ? ['read', 'write']
          : ['read'],
        multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
        flattenFields,
      }
    } else {
      flattenFields?.forEach((p) => {
        p['accessModes'] = ['read']
      })
      return {
        ...m,
        accessModes: ['read'],
        multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
        flattenFields,
      }
    }
  })
  allFormList.value = cloneDeep(filterFormList.value)
  //   console.log('filterFormList.value: ', filterFormList.value)
  // 右侧预览数据处理
  initPreviewData(_sortResult)
  handleSearch()
}

/**
 * 预览数据初始化状态
 * @param data
 */
const initPreviewData = (data) => {
  previewData.value = data.map((m) => {
    // m.configuration.children = m.configuration.children
    return {
      ...m,
      multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
    }
  })
  // 设置预览数据初始读写状态
  filterFormList.value?.forEach((form) => {
    form.flattenFields?.forEach((field) => {
      updatePreviewData(form, field)
    })
  })
}

const handleSearch = () => {
  filterFormList.value = filterFormByName(allFormList.value, keywords.value)
  filterFormList.value?.forEach((item) => {
    item.accessModes = item.flattenFields?.every(
      (e) => e.accessModes.length === 2,
    )
      ? ['read', 'write']
      : ['read']
  })
  setCheckAll()
}

/**
 * 设置全部内容全选状态
 */
const setCheckAll = () => {
  checkAll.value =
    filterFormList.value?.every((e) => e.accessModes.length === 2) || false
}

/**
 * 全部内容勾选/取消勾选
 */
const checkAll = ref(false)
const handleAllCheck = () => {
  filterFormList.value?.forEach((item) => {
    item.accessModes = checkAll.value ? ['read', 'write'] : ['read']
    handleFormCheck(item)
  })
}

/**
 * 表单读写勾选/取消勾选
 */
const handleFormCheck = (form: any) => {
  form.flattenFields?.forEach((p) => {
    p.accessModes = form.accessModes
    // 右侧预览数据更新
    updatePreviewData(form, p)
  })
}

/**
 * 字段勾选/取消"写", 自动勾选/取消"读"
 */
const handleFieldCheck = (form, field) => {
  // 左侧读写操作交互
  // 设置表单全选状态
  form.accessModes = form.flattenFields?.every(
    (e) => e.accessModes.length === 2,
  )
    ? ['read', 'write']
    : ['read']
  // 设置全部内容全选状态
  setCheckAll()

  // 右侧预览数据更新
  updatePreviewData(form, field)
}

/**
 * 右侧预览数据根据左侧读写权限, 实时更新可编辑状态
 */
const updatePreviewData = (form, field) => {
  previewData.value?.forEach((item) => {
    if (item.key === form.key) {
      updateFieldDisabled(item.configuration?.children, field)
    }
  })
}

const tableData = ref<any>([{}])
const getTableColumns = (fields: any[]) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    width: 200,
    ...m,
    form: {
      rules: [
        ...(m.formItemProps?.rules || []),
        { required: m.formItemProps?.required || false, message: '此项为必填' },
      ],
    },
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
    forms.value[item.key] = []
    item.flattenFields?.forEach((p) => {
      if (p.accessModes.length) {
        // 处理单选高级组件, 平铺keys至formBinds
        if (
          !(
            p.componentProps.hasOwnProperty('mode') &&
            p.componentProps.mode === 'multiple'
          ) &&
          advancedComponents.includes(p.type)
        ) {
          // 高级组件, 并且为单选模式时, 将componentProps.keys平铺存入formBinds
          p.componentProps.keys?.forEach((k) => {
            forms.value[item.key].push({
              id: k.config.source,
              required: p.formItemProps.required || false,
              accessModes: p.accessModes || ['read'],
              ownerBy: p.formItemProps.name, // key所属高级组件, 用于回显
            })
          })
        } else {
          forms.value[item.key].push({
            id: p.formItemProps.name,
            required: p.formItemProps.required || false,
            accessModes: p.accessModes || ['read'],
          })
        }
      }
    })
  })
  visible.value = false
  // console.log('filterFormList.value: ', filterFormList.value)
  // console.log('forms.value: ', forms.value)
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
