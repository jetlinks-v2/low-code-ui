<template>
  <j-modal
    visible
    :title="type === 'search' ? '配置搜索项' : '配置表格列'"
    :width="800"
    @ok="onSave"
    @cancel="emits('close')"
  >
    <QuickEditTable
      validate
      ref="tableRef"
      :data="dataSource"
      :columns="myColumns"
      style="height: 532px"
      :height="500"
      :scroll="{ x: 1600, y: 500 }"
    >
      <template #dataIndex="{ record, valueChange }">
        <j-input
          v-model:value="record.dataIndex"
          @change="
            () => {
              valueChange(record.dataIndex);
            }
          "
        />
      </template>
      <template #title="{ record, valueChange }">
        <j-input
          v-model:value="record.title"
          @change="
            () => {
              valueChange(record.title);
            }
          "
        />
      </template>
      <template v-if="type === 'table'" #render="{ record, valueChange }">
        <RenderConfig v-model:value="record.render" />
      </template>
      <template v-if="type === 'search'" #search="{ record, valueChange }">
        <div style="display: flex; justify-content: space-between">
          <j-select
            placeholder="请选择"
            :options="options"
            :style="{
              width: record.search?.type !== 'select' ? '100%' : '60%',
            }"
            v-model:value="record.search.type"
            @change="
              () => {
                valueChange(record.search);
              }
            "
          />
          <template
            v-if="['select', 'treeSelect'].includes(record.search?.type)"
          >
            <Modal
              :value="record.search?.options"
              @change="(val) => onChange(record, val)"
            />
          </template>
        </div>
      </template>
      <template #action="{ record }">
        <j-button danger @click="onRemove(record)"
          ><AIcon type="DeleteOutlined"
        /></j-button>
      </template>
    </QuickEditTable>
    <j-button block @click="onAdd">新增</j-button>
  </j-modal>
</template>

<script lang="ts" setup name="SearchConfig">
import { ref, watchEffect } from "vue";
import { uid } from "../../../../../utils/uid";
import { cloneDeep } from "lodash-es";
import Modal from "./Modal.vue";
import { regular } from "@jetlinks-web/utils";
import RenderConfig from './renderConfig.vue'
import {QuickEditTable} from '@LowCode/components/index'

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  type: {
    type: String,
    default: "search",
  },
});

const emits = defineEmits(["save", "close"]);
const dataSource = ref(props.data);

const options = [
  {
    label: '输入框',
    value: 'input',
  },
  {
    label: '选择框',
    value: 'select',
  },
  {
    label: '数字输入框',
    value: 'inputNumber',
  },
  {
    label: '时间选择',
    value: 'time',
  },
  {
    label: '日期选择',
    value: 'date',
  },
  {
    label: '时间范围选择',
    value: 'timeRange',
  },
  {
    label: '日期范围选择',
    value: 'rangePicker',
  },
  {
    label: '树选择',
    value: 'treeSelect',
  },
]

const tableRef = ref<any>();

const myColumns: any[] = [
  {
    title: "key",
    dataIndex: "dataIndex",
    // width: 200,
    form: {
      rules: {
        asyncValidator: (rule, value, callback, source) => {
          if (!value) {
            return Promise.reject("请输入key");
          }
          if (!regular.isModalReg(value)) {
            return Promise.reject(
              "请以小写字母开头，使用字母、数字和下划线完成命名"
            );
          }
          const someName = dataSource.value
            .filter((item) => item.index !== source.record.index)
            .some((item) => item.name === value);
          if (someName) {
            return Promise.reject("有重复下标");
          }
          return Promise.resolve();
        },
      },
    },
  },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    // width: 200,
    form: {
      rules: {
        asyncValidator: (_, value) => {
          if (!value) {
            return Promise.reject("请输入标题");
          }
          return Promise.resolve();
        },
      },
    },
  },
];

watchEffect(() => {
  if (props.type === "search") {
    myColumns.push({
      title: "类型",
      dataIndex: "search",
      // width: 250,
      form: {
        rules: {
          asyncValidator: (_, value) => {
            console.log(value)
            if (!value?.type) {
              return Promise.reject("请选择类型");
            }
            if (
              ["select", "treeSelect"].includes(value?.type) &&
              !value?.options
            ) {
              return Promise.reject("请配置options");
            }
            return Promise.resolve();
          },
        },
      },
    });
  } else {
    myColumns.push({
      title: 'render',
      dataIndex: 'render',
    })
  }
  myColumns.push({
    title: "操作",
    dataIndex: "action",
    width: 100,
  });
});

watchEffect(() => {
  dataSource.value = cloneDeep(props.data || []);
});

const onRemove = (dt: any) => {
  const _index = dataSource.value.findIndex((i) => {
    return i.dataIndex === dt?.dataIndex;
  });
  dataSource.value.splice(_index, 1);
};

const onAdd = () => {
  dataSource.value.push({ dataIndex: (props.type || "search") + uid(4), search: {} });
};

const onChange = (_record: any, obj: any) => {
  dataSource.value.forEach((item) => {
    if (item.dataIndex === _record.dataIndex) {
      item.search.options = obj
    }
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

