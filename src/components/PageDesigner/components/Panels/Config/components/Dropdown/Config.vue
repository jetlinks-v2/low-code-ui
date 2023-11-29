<template>
  <j-modal
    visible
    title="配置下拉菜单"
    :width="1100"
    @ok="onSave"
    @cancel="emits('close')"
  >
    <QuickEditTable
      validate
      ref="tableRef"
      :data="dataSource"
      :columns="myColumns"
      :height="500"
      :scroll="{ x: 1600, y: 500 }"
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
        <j-select v-model:value="record.type">
          <j-select-option value="primary">主按钮</j-select-option>
          <j-select-option value="dashed">虚线按钮</j-select-option>
          <j-select-option value="link">链接按钮</j-select-option>
          <j-select-option value="text">文本按钮</j-select-option>
          <j-select-option value="default">次按钮</j-select-option>
        </j-select>
      </template>
      <template #shape="{ record }">
        <j-select
          v-model:value="record.shape"
          :options="[
            { label: 'round', value: 'round' },
            { label: 'circle', value: 'circle' },
            { label: '默认', value: 'default' },
          ]"
        />
      </template>
      <template #size="{ record }">
        <j-select
          v-model:value="record.size"
          :options="[
            { label: '大', value: 'large' },
            { label: '中', value: 'middle' },
            { label: '小', value: 'small' },
          ]"
        />
      </template>
      <template #ghost="{ record }">
        <j-switch v-model:checked="record.ghost" />
      </template>
      <template #danger="{ record }">
        <j-switch v-model:checked="record.danger" />
      </template>
      <template #block="{ record }">
        <j-switch v-model:checked="record.block" />
      </template>
      <template #icon="{ record }">
        <Icon size="small" v-model:value="record.icon" />
      </template>
      <template #event="{ record }">
        <j-button @click="visible=true">配置</j-button>
      </template>
      <template #action="{ record }">
        <j-button type="link" danger @click="onRemove(record)"
          ><AIcon type="DeleteOutlined"
        /></j-button>
      </template>
    </QuickEditTable>

    <j-button block @click="onAdd">新增</j-button>
    <EventConfig v-if="visible" @closeConfig="visible=false"/>
  </j-modal>
</template>

<script lang="ts" setup>
import { ref, watchEffect, PropType } from "vue";
import { uid } from "../../../../../utils/uid";
import { cloneDeep } from "lodash-es";
import Icon from "../Icon/index.vue";
import EventConfig from './EventConfig.vue'

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const emits = defineEmits(["save", "close"]);
const dataSource = ref(props.data);
const visible = ref(false)
const tableRef = ref<any>();

const myColumns: any[] = [
  {
    title: "文本",
    dataIndex: "text",
    ellipsis: true,
    width: 150,
    form: {
      rules: {
        asyncValidator: (_, value) => {
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
    width: 120,
  },
  {
    title: "形状",
    dataIndex: "shape",
    ellipsis: true,
    width: 100,
  },
  {
    title: "大小",
    dataIndex: "size",
    ellipsis: true,
    width: 100,
  },
  {
    title: "幽灵属性",
    dataIndex: "ghost",
    ellipsis: true,
    width: 90,
  },
  {
    title: "危险按钮",
    dataIndex: "danger",
    ellipsis: true,
    width: 90,
  },
  {
    title: "block按钮",
    dataIndex: "block",
    ellipsis: true,
    width: 100,
  },
  {
    title: "图标",
    dataIndex: "icon",
    ellipsis: true,
    width: 120,
  },
  {
    title: "事件配置",
    dataIndex: "event",
    ellipsis: true,
    width: 120,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 70,
  },
];

watchEffect(() => {
  dataSource.value = cloneDeep(props.data || []);
});

const onRemove = (dt: any) => {
  const _index = dataSource.value.findIndex((i) => {
    return i.key === dt?.key;
  });
  dataSource.value.splice(_index, 1);
};

const onAdd = () => {
  dataSource.value.push({
    key: "menu" + uid(4),
    text: "菜单",
    shape: "default",
    size: "middle",
    type: "primary",
    ghost: false,
    block: false,
    danger: false,
  });
};

const onSave = () => {
  tableRef.value?.validates().then((resp: any) => {
    if (resp) {
      emits("save", dataSource.value);
    }
  });
};
</script>

