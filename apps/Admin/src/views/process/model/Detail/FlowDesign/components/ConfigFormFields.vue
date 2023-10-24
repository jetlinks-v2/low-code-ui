<!-- 节点-配置表单/字段 -->
<template>
  <j-button class="btn" block @click="visible = true">
    <span>配置表单内容</span>
    <span class="icon">
      <img :src="getImage('/members/check.png')" />
    </span>
  </j-button>
  <!-- <div v-for="(fields, index) in forms" :key="index">
    <div v-for="(field, idx) in fields">{{ field }}</div>
  </div> -->
  <j-modal
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
          placeholder="请输入表单名称"
        >
          <template #suffix>
            <AIcon type="SearchOutlined" />
          </template>
        </j-input>
        <j-checkbox
          v-model:checked="checkAll"
          @change="handleAllCheck"
          style="margin: 5px 0"
        >
          全部内容
        </j-checkbox>
        <div class="form-box">
          <div v-if="loading" style="text-align: center">
            <j-spin />
          </div>
          <div
            class="form-item"
            v-for="(form, index) in filterFormList"
            :key="'form' + index"
          >
            <div class="form-title">
              <div class="name">{{ form.formName }}</div>
              <div class="permission">
                <j-checkbox-group
                  v-model:value="form.accessModes"
                  :options="permissions"
                  @change="handleFormCheck(form)"
                />
              </div>
            </div>
            <div
              class="form-fields"
              v-for="(field, idx) in form.fullInfo.configuration?.children"
              :key="'field' + idx"
            >
              <div class="field-title">
                <div class="name">{{ field.formItemProps?.label }}</div>
                <div class="permission">
                  <j-checkbox-group
                    v-model:value="field.accessModes"
                    :options="permissions"
                    @change="handleFieldCheck(field)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </j-col>
      <j-col :span="16">
        <div class="preview-box">
          <template v-for="(item, index) in filterFormList" :key="index">
            <div>{{ item.formName }}</div>
            <FormPreview
              v-if="!item.multiple"
              :data="item.fullInfo?.configuration"
            />
            <TableFormPreview
              v-model:data-source="tableData"
              :columns="getTableColumns(item.fullInfo?.configuration?.children)"
              v-else
            />
          </template>
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
  (e: 'update:value', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

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
const getFormList = async () => {
  filterFormList.value = flowStore.model.config.forms?.map((m) => {
    const _fields = m.fullInfo.configuration?.children
    // 已经存在的字段
    const existFields = forms.value[m.formId]
    if (existFields && existFields.length) {
      _fields?.forEach((p) => {
        const _currentField = existFields.find(
          (f) => f.id === p.formItemProps.name,
        )
        p['accessModes'] = _currentField ? _currentField.accessModes : ['read']
        // 只有"写"权限时, 表单才可编辑
        p.componentProps.disabled = !p.accessModes.includes('write')
      })
      return { accessModes: ['read'], ...m }
    } else {
      _fields?.forEach((p) => {
        p['accessModes'] = ['read']
        // 初始状态没有权限, 不可编辑
        p.componentProps.disabled = true
      })
      return { accessModes: ['read'], ...m }
    }
  })
  //   所有表单数据
  allFormList.value = cloneDeep(filterFormList.value)
}
getFormList()

const handleSearch = () => {
  filterFormList.value = filterFormByName(allFormList.value, keywords.value)
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
  const _fields = form.fullInfo.configuration?.children
  _fields?.forEach((p) => {
    p.accessModes = form.accessModes
    p.componentProps.disabled = !p.accessModes.includes('write')
  })
}

/**
 * 字段勾选/取消"写", 自动勾选/取消"读"
 */
const handleFieldCheck = (field) => {
  // 字段有写权限, 必有读
  if (field.accessModes.length === 1 && field.accessModes[0] === 'write') {
    field.accessModes = ['read', 'write']
  }
  // 只有"写"权限时, 表单才可编辑
  field.componentProps.disabled = !field.accessModes.includes('write')
}

const tableData = ref<any>([{}])
const getTableColumns = (fields: any[]) => {
  //   console.log('getTableColumns: ', fields)

  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    ...m,
  }))

  _columns?.forEach((item) => {
    tableData.value[0][item.dataIndex] = undefined
  })
  //   console.log('tableData.value: ', tableData.value)
  return _columns
}

/**
 * 确认之后, 将数据同步至父组件的basicFormData.forms
 */
const handleOk = () => {
  filterFormList.value?.forEach((item) => {
    const _fields = item.fullInfo.configuration?.children
    forms.value[item.formId] = []
    _fields?.forEach((p) => {
      if (p.accessModes.length) {
        forms.value[item.formId].push({
          id: p.formItemProps.name,
          required: true,
          accessModes: p.accessModes,
        })
      }
    })
  })
  visible.value = false
  //   console.log('forms.value: ', forms.value);
}

watch(
  () => visible.value,
  (val) => {
    if (val) getFormList()
  },
)
watch(
  () => filterFormList.value,
  (val) => {
    val?.forEach((form) => {
      const fieldAccessModes = form.fullInfo?.configuration?.children?.map(
        (field) => field.accessModes,
      )
      // 当表单下, 每个字段都有"写"权限时, 对应表单也勾选"写"
      form.accessModes = fieldAccessModes?.every((e) => e.includes('write'))
        ? ['read', 'write']
        : ['read']
    })
  },
  { deep: true, immediate: true },
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
.form-box {
  max-height: 600px;
  overflow: auto;
  .form-item {
    .form-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .form-fields {
      padding-left: 30px;
      .field-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
    }
  }
}
.preview-box {
  max-height: 600px;
  overflow: auto;
}
</style>
