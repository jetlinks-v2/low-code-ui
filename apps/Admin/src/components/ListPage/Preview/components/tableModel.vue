<template>
  <div>
    <JProTable
      ref="tableRef"
      :columns="props?.dataColumns"
      :request="props?.query"
      :pagination="props?.pagination"
      :model="model"
      :params='params'
      :modelValue="defaultFormType"
    >
      <template #headerTitle>
        <HeaderButton :headerActions="props.headerActions" />
      </template>
      <template
        v-for="item in props?.dataColumns"
        :key="item.key"
        #[item.key]="slotProps"
      >
        <div v-if="item.key !== 'action'">
          <div v-if="item?.config">
            <span v-if="item?.config?.type === 'object' && isShowIcon">
              <AIcon
                type="SearchOutlined"
                @click="jsonOpen(slotProps[item.key])"
              />
            </span>
            <span v-else-if="item?.config?.type === 'file' && isShowFileIcon">
              <img
                style="width: 30px; height: 30px"
                :src="dataFormat(item?.config, slotProps[item.key])"
              />
            </span>
            <span v-else>
              {{ dataFormat(item?.config, slotProps[item.key]) }}
            </span>
          </div>
          <div v-else>
            <j-ellipsis style="max-width: 240px">
              {{ slotProps[item.key] }}
            </j-ellipsis>
          </div>
        </div>
        <div v-if="item?.key === 'action'">
          <j-space size="large">
            <PermissionButton
              v-for="item in tableActions"
              :key="item.key"
              type="link"
              v-bind:="handleFunction(item.permissionProps, slotProps)"
              style="padding: 0"
              :danger="item.command === 'Delete'"
              :popConfirm="
                handleFunction(item.permissionProps, slotProps)?.popConfirm
              "
              :class="extractCssClass(item.style)"
              
            >
                <template v-if="item.icon">
                  <img :src="item.icon" alt="" v-if="item.icon.includes('http')" class="image-icon">
                  <AIcon v-else :type="item?.icon" />
                </template>
                <span>{{ item?.text }}</span>
            </PermissionButton>
          </j-space>
        </div>
      </template>
      <template #card="slotProps">
        <Card
          :status="slotProps[props?.cardConfig?.emphasisField]"
          :actions="tableActions"
          :record="slotProps"
          :statusText="
            slotProps[props?.cardConfig?.emphasisField] || ''
          "
          :showStatus="props?.cardConfig?.emphasisField !== ''"
          :statusNames="{
            online: 'processing',
            offline: 'error',
            notActive: 'warning',
          }"
          :statusColor="JSON.parse(props?.cardConfig.specialStyle || `{}`)"
          :popConfirm="
            handleFunction(slotProps.permissionProps, slotProps)?.popConfirm
          "
        >
          <template #img>
            <j-avatar
              shape="square"
              :size="100"
              :src="props?.cardConfig?.customIcon"
              class="card-icon"
            >
              <template #icon>
                <pro-image src="https://www.antdv.com/#error" />
              </template>
            </j-avatar>
          </template>
          <template #content>
            <j-row>
              <j-col :span="12">
                <span
                  v-if="
                    valueFormat(props?.cardConfig?.field1)?.config?.type ===
                      'object' && isShowIcon
                  "
                >
                  <AIcon
                    type="SearchOutlined"
                    @click="
                      jsonOpen(slotProps[props?.cardConfig?.field1])
                    "
                  />
                </span>
                <span
                  v-else-if="
                    valueFormat(props?.cardConfig?.field1)?.config?.type ===
                      'file' && isShowFileIcon
                  "
                >
                  <img
                    style="width: 30px; height: 30px"
                    :src="
                      dataFormat(
                        valueFormat(props?.cardConfig?.field1)?.config,
                        slotProps[props?.cardConfig?.field1],
                      )
                    "
                  />
                </span>
                <h3 v-else>
                  {{
                    dataFormat(
                      valueFormat(props?.cardConfig?.field1)?.config,
                      slotProps[props?.cardConfig?.field1],
                    ) || slotProps[props?.cardConfig?.field1]
                  }}
                </h3>
              </j-col>
              <j-col :span="12">
                <div class="emphasisField-text"></div>
              </j-col>
            </j-row>

            <j-row>
              <j-col :span="12">
                <div>{{ props?.cardConfig?.field2Title }}</div>
                <div>
                  <span
                    v-if="
                      valueFormat(props?.cardConfig?.field2)?.config?.type ===
                        'object' && isShowIcon
                    "
                  >
                    <AIcon
                      type="SearchOutlined"
                      @click="
                        jsonOpen(slotProps[props?.cardConfig?.field2])
                      "
                    />
                  </span>
                  <span
                    v-else-if="
                      valueFormat(props?.cardConfig?.field2)?.config?.type ===
                        'file' && isShowFileIcon
                    "
                  >
                    <img
                      style="width: 30px; height: 30px"
                      :src="
                        dataFormat(
                          valueFormat(props?.cardConfig?.field2)?.config,
                          slotProps[props?.cardConfig?.field2],
                        )
                      "
                    />
                  </span>
                  <span v-else>
                    {{
                      dataFormat(
                        valueFormat(props?.cardConfig?.field2)?.config,
                        slotProps[props?.cardConfig?.field2],
                      ) || slotProps[props?.cardConfig?.field2]
                    }}
                  </span>

                  <!-- {{ slotProps[props?.cardConfig?.field2] || '字段2' }} -->
                </div>
              </j-col>
              <j-col :span="12">
                <div>{{ props?.cardConfig?.field3Title }}</div>
                <div>
                  <span
                    v-if="
                      valueFormat(props?.cardConfig?.field3)?.config?.type ===
                        'object' && isShowIcon
                    "
                  >
                    <AIcon
                      type="SearchOutlined"
                      @click="
                        jsonOpen(slotProps[props?.cardConfig?.field3])
                      "
                    />
                  </span>
                  <span
                    v-else-if="
                      valueFormat(props?.cardConfig?.field3)?.config?.type ===
                        'file' && isShowFileIcon
                    "
                  >
                    <img
                      style="width: 30px; height: 30px"
                      :src="
                        dataFormat(
                          valueFormat(props?.cardConfig?.field3)?.config,
                          slotProps[props?.cardConfig?.field3],
                        )
                      "
                    />
                  </span>
                  <span v-else>
                    {{
                      dataFormat(
                        valueFormat(props?.cardConfig?.field3)?.config,
                        slotProps[props?.cardConfig?.field3],
                      ) || slotProps[props?.cardConfig?.field3]
                    }}
                  </span>

                  <!-- {{ slotProps[props?.cardConfig?.field3] || '字段3' }} -->
                </div>
              </j-col>
            </j-row>
          </template>
        </Card>
      </template>
    </JProTable>
  </div>
</template>
<script setup lang="ts">
import Card from '@/components/Card'
import HeaderButton from '@/components/ListPage/Preview/components/HederActions.vue'
import { isFunction, isObject } from 'lodash-es'
import dayjs from 'dayjs'
import { PropType } from 'vue'
import { extractCssClass, insertCustomCssToHead } from '@/components/FormDesigner/utils/utils';
const props = defineProps({
  model: {
    type: String,
    default: 'card',
  },
  dataColumns: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  query: {
    type: Function,
    default: () => {},
  },
  pagination: {
    type: Object,
    default: () => {},
  },
  cardConfig: {
    type: Object,
    default: {
      customIcon: '',
      dynamicIcon: '',
      field2Title: '',
      field3Title: '',
      field1: '',
      field2: '',
      field3: '',
      emphasisField: '',
      specialStyle: '',
    },
  },
  headerActions: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  defaultFormType: {
    type: String,
    default: 'CARD',
  },
  tableActions: {
    type: Array as PropType<Record<string, any>>,
    default: () => [],
  },
  params: {
    type: Object,
    default: () => {}
  }
})

const valueFormat = (val: any) => {
  return props.dataColumns.find(item => item.dataIndex === val)
}
const tableRef = ref();
const isShowIcon = ref(false)
const isShowFileIcon = ref(false)
const emit = defineEmits(['openJson'])
const dataFormat = (data: any, value: any) => {
  let format: any
  let type = data?.type
  if (
    data?.type === 'int' ||
    data?.type === 'long' ||
    data?.type === 'text' ||
    data?.type === 'double' ||
    data?.type === 'float' ||
    data?.type === 'string'
  ) {
    type = 'content'
  } else if (
    data?.type === 'file' ||
    data?.type === 'enum' ||
    data?.type === 'array'
  ) {
    type = 'fileSource'
  }
  switch (type) {
    case 'object':
      if (data?.demonstrations === 'json') {
        isShowIcon.value = false
        format = JSON.parse(JSON.stringify(value))
      } else {
        isShowIcon.value = true
      }
      break

    case 'date':
      format = dayjs(value).format(data?.dateValue || 'YYYY-MM-DD')
      break
    case 'content':
      switch (data.inputValue) {
        case 'x%':
          format = value + '%' || ''
          break
        case '%x':
          format = '%' + value || ''
          break
        case 'xxxx%xxxx':
          format = value?.slice(0, 4) + '%' + value?.slice(4) || ''
          break
        case '':
          format = value || ''
          break
      }
      break

    case 'boolean':
      if (value) {
        format = data?.trueValue || '是'
      } else {
        format = data?.falseValue || '否'
      }
      break
    case 'fileSource':
      switch (data.fileValue) {
        case 'url':
          format = value?.url || ''
          break
        case 'icon':
          isShowFileIcon.value = true
          format = value?.url || ''
          break
        case 'fileName':
          format = value?.name + '.' + value.type || ''
          break
        case 'xxx ; xxx':
          format = value?.slice(0, 3) + ';' + value?.slice(43) || ''
          break

        case 'xxx/xxx':
          format = value?.slice(0, 3) + '/' + value?.slice(3) || ''
          break
        case 'xxx、xxx':
          format = value?.slice(0, 3) + '、' + value?.slice(3) || ''
          break
      }

      break
    case 'geoPoint':
      format = value || ''
  }
  return format
}

const getActions = (
  data: Partial<Record<string, any>>,
  type: 'card' | 'table',
) => {
  if (!data) return []
  const actions = [
    {
      key: 'view',
      text: '查看',
      tooltip: {
        title: '查看',
      },
      icon: 'EyeOutlined',
    },
  ]
  return actions
}

const jsonOpen = (value: any) => {
  emit('openJson', { previewVisible: true, value: value })
}
const handleFunction = (item: any, data?: any) => {
  if (isFunction(item)) {
    return item(data)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}


watchEffect(() => {
  props.tableActions.forEach((item) => {
    insertCustomCssToHead(item.style, item.key)
    
  })
})

defineExpose({
  reload: () => {
    tableRef.value?.reload()
  }
})
</script>

<style scoped lang="less">
.image-icon {
  width: 14px;
  height: 14px;
}
</style>
