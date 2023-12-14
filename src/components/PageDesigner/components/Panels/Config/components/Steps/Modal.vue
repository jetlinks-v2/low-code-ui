<template>
  <j-modal
      visible
      title="步骤按钮配置"
      @ok="onSave"
      :width="900"
      @cancel="emits('close')"
  >
    <div>
      <QuickEditTable
          validate
          ref="tableRef"
          :data="dataSource"
          :columns="myColumns"
          :height="300"
          :scroll="{ x: 1600, y: 300 }"
          :cellHeight="60"
      >
        <template #text="{ record, valueChange }">
          <j-input
              v-model:value="record.text"
              @change="
            () => {
              valueChange(record.text);
            }
          "
          />
        </template>
        <template #type="{ record }">
          <j-select v-model:value="record.type" style="width: 120px" placeholder="请选择">
            <j-select-option value="primary">主按钮</j-select-option>
            <j-select-option value="dashed">虚线按钮</j-select-option>
            <j-select-option value="link">链接按钮</j-select-option>
            <j-select-option value="text">文本按钮</j-select-option>
            <j-select-option value="default">次按钮</j-select-option>
          </j-select>
        </template>
        <template #danger="{ record }">
          <j-switch v-model:checked="record.danger"/>
        </template>
        <template #icon="{ record, valueChange }">
          <Icon size="small" v-model:value="record.icon" @change="() => {
            valueChange(record.icon);
          }"/>
        </template>
        <template #show="{ record, valueChange }" @change="() => {
            valueChange(record.show);
          }">
          <j-select max-tag-count="responsive" style="width: 120px" mode="multiple" show-search v-model:value="record.show" placeholder="请选择" :options="options" />
        </template>
        <template #eventCode="{ record, valueChange }">
          <Event v-model:value="record.eventCode" />
        </template>
        <template #action="{ record }">
          <j-button type="link" danger @click="onRemove(record)">
            <AIcon type="DeleteOutlined"/>
          </j-button>
        </template>
      </QuickEditTable>
      <j-button block @click="onAdd">新增</j-button>
    </div>
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, watchEffect, PropType} from "vue";
import {cloneDeep} from "lodash-es";
import Icon from "../Icon/index.vue";
import {uid} from "@LowCode/components/PageDesigner/utils/uid";
import Event from './Event.vue';
import {QuickEditTable} from '@LowCode/components/index'

const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const emits = defineEmits(['close', 'save']);
const dataSource = ref(props.value || []);
const tableRef = ref<any>();

const myColumns: any[] = [
  {
    title: "文本",
    dataIndex: "text",
    ellipsis: true,
    form: {
      rules: {
        asyncValidator: (_, value: any) => {
          if (!value) {
            return Promise.reject("请输入文本");
          }
          return Promise.resolve();
        },
      },
    },
  },
  {
    title: "类型",
    dataIndex: "type",
    ellipsis: true,
  },
  {
    title: "危险按钮",
    dataIndex: "danger",
    ellipsis: true,
    width: 100,
  },
  {
    title: "图标",
    dataIndex: "icon",
    ellipsis: true,
    width: 100,
  },
  {
    title: "显示步骤",
    dataIndex: "show",
    ellipsis: true,
  },
  {
    title: "事件配置",
    dataIndex: "eventCode",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 70,
  },
];

watchEffect(() => {
  dataSource.value = cloneDeep(props.value || []);
});

const onRemove = (dt: any) => {
  const _index = dataSource.value.findIndex((i) => {
    return i.key === dt?.key;
  });
  dataSource.value.splice(_index, 1);
};

const onAdd = () => {
  dataSource.value.push({
    key: "steps-action" + uid(4),
    text: "按钮",
    type: 'default',
    danger: false,
    eventCode: '',
  });
};

const onSave = () => {
  tableRef.value?.validates().then((_data: any) => {
    emits('save', _data)
  }).catch(() => {

  })
}
</script>
