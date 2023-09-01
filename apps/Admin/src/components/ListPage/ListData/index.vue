<template>
  <div className="filter-module-center">
    <j-drawer
      title=""
      placement="bottom"
      :closable="true"
      :visible="open"
      @close="emits('update:open', false)"
      height="520px"
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
        :asyncData="asyncData"
        :configChange="configChange"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @handleOk="handleOk"
      />
      <div v-else>
        <a-page-header title="表头配置" sub-title="" @back="goBack">
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
                    :get-popup-container="getPopupContainer"
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
              </div>

              <!--object类型-->

              <j-radio-group
                v-model:value="configState.demonstrations"
                button-style="solid"
                v-if="configState.type === 'object'"
              >
                <j-space size="large">
                  <j-radio-button value="json" class="check-btn">
                    json展示
                  </j-radio-button>
                  <j-radio-button value="page" class="check-btn">
                    页面展示
                  </j-radio-button>
                </j-space>
              </j-radio-group>

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
                <j-row type="flex">
                  <j-col flex="50px">true</j-col>
                  <j-col flex="auto">
                    <j-input
                      style="width: 450px"
                      v-model:value="configState.trueValue"
                      maxLength="16"
                    />
                  </j-col>
                </j-row>
                <br />
                <j-row type="flex">
                  <j-col flex="50px">false</j-col>
                  <j-col flex="auto">
                    <j-input
                      style="width: 450px"
                      v-model:value="configState.falseValue"
                      maxLength="16"
                    />
                  </j-col>
                </j-row>
              </div>

              <!--file/enum/array类型-->
              <j-select
                v-else-if="
                  configState.type === 'file' ||
                  configState.type === 'enum' ||
                  configState.type === 'array'
                "
                v-model:value="configState.fileValue"
                :options="
                  configState.type === 'file' ? fileOptions : enumOptions
                "
                pLaceholder="请选择时间格式"
                style="width: 500px"
              />

              <!--int/long/text/float/double类型-->
              <j-input
                v-else
                style="width: 500px"
                v-model:value="configState.inputValue"
              />
            </div>
          </template>
        </Config>
      </div>

      <template #footer v-if="configState.type !== ''">
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="goBack">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@/components/ListPage/FilterModule/components/FilterTable.vue'
import Config from '@/components/ListPage/ListData/components/Configuration.vue'
import { useAllListDataStore } from '@/store/listForm'
import { DATA_BIND } from '../keys'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
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
const configurationStore = useAllListDataStore()
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
    value: 'yyyy-MM-dd HH:mm:ss',
    label: 'yyyy-MM-dd HH:mm:ss',
  },
  {
    value: 'HH:mm:ss',
    label: 'HH:mm:ss',
  },
  {
    value: 'yyyy-MM-dd',
    label: 'yyyy-MM-dd',
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
const asyncData = ref(false)
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
    value: 'string',
    label: 'string',
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
    width: 150,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
      rules: [
        {
          validator(data: any, value: any) {
            if (!value) {
              return Promise.reject('请输入标识')
            } else {
              const addId = data?.field.split('.')
              if (Number(addId[1])) {
                const same = dataSource.value?.findIndex(
                  (i: any) => i?.id === value,
                )
                if (
                  same !== -1 &&
                  Number(addId[1]) > dataSource.value?.length - 1
                ) {
                  return Promise.reject('标识重复，请重新输入！')
                }
              }
            }
            return Promise.resolve()
          },
        },
      ],
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
    width: 150,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
      rules: [
        {
          validator(_, value) {
            if (!value) {
              return Promise.reject('请输入名称')
            }
            return Promise.resolve()
          },
        },
      ],
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
    width: 150,
    tips: false,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    ellipsis: true,
    align: 'center',
    width: 140,
  },
]
//数据
const dataBinds: any = inject(DATA_BIND)
const dataSource = ref()
//新增一列table
const handleAdd = async (table: any) => {
  table?.addItem({
    id: '',
    name: '',
    type: 'string',
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
  let source: any = []
  switch (value) {
    case '1':
      if (configChange.value) {
        data?.map((item: any) => {
          const dataFind = dataSource.value?.find(
            (i: any) => i?.id === item?.id,
          )
          if (dataFind?.config !== item?.config) {
            source.push(item)
          }
        })
      } else {
        data?.map((item: any) => {
          if (item?.mark === 'add') {
            source.push(item)
          }
        })
      }

      break
    case '2':
      source = data
      break
    case '3':
      source = dataSource.value?.map((item) => {
        return {
          id: item.name,
          name: item.name,
          type: item.type,
        }
      })
      break
  }
  console.log(source, dataSource.value)

  dataSource.value = source
  configChange.value = false
  configurationStore.setALLlistDataInfo(
    'datasource',
    dataSource.value,
    props.id,
  )
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
    const data = {
      ...typeData,
      ...subValue.value,
    }
    dataRow['config'] = { ...data }
  }

  configState.type = ''
  show.value = true
  dataBind.value = true
  asyncData.value = true
  configChange.value = true
}
const goBack = () => {
  configState.type = ''
  show.value = true
  dataBind.value = true
  asyncData.value = true
}
const errorList = ref([])
watch(
  () => dataBinds,
  () => {
    if (dataBinds.functionInfo) {
      dataBind.value = true
    } else {
      dataBind.value = false
    }
    dataSource.value = dataBinds?.functionInfo?.configuration?.columns?.map(
      (item) => {
        return {
          id: item.name,
          name: item.name,
          type: 'string',
        }
      },
    )
  },
  { immediate: true, deep: true },
)

defineExpose({
  errorList,
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
</style>
