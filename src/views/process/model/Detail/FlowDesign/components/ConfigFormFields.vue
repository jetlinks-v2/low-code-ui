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
    width="1000px"
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
          <j-scrollbar height="500" style="padding: 0 10px">
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
                      <j-ellipsis line-clamp="1" style="width: 150px">
                        {{ form.name }}
                      </j-ellipsis>
                    </div>
                    <div class="permission">
                      <j-checkbox-group
                        v-model:value="form.accessModes"
                        :options="permissions"
                        @change="handleFormCheck(form, 'handle')"
                        @click="(event) => event.stopPropagation()"
                      />
                    </div>
                  </div>
                </template>
                <!-- 正常组件 -->
                <div
                  class="form-fields"
                  v-for="(field, idx) in form.previewFields.filter(
                    (field) => !field.type.includes('item'),
                  )"
                  :key="'field' + idx"
                >
                  <div class="field-title">
                    <div class="name">
                      <j-ellipsis line-clamp="1" style="width: 130px">
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
                <!-- 布局组件item -->
                <j-collapse
                  v-model:activeKey="form.collapseActive"
                  :bordered="false"
                >
                  <template #expandIcon="{ isActive }">
                    <AIcon type="CaretRightOutlined" v-show="!isActive" />
                    <AIcon type="CaretDownOutlined" v-show="isActive" />
                  </template>
                  <j-collapse-panel
                    v-for="(field, idx) in form.previewFields.filter((field) =>
                      field.type.includes('item'),
                    )"
                    :key="field.key"
                    style="padding-left: 30px"
                  >
                    <template #header>
                      <div class="layout-title">
                        <div class="name">
                          <j-ellipsis line-clamp="1" style="width: 130px">
                            {{
                              field.parent?.componentProps?.title ||
                              field.componentProps?.name ||
                              field.parent?.name ||
                              '-'
                            }}
                          </j-ellipsis>
                        </div>
                      </div>
                    </template>
                    <div
                      class="layout-fields"
                      v-for="(layoutField, layoutFieldIdx) in field.children"
                      :key="layoutField.key"
                    >
                      <div class="name">
                        <j-ellipsis line-clamp="1" style="width: 120px">
                          {{
                            layoutField.formItemProps?.label ||
                            layoutField.componentProps?.name
                          }}
                        </j-ellipsis>
                      </div>
                      <div class="permission">
                        <j-checkbox-group
                          v-model:value="layoutField.accessModes"
                          :options="permissions"
                          @change="handleFieldCheck(form, layoutField)"
                        />
                      </div>
                    </div>
                  </j-collapse-panel>
                </j-collapse>
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
import {
  filterFormByName,
  updateFieldDisabled,
  flattenTree,
  getFieldByKey,
} from './utils'
import { cloneDeep } from 'lodash-es'
import FormPreview from '@/components/FormDesigner/preview.vue'
import TableFormPreview from './TableFormPreview.vue'
import { PropType } from 'vue'
import { getImage } from '@jetlinks-web/utils'
import { advancedComponents, layoutComponents } from './const'

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
  // 接口需要数据处理
  await handleFlattenFields(_sortResult)
  // 右侧预览数据处理
  initPreviewData(_sortResult)
  handleSearch()
}

/**
 * 左侧表单字段数据结构处理(添加后端需要的结构: flattenFields)
 * @param data
 */
const handleFlattenFields = (data) => {
  // 左侧表单读写操作列表
  filterFormList.value = data?.map((m) => {
    // formItemProps.isLayout存在并且=false时, 布局组件内部字段, 取出平铺
    let _layoutFields = cloneDeep(
      m.configuration?.children?.filter(
        (f) =>
          f.formItemProps.hasOwnProperty('isLayout') &&
          !f.formItemProps.isLayout,
      ),
    )
    _layoutFields = cloneDeep(flattenTree(_layoutFields))

    // 平铺字段
    const _flattenFields = [
      ...m.configuration?.children?.filter(
        (f) =>
          !(
            f.formItemProps.hasOwnProperty('isLayout') &&
            !f.formItemProps.isLayout
          ),
      ),
      ..._layoutFields,
    ]
    // console.log('_flattenFields: ', _flattenFields)

    // 已经存在的字段
    const _existFields = forms.value[m.key]
    if (_existFields && _existFields.length) {
      _flattenFields?.forEach((p) => {
        const _currentField = _existFields.find((f) => {
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
        accessModes: _flattenFields?.every((e) => e.accessModes?.length === 2)
          ? ['read', 'write']
          : ['read'],
        multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
        flattenFields: _flattenFields,
      }
    } else {
      _flattenFields?.forEach((p) => {
        p['accessModes'] = ['read']
      })
      return {
        ...m,
        accessModes: ['read'],
        multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
        flattenFields: _flattenFields,
      }
    }
  })
  //   console.log('filterFormList.value1: ', filterFormList.value)
  handlePreviewFields(filterFormList.value)
}

/**
 * 左侧表单字段数据结构处理(添加页面展示需要的结构: _previewFields)
 * @param data
 */
const handlePreviewFields = (data) => {
  filterFormList.value = data?.map((m) => {
    // 所有布局组件内部字段, 添加isWrapOn字段, 用于判断容器开关是否开启
    let _layoutFields = cloneDeep(
      m.configuration?.children
        ?.filter((f) => layoutComponents.includes(f.type))
        ?.map((m) => ({
          ...m,
          isWrapOn: !(
            m.formItemProps.hasOwnProperty('isLayout') &&
            !m.formItemProps.isLayout
          ),
        })),
    )
    // console.log('_layoutFields: ', _layoutFields)
    // 取出所有布局组件item, 和普通组件同级展示
    const _layoutItems = _layoutFields
      ?.map((lf) => {
        lf.children?.forEach((item) => {
          item.isWrapOn = lf.isWrapOn
          // 将布局组件数据放入item, 作为parent
          item.parent = lf
        })
        return lf.children
      })
      .flat()
    // console.log('_layoutItems: ', _layoutItems)
    // 常规组件+布局组件item组合
    const _previewFields = [
      ...m.configuration?.children?.filter(
        (f) => !layoutComponents.includes(f.type),
      ),
      ..._layoutItems,
    ]

    console.log('_previewFields: ', _previewFields)
    const _existFields = forms.value[m.key]
    console.log('_existFields: ', _existFields)
    if (_existFields && _existFields.length) {
      _previewFields?.forEach((p) => {
        const _currentField = _existFields.find((f) => {
          if (
            !(
              p.componentProps.hasOwnProperty('mode') &&
              p.componentProps.mode === 'multiple'
            ) &&
            advancedComponents.includes(p.type)
          ) {
            // 高级单选组件
            return p.componentProps?.keys
              ?.map((source) => source.config.source)
              ?.includes(f.id)
          } else {
            if (!p.hasOwnProperty('isWrapOn')) {
              // 非布局组件
              return f.id === p.formItemProps.name
            } else {
              // 布局组件
              if (p.isWrapOn) {
                // 布局组件容器组件开关开启, 存的是布局组件, 取当前item的父级判断
                return f.id === p.parent.formItemProps.name
              } else {
                // 布局组件容器组件开关关闭
                // 读写权限设置标识, 此处单独设置
                p['accessDone'] = true
                p.children?.forEach((item) => {
                  if (
                    f.id === item.formItemProps.name ||
                    f.ownerBy === item.formItemProps.name
                  ) {
                    // 高级组件在tabs布局组件内部时, 取ownerBy字段判断
                    item.accessModes = f.accessModes
                  }
                  if (
                    !(
                      p.formItemProps.hasOwnProperty('isLayout') &&
                      !p.formItemProps.isLayout
                    )
                  ) {
                    // 布局组件item没有isLayout字段或者有isLayout=true时
                    item.accessModes = f.realCheck?.includes(
                      item.formItemProps.name,
                    )
                      ? f.accessModes
                      : ['read']
                  }
                })
                return p.formItemProps.name === f.id
              }
            }
          }
        })
        p['accessModes'] = _currentField ? _currentField.accessModes : ['read']
        // console.log('_currentField: ', _currentField)
        // 设置布局组件item下的读写
        if (!p.accessDone) {
          p.children?.forEach((item) => {
            if (_currentField?.realCheck) {
              item.accessModes = _currentField.realCheck.includes(
                item.formItemProps.name,
              )
                ? ['read', 'write']
                : ['read']
            } else {
              item.accessModes = p.accessModes
            }
          })
        }
      })
      return {
        ...m,
        previewFields: _previewFields,
        collapseActive: _previewFields?.map((m) => m.key),
      }
    } else {
      _previewFields?.forEach((p) => {
        p['accessModes'] = ['read']
      })
      return {
        ...m,
        previewFields: _previewFields,
        collapseActive: _previewFields?.map((m) => m.key),
      }
    }
  })
  allFormList.value = cloneDeep(filterFormList.value)
  console.log('filterFormList.value2: ', filterFormList.value)
}

/**
 * 预览数据初始化状态
 * @param data
 */
const initPreviewData = (data) => {
  previewData.value = data.map((m) => {
    return {
      ...m,
      multiple: existForms.value?.find((f) => f.formId === m.key)?.multiple,
    }
  })
  // 设置预览数据初始读写状态
  filterFormList.value?.forEach((form) => {
    handleFormCheck(form)
  })
}

const handleSearch = () => {
  filterFormList.value = cloneDeep(
    filterFormByName(allFormList.value, keywords.value),
  )
  filterFormList.value?.forEach((item) => {
    // 所有布局组件内部字段
    const _allFields = getAllFields(item)
    item.accessModes = _allFields?.every((e) =>
      e.accessModes?.includes('write'),
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
    filterFormList.value?.every((e) => e.accessModes?.length === 2) || false
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
const handleFormCheck = (form: any, opt?: string) => {
  form.previewFields?.forEach((p) => {
    if (p.type.includes('item')) {
      // tabs collapse布局组件默认有交互权限
      p.accessModes = ['read', 'write']
      p.children?.forEach((item) => {
        item.accessModes = form.accessModes
      })
    } else {
      p.accessModes = form.accessModes
    }
    // 右侧预览数据更新
    if (p.type.includes('item')) {
      p.children?.forEach((item) => {
        updatePreviewData(form, item)
      })
    } else {
      updatePreviewData(form, p)
    }
  })
  // 设置全部内容全选状态, opt存在时, 手动勾选表单, 才触发全选交互
  // 循环每个表单时不触发交互
  if (opt) setCheckAll()
}

/**
 * 字段勾选/取消"写", 自动勾选/取消"读"
 */
const handleFieldCheck = (form, field) => {
  // 所有布局组件内部字段
  const _allFields = getAllFields(form)
  // 左侧读写操作交互
  // 设置表单全选状态
  form.accessModes = _allFields?.every((e) => e.accessModes?.includes('write'))
    ? ['read', 'write']
    : ['read']

  // 右侧预览数据更新
  updatePreviewData(form, field)
  // 设置全部内容全选状态
  setCheckAll()
}

/**
 * 取出previewFields里面的所有字段, 平铺用于勾选交互
 */
const getAllFields = (form) => {
  // 所有布局组件内部字段
  const _allLayoutFields = form.previewFields
    ?.filter((f) => f.type.includes('item'))
    ?.map((m) => m.children)
    ?.flat()
  // 非布局组件字段
  const _unLayoutFields = form.previewFields?.filter(
    (f) => !f.type.includes('item'),
  )

  return [..._unLayoutFields, ..._allLayoutFields]
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
        {
          required: m.formItemProps?.required || false,
          message: `请输入${m.formItemProps?.label}`,
        },
        ...(m.formItemProps?.rules || []),
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
      // 处理单选高级组件, 平铺keys至formBinds
      if (
        !(
          p.componentProps.hasOwnProperty('mode') &&
          p.componentProps.mode === 'multiple'
        ) &&
        advancedComponents.includes(p.type)
      ) {
        // 高级组件是否在布局组件内部
        const _advancedInLayout = cloneDeep(
          getFieldByKey(item.previewFields, p.formItemProps.name),
        )
        // 高级组件, 并且为单选模式时, 将componentProps.keys平铺存入formBinds
        p.componentProps.keys?.forEach((k) => {
          forms.value[item.key].push({
            id: k.config.source,
            required: p.formItemProps.required || false,
            accessModes: _advancedInLayout?.accessModes ||
              p.accessModes || ['read'],
            ownerBy: p.formItemProps.name, // key所属高级组件, 用于回显
          })
        })
      } else {
        if (layoutComponents.includes(p.type)) {
          // 布局组件
          const _layoutField = cloneDeep(
            getFieldByKey(item.previewFields, p.formItemProps.name),
          )
          //   console.log('_layoutField: ', _layoutField)
          // 折叠面板/选项卡
          // 取出布局组件里面的所有组件平铺
          const _flatLayout = _layoutField.children
            ?.map((m) => m.children)
            .flat()
          // 布局组件中只要勾选了一个写, 布局组件就勾选写
          //   console.log('_flatLayout: ', _flatLayout)
          _layoutField.accessModes = _flatLayout?.some(
            (s) => s.accessModes?.length === 2,
          )
            ? ['read', 'write']
            : ['read']

          forms.value[item.key].push({
            id: _layoutField.formItemProps.name,
            required: _layoutField.formItemProps.required || false,
            accessModes: _layoutField.accessModes,
            // 实际勾选的组件id, 用于回显
            realCheck: _flatLayout
              ?.filter((f) => f.accessModes?.length === 2)
              ?.map((m) => m.formItemProps.name),
          })
        } else {
          if (p.parent) {
            // 存在parent时, 为布局组件内部item组件
            const _layoutItemField = cloneDeep(
              getFieldByKey(item.previewFields, p.formItemProps.name),
            )
            // console.log('_layoutItemField: ', _layoutItemField)
            forms.value[item.key].push({
              id: _layoutItemField.formItemProps.name,
              required: _layoutItemField.formItemProps.required || false,
              accessModes: !_layoutItemField.type.includes('item')
                ? _layoutItemField.accessModes
                : _layoutItemField.children?.some(
                    (s) => s.accessModes?.length === 2,
                  )
                ? ['read', 'write']
                : ['read'],
              // 实际勾选的组件id, 用于回显
              realCheck: !_layoutItemField.type.includes('item')
                ? // ? undefined
                  [_layoutItemField.formItemProps?.name]
                : _layoutItemField.children
                    ?.filter((f) => f.accessModes?.length === 2)
                    ?.map((m) => m.formItemProps.name),
            })
          } else {
            // 常规组件或者高级多选组件
            forms.value[item.key].push({
              id: p.formItemProps.name,
              required: p.formItemProps.required || false,
              accessModes: p.accessModes || ['read'],
            })
          }
        }
      }
    })
  })
  visible.value = false
  console.log('filterFormList.value: ', filterFormList.value)
  console.log('forms.value: ', forms.value)
  emits('update:value', forms.value)
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
  .layout-title {
  }
  .layout-fields {
    padding-left: 18px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
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
  //   padding: 0px 10px;
  padding: 0px;
}
:deep(.ant-collapse-content > .ant-collapse-content-box) {
  //   padding: 10px;
  padding: 0;
}
:deep(.ant-collapse-borderless) {
  background-color: #fff;
}
</style>
