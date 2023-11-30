<template>
  <j-modal
    visible
    title="配置搜索项"
    :width="800"
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
            <EditorBtn
              :value="JSON.stringify(record.search?.options || [])"
              text="配置"
              language="json"
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

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { componentType } from "jetlinks-ui-components/es/Search/setting";
import { uid } from "../../../../../utils/uid";
import { cloneDeep } from "lodash-es";
import EditorBtn from "../EditorBtn.vue";
import { regular } from "@jetlinks-web/utils";

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

const options = Object.keys(componentType).map((i) => {
  return {
    label: i,
    value: i,
  };
});

const tableRef = ref<any>();

const myColumns: any[] = [
  {
    title: "下标",
    dataIndex: "dataIndex",
    // width: 200,
    form: {
      rules: {
        asyncValidator: (rule, value, callback, source) => {
          if (!value) {
            return Promise.reject("请输入下标");
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

const onChange = (arr: any, _record: any) => {
  dataSource.value.forEach((item) => {
    if (item.dataIndex === _record.dataIndex) {
      item.search.options = JSON.parse(arr || "[]");
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

