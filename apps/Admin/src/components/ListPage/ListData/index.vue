<template>
  <div className="filter-module-center">
    <j-drawer
      title=""
      placement="bottom"
      :closable="true"
      :visible="open"
      @close="open = false"
      height="520px"
    >
      <Table
        :columns="columns"
        :dataBind="dataBind"
        :asynData="asynData"
        :dataChange="dataChange"
        :title="title"
        :addBtnName="addBtnName"
        :dataSource="dataSource"
        :modelActiveKey="activeKey"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @confirm="confirm"
        @handleOk="handleOk"
        v-if="type === ''"
      />
      <div v-else>
        <a-page-header title="表头配置" sub-title="" @back="type = ''">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <Config
          :showSwitch="
            type !== 'geoPoint' &&
            type !== 'file' &&
            type !== 'enum' &&
            type !== 'array'
          "
          :type="type"
        >
          <template #demonstrations v-if="type !== 'geoPoint'">
            <div class="content">
              <div class="title">
                <span
                  v-if="
                    type === 'object' ||
                    type === 'boolean' ||
                    type === 'file' ||
                    type === 'enum' ||
                    type === 'array'
                  "
                  >展示方式</span
                >
                <span v-else-if="type === 'date'">数据展示格式</span>
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
                v-if="type === 'object'"
              >
                <j-space size="large">
                  <j-radio-button value="left" class="check-btn">
                    json展示
                  </j-radio-button>
                  <j-radio-button value="center" class="check-btn">
                    页面展示
                  </j-radio-button>
                </j-space>
              </j-radio-group>

              <!--date类型-->

              <j-autoComplete
                v-else-if="type === 'date'"
                v-model:value="configState.dateValue"
                :options="dateOptions"
                mode="tags"
                pLaceholder="请选择时间格式"
                style="width: 500px"
              />

              <!--boolean类型-->
              <div v-else-if="type === 'boolean'">
                <j-row type="flex">
                  <j-col flex="50px">true</j-col>
                  <j-col flex="auto">
                    <j-input
                      style="width: 450px"
                      v-model:value="configState.trueValue"
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
                    />
                  </j-col>
                </j-row>
              </div>

              <!--file/enum/array类型-->
              <j-select
                v-else-if="
                  type === 'file' || type === 'enum' || type === 'array'
                "
                v-model:value="configState.fileValue"
                :options="type === 'file' ? fileOptions : enumOptions"
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

      <template #footer v-if="type !== ''">
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="type = ''">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@/components/ListPage/FilterModule/components/FilterTable.vue'
import Config from '@/components/ListPage/ListData/compnents/Configuration.vue'
import { useListDataStore } from '@/store/listData'
const open = ref<boolean>(true)
const type = ref('')
const title = ref('请配置数据列表需要展示的表头')
const addBtnName = ref('新增表头')
const configurationStore = useListDataStore()
const configState = reactive({
  checked: true,
  colLayout: 'left',
  specialStyle: undefined,

  demonstrations: '',
  dateValue: [],
  inputValue: '',
  falseValue: '否',
  trueValue: '是',
  fileValue: '',
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
//是否同步数据绑定
const asynData = ref(true)
//数据是否有变动
const dataChange = ref(true)
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
          validator(_, value) {
            if (!value) {
              return Promise.reject('请输入标识')
            }
            return Promise.resolve()
          },
        },
      ],
    },
    doubleClick(record) {
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
      required: false,
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
const dataSource = ref([
  {
    id: 'deviceId',
    name: 'hhhh',
    type: 'date',
  },
])
//新增一列table
const handleAdd = async (table: any) => {
  table.addItem({
    id: '',
    name: '',
    type: 'string',
    mark: 'add',
  })
}
//删除
const confirm = (data: any) => {
  console.log(data, 'confirm')
}
//配置
const configuration = (data: any) => {
  type.value = data?.record?.type
}
//处理方式弹窗
const handleOk = (value: any) => {
  activeKey.value = value
}

//保存
const submit = () => {
  const aa = configurationStore.getListDataInfo()
  configState
  console.log(aa, configState, 'configState')
  type.value = ''
}
defineExpose({
  open: open.value,
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
