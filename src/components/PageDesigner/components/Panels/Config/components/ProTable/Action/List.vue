<template>
  <div style="height: 332px">
    <QuickEditTable
        validate
        ref="tableRef"
        style="height: calc(100% - 32px)"
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
              onChange()
            }
          "
        />
      </template>
      <template #danger="{ record }">
        <j-switch v-model:checked="record.danger" @change="onChange()" />
      </template>
      <template #icon="{ record, valueChange }">
        <Icon size="small" v-model:value="record.icon" @change="() => {
          valueChange(record.icon);
          onChange()
        }" />
      </template>
      <template #event="{ record, valueChange }">
        <ButtonConfig :type="'table'" v-model:value="record.event" @change="() => {
          valueChange(record.event);
          onChange()
        }" />
      </template>
      <template #action="{ record }">
        <j-button type="link" danger @click="onRemove(record)"
        >
          <AIcon type="DeleteOutlined"
          />
        </j-button>
      </template>
    </QuickEditTable>
    <j-button block @click="onAdd">新增</j-button>
  </div>
</template>

<script lang="ts" setup>
import {ref, watchEffect, PropType} from "vue";
import {cloneDeep} from "lodash-es";
import Icon from "../../Icon/index.vue";
import {uid} from "@LowCode/components/PageDesigner/utils/uid";
import ButtonConfig from '../../ButtonConfig/index.vue';
import {QuickEditTable} from '@LowCode/components/index'

const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const emits = defineEmits(['update:value']);
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
    title: "危险按钮",
    dataIndex: "danger",
    ellipsis: true,
  },
  {
    title: "图标",
    dataIndex: "icon",
    ellipsis: true,
    width: 120,
    form: {
      rules: {
        asyncValidator: (_, value: any) => {
          if (!value) {
            return Promise.reject("请选择图标");
          }
          return Promise.resolve();
        },
      },
    },
  },
  {
    title: "事件配置",
    dataIndex: "event",
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
  onChange()
};

const onAdd = () => {
  dataSource.value.push({
    key: "table-action" + uid(4),
    text: "按钮",
    danger: false,
    event: undefined
  });
  onChange()
};

const onChange = () => {
  emits('update:value', unref(dataSource))
}

const onSave = () => new Promise((resolve, reject) => {
  tableRef.value?.validates().then((_data: any) => {
    resolve(_data);
  }).catch(() => {
    reject(false)
  })
});

defineExpose({ onSave });
</script>

