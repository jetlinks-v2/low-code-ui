<template>
  <j-modal
      visible
      title="配置菜单"
      @ok="onSave"
      :width="1200"
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
        <template #danger="{ record }">
          <j-switch v-model:checked="record.danger"/>
        </template>
        <template #block="{ record }">
          <j-switch v-model:checked="record.block"/>
        </template>
        <template #icon="{ record }">
          <Icon size="small" v-model:value="record.icon"/>
        </template>
        <template #event="{ record, valueChange }">
          <ButtonConfig v-model:value="record.event" @change="() => {
          valueChange(record.event);
          onChange()
        }"/>
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
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, watchEffect, PropType} from "vue";
import {cloneDeep} from "lodash-es";
import Icon from "../../Icon/index.vue";
import {uid} from "@LowCode/components/PageDesigner/utils/uid";
import ButtonConfig from '../../ButtonConfig/index.vue';
import {QuickEditTable} from '@LowCode/components/index'

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const emits = defineEmits(['close', 'save']);
const dataSource = ref(props.data || []);
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
  },
  {
    title: "大小",
    dataIndex: "size",
    ellipsis: true,
  },
  {
    title: "危险按钮",
    dataIndex: "danger",
    ellipsis: true,
  },
  {
    title: "block按钮",
    dataIndex: "block",
    ellipsis: true,
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
  },
];

watchEffect(() => {
  dataSource.value = cloneDeep(props.data || []);
});

const onChange = () => {
  emits('update:value', unref(dataSource))
}

const onRemove = (dt: any) => {
  const _index = dataSource.value.findIndex((i) => {
    return i.key === dt?.key;
  });
  dataSource.value.splice(_index, 1);
  onChange()
};

const onAdd = () => {
  dataSource.value.push({
    key: "menu" + uid(4),
    text: "菜单",
    shape: "default",
    size: "middle",
    type: "primary",
    block: false,
    danger: false,
    event: undefined
  });
  onChange()
};

const onSave = () => new Promise((resolve, reject) => {
  tableRef.value?.validates().then((_data: any) => {
    if(_data){
      emits('save', _data)
    }
  })
});

defineExpose({onSave});
</script>

