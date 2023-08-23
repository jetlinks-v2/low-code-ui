<template>
  <div>
    <JProTable
      v-if="props.model === 'list'"
      ref="tableRef"
      :columns="props?.dataColumns"
      :request="props?.query"
      :pagination="props?.pagination"
      model="TABLE"
    >
      <template #headerTitle>
        <PermissionButton
          v-for="(item, index) in props.headerActions"
          :key="item.key"
          :type="item.type"
          v-bind:="handleFunction(item.permissionProps, slotProps)"
          style="margin-right: 10px"
          :danger="item.key === 'delete'"
          :popConfirm="
            handleFunction(item.permissionProps, slotProps)?.popConfirm
          "
        >
          <AIcon v-if="item.icon" :type="item?.icon" />
          {{ item?.text }}
        </PermissionButton>
      </template>

      <template #action="slotProps">
        <PermissionButton
          v-for="(item, index) in slotProps?.actions"
          :key="item.key"
          type="link"
          v-bind:="handleFunction(item.permissionProps, slotProps)"
          style="padding: 0"
          :danger="item.key === 'delete'"
          :popConfirm="
            handleFunction(item.permissionProps, slotProps)?.popConfirm
          "
        >
          <AIcon v-if="item.icon" :type="item?.icon" />
          {{ item?.text }}
          <j-divider type="vertical" />
        </PermissionButton>
      </template>
    </JProTable>
    <JProTable
      v-if="props.model === 'card'"
      ref="tableRef"
      :columns="props?.dataColumns"
      :request="props?.query"
      :pagination="props?.pagination"
      model="CARD"
    >
      <template #headerTitle>
        <j-button type="primary" @click="handleSave('add')">新增</j-button>
      </template>
      <template #card="slotProps">
        <Card
          status="notActive"
          :actions="slotProps?.actions"
          :record="slotProps"
          :statusText="
            slotProps[props?.cardConfig?.emphasisField] || '强调字段'
          "
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
              :src="slotProps[props?.cardConfig?.dynamicIcon]"
              class="card-icon"
            >
              <template #icon>
                <pro-image
                  :src="
                    props?.cardConfig?.customIcon ||
                    `https://www.antdv.com/#error`
                  "
                />
              </template>
            </j-avatar>
          </template>
          <template #content>
            <j-row>
              <j-col :span="12">
                <h3>
                  {{ slotProps[props?.cardConfig?.field1] || '字段1' }}
                </h3>
              </j-col>
              <j-col :span="12">
                <div class="emphasisField-text"></div>
              </j-col>
            </j-row>

            <j-row>
              <j-col :span="12">
                <div>{{ props?.cardConfig?.field2Titel }}</div>
                <div>
                  {{ slotProps[props?.cardConfig?.field2] || '字段2' }}
                </div>
              </j-col>
              <j-col :span="12">
                <div>{{ props?.cardConfig?.field3Titel }}</div>
                <div>
                  {{ slotProps[props?.cardConfig?.field3] || '字段3' }}
                </div>
              </j-col>
            </j-row>
          </template>
        </Card>
      </template>
      <template #action="slotProps"> </template>
    </JProTable>
  </div>
</template>
<script setup lang="ts">
import Card from '@/components/Card'
import { isFunction, isObject } from 'lodash-es'
const props = defineProps({
  model: {
    type: String,
    default: 'card',
  },
  dataColumns: {
    type: Array,
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
      field2Titel: '',
      field3Titel: '',
      field1: '',
      field2: '',
      field3: '',
      emphasisField: '',
      specialStyle: '',
    },
  },
  headerActions: {
    type: Array,
    default: () => [],
  },
})

const handleFunction = (item: any, data: any) => {
  if (isFunction(item)) {
    return item(data)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}
</script>
