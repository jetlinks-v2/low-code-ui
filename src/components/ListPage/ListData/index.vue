<template>
  <div className="filter-module-center" ref="listDataRef">
    <img
      class="modal-config-img"
      :src="getImage('/list-page/data.png')"
      v-if="open"
    />
    <j-drawer
      title="列表数据配置"
      placement="right"
      width="560px"
      :closable="true"
      :visible="open"
      :getContainer="() => $refs.listDataRef"
      :destroyOnClose="true"
      :wrap-style="{ position: 'absolute', zIndex: 1, overflow: 'hidden' }"
      @close="emits('update:open', false)"
    >
      <Table
        v-if="configState.type === ''"
        :columns="columns"
        :dataBind="dataBind"
        :dataChange="dataChange"
        :title="title"
        :addBtnName="addBtnName"
        :dataSource="dataSource"
        :modelActiveKey="activeKey"
        :show="show"
        v-model:asyncData="dataBinds.columnAsync"
        :configChange="configChange"
        :errorList="errorList"
        :bindData="dataBinds.columnBind"
        :bind-function-id="dataBinds.data.function"
        tableType="columnData"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @handleOk="handleOk"
        @bindData="bindData"
        @handleChange="(data) => (dataSource = data)"
        @update-bind="(data) => (dataBinds.columnBind = data)"
      />
      <div v-else>
        <a-page-header title=" " sub-title="" @back="goBack">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <Config
          :showSwitch="
            configState.type !== 'geoPoint' &&
            configState.type !== 'file' &&
            configState.type !== 'enum' &&
            configState.type !== 'array'
          "
          :config="configRow"
          @update:state="(newValue) => (subValue = newValue)"
        >
          <template #demonstrations v-if="configState.type !== 'geoPoint'">
            <div class="content">
              <div class="title">
                <j-form layout="vertical">
                  <j-form-item :required="['object', 'boolean', 'file', 'enum', 'array'].includes(configState.type)">
                    <template #label>
                      <span
                        v-if="
                          configState.type === 'object' ||
                          configState.type === 'boolean' ||
                          configState.type === 'file' ||
                          configState.type === 'enum' ||
                          configState.type === 'array'
                        "
                        >展示方式</span
                      >
                      <span v-else-if="configState.type === 'date'"
                        >数据展示格式</span
                      >
                      <span v-else>
                        自定义展示格式

                        <j-tooltip
                          placement="top"
                        >
                          <template #title>
                            <p>在数据后方展示%: x%</p>
                            <p>在数据前方展示%: %x</p>
                            <p>在数据4个字符后展示%: xxxx%xxxx</p>
                            <p>为空时仅展示数据</p>
                          </template>
                          <AIcon type="QuestionCircleOutlined" />
                        </j-tooltip>
                      </span>
                    </template>
                    <!--object类型-->

                    <ErrorItem
                      v-if="configState.type === 'object'"
                      :error-data="errorData('demonstrations')"
                    >
                      <j-radio-group
                        v-model:value="configState.demonstrations"
                        button-style="solid"
                      >
                        <j-space size="large">
                          <j-radio-button value="page" class="check-btn">
                            弹窗展示
                          </j-radio-button>
                          <j-radio-button value="json" class="check-btn">
                            列表展示
                          </j-radio-button>
                        </j-space>
                      </j-radio-group>
                    </ErrorItem>

                    <!--date类型-->

                    <j-autoComplete
                      v-else-if="configState.type === 'date'"
                      v-model:value="configState.dateValue"
                      :options="dateOptions"
                      mode="tags"
                      pLaceholder="请选择时间格式"
                      style="width: 500px"
                    />

                    <!--boolean类型-->
                    <div v-else-if="configState.type === 'boolean'">
                      <j-row align="middle">
                        <j-col :span="2">true</j-col>
                        <j-col :span="20">
                          <j-input
                            style="width: 350px"
                            v-model:value="configState.trueValue"
                            maxLength="16"
                          />
                        </j-col>
                      </j-row>
                      <br />
                      <j-row align="middle">
                        <j-col :span="2">false</j-col>
                        <j-col :span="20">
                          <j-input
                            style="width: 350px"
                            v-model:value="configState.falseValue"
                            maxLength="16"
                          />
                        </j-col>
                      </j-row>
                    </div>

                    <!--file/enum/array类型-->
                    <ErrorItem
                      v-else-if="
                        configState.type === 'file' ||
                        configState.type === 'enum' ||
                        configState.type === 'array'
                      "
                      :errorData="errorData('fileValue')"
                    >
                      <j-select
                        v-model:value="configState.fileValue"
                        :options="
                          configState.type === 'file'
                            ? fileOptions
                            : enumOptions
                        "
                        placeholder="请选择展示方式"
                        style="width: 100%"
                      />
                    </ErrorItem>

                    <!--int/long/text/float/double类型-->
                    <j-input
                      v-else
                      style="width: 500px"
                      v-model:value="configState.inputValue"
                    />
                  </j-form-item>
                </j-form>
              </div>
            </div>
          </template>
        </Config>
      </div>

      <template #footer v-if="configState.type !== ''">
        <j-space>
          <j-button @click="goBack"> 取消 </j-button>
          <j-button type="primary" @click="submit"> 确定 </j-button>
        </j-space>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@LowCode/components/ListPage/FilterModule/components/FilterTable.vue'
import Config from '@LowCode/components/ListPage/ListData/components/Configuration.vue'
import { DATA_BIND } from '../keys'
import { validListData } from './utils/valid'
import { PropType } from 'vue'
import { getImage } from '@jetlinks-web/utils'
import { ErrorItem } from '..'

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:dataSource', value: any): void
}

const errorData = computed(() => {
  return (val: string): any => {
    const _index = dataSource.value?.findIndex(
      (item: any) => item?.id === configRow.value?.id,
    )
    console.log(errorList.value, val)
    return errorList.value?.find((item: any) => item.childKey === val + _index)
  }
})

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
  },
  dataSource: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => {},
  },
})

const open = computed({
  get() {
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})
const show = ref(false)
const title = ref('请配置数据列表需要展示的表头')
const addBtnName = ref('新增表头')
const subValue = ref({})
const configState = reactive({
  type: '',
  demonstrations: 'json', //object类型
  dateValue: '', //date类型
  inputValue: '', //int/long/text/float/double类型
  falseValue: '否', //boolean类型
  trueValue: '是', //boolean类型
  fileValue: '', //file/enum/array类型
})

const dateOptions = [
  {
    value: 'YYYY-MM-DD HH:mm:ss',
    label: 'YYYY-MM-DD HH:mm:ss',
  },
  {
    value: 'HH:mm:ss',
    label: 'HH:mm:ss',
  },
  {
    value: 'YYYY-MM-DD',
    label: 'YYYY-MM-DD',
  },
]
const fileOptions = [
  { value: 'url', label: 'url' },
  { value: 'icon', label: '图标' },
  { value: 'fileName', label: '文件名.格式' },
]
const enumOptions = [
  { value: 'xxx ; xxx', label: 'xxx ; xxx' },
  { value: 'xxx/xxx', label: 'xxx/xxx' },
  { value: 'xxx、xxx', label: 'xxx、xxx' },
]
//悬浮提示自动调整位置
const getPopupContainer = (trigger: HTMLElement) => {
  return trigger.parentElement
}
//是否完成数据绑定
const dataBind = ref(true)
//是否同步数据
//数据是否有变动
const dataChange = ref(false)
//是否修改配置
const configChange = ref(false)
//处理方式弹窗activeKey
const activeKey = ref('1')
//筛选类型
const options = [
  {
    value: 'int',
    label: 'int',
  },
  {
    value: 'long',
    label: 'long',
  },
  {
    value: 'float',
    label: 'float',
  },
  {
    value: 'double',
    label: 'double',
  },
  {
    value: 'text',
    label: 'text',
  },
  {
    value: 'boolean',
    label: 'boolean',
  },
  {
    value: 'date',
    label: 'date',
  },
  {
    value: 'enum',
    label: 'enum',
  },
  {
    value: 'array',
    label: 'array',
  },
  {
    value: 'object',
    label: 'object',
  },
  {
    value: 'file',
    label: 'file',
  },
  {
    value: 'geoPoint',
    label: 'geoPoint',
  },
]
const columns: any = [
  {
    title: '标识',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    align: 'center',
    width: 140,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
    },
    doubleClick(record: any) {
      return record?.mark === 'add'
    },
  },
  {
    title: '表头名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    align: 'center',
    width: 140,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
    },
  },
  {
    title: '展示数据类型',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    align: 'center',
    type: 'select',
    options: options,
    width: 110,
    tips: false,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    ellipsis: true,
    align: 'center',
    width: 100,
  },
]
//数据
const dataBinds: any = inject(DATA_BIND)
const dataSource = computed({
  get() {
    return props.dataSource
  },
  set(val) {
    emits('update:dataSource', val)
  },
})
//新增一列table
const handleAdd = async (table: any) => {
  table?.addItem({
    id: '',
    name: '',
    type: 'object',
    mark: 'add',
  })
}

const configRow = ref()
//配置
const configuration = (data: any, value: any) => {
  configState.type = data?.record?.type
  configRow.value = data?.record

  configState.demonstrations = data?.record?.config?.demonstrations || 'json'
  configState.dateValue = data?.record?.config?.dateValue
  configState.inputValue = data?.record?.config?.inputValue || ''
  configState.falseValue = data?.record?.config?.falseValue || '否'
  configState.trueValue = data?.record?.config?.trueValue || '是'
  configState.fileValue = data?.record?.config?.fileValue
  dataSource.value = value
}
//处理方式弹窗
const handleOk = (value: any, data: any) => {
  switch (value) {
    case '1':
      dataSource.value = data
      break
    case '2':
      dataSource.value.push(...data)
      break
    case '3':
      break
  }
  configChange.value = false
}
//点击显示table的同步数据
const bindData = (data: any) => {
  dataSource.value = data
}
const typeDataFilter = (value: string) => {
  let data = {}
  let type = value
  if (
    value === 'int' ||
    value === 'long' ||
    value === 'text' ||
    value === 'double' ||
    value === 'float' ||
    value === 'string'
  ) {
    type = 'content'
  } else if (value === 'file' || value === 'enum' || value === 'array') {
    type = 'fileSource'
  }
  switch (type) {
    case 'object':
      data = { demonstrations: configState.demonstrations, type: value }
      break

    case 'date':
      data = { dateValue: configState.dateValue, type: value }
      break

    case 'content':
      data = { inputValue: configState.inputValue, type: value }
      break

    case 'boolean':
      data = {
        falseValue: configState.falseValue,
        trueValue: configState.trueValue,
        type: value,
      }
      break

    case 'fileSource':
      data = { fileValue: configState.fileValue, type: value }
      break
    case 'geoPoint':
      data = { type: value }
      break
  }
  return data
}
//保存
const submit = () => {
  const dataRow = dataSource.value?.find(
    (item: any) => item?.id === configRow.value?.id,
  )
  if (dataRow) {
    const typeData = typeDataFilter(dataRow?.type)
    console.log(typeData);
    const data = {
      ...typeData,
      ...subValue.value,
    }
    console.log(data);
    dataRow['config'] = { ...data }
  }

  configState.type = ''
  show.value = true
  dataBind.value = true
  dataBinds.columnAsync = true
  configChange.value = true
}
const goBack = () => {
  configState.type = ''
  show.value = true
  dataBind.value = true
  dataBinds.columnAsync = true
  configChange.value = false
}
const errorList = ref([])
// watch(
//   () => dataBinds,
//   () => {
//     if (dataBinds.data.function) {
//       dataBind.value = true
//     } else {
//       dataSource.value = []
//     }
//   },
//   { immediate: true, deep: true },
// )

const valid = () => {
  errorList.value = validListData(dataSource.value)
  return errorList.value.length ? [{ message: '列表数据配置错误' }] : []
  // return new Promise((resolve) => {
  //   errorList.value = validListData(dataSource.value);
  //   if(errorList.value.length) throw [{message: '列表数据配置错误'}]
  //   else resolve(errorList.value)
  // })
}
defineExpose({
  errorList,
  valid,
})
</script>

<style scoped lang="less">
.title {
  padding-bottom: 5px;
}
.content {
  padding-top: 5px;
}
.check-btn {
  width: 238px;
  text-align: center;
}
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
