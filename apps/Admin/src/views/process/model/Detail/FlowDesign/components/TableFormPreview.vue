<!-- 表格表单预览 -->
<template>
  <QuickEditTable
    validate
    ref="tableRef"
    :data="myDataSource"
    :columns="myColumns"
    :height="500"
    :scroll="{x: 1600}"
  >
    <template v-for="item in myColumns" #[item.dataIndex]="{ valueChange, record }">
      <FormItem v-model="record[item.dataIndex]" :item-type="item.type" :disabled="item.componentProps?.disabled" :component-props="item.componentProps" @change="() => { valueChange(record[item.dataIndex])}" />
    </template>
  </QuickEditTable>
<!--  <j-table-->
<!--    bordered-->
<!--    :data-source="myDataSource"-->
<!--    :columns="columns"-->
<!--    :pagination="false"-->
<!--  >-->
<!--    <template #headerCell="{ column, title }">-->
<!--      <template v-if="column.formItemProps?.required">-->
<!--        <span>-->
<!--          <div class="title">-->
<!--            {{ title }}-->
<!--          </div>-->
<!--        </span>-->
<!--      </template>-->
<!--    </template>-->
<!--    <template #bodyCell="{ column, text, record, index }">-->
<!--      <j-form-item-->
<!--        :name="[column.formId, index, column.dataIndex]"-->
<!--        :rules="!hasRules ? null : [-->
<!--          ...(column.formItemProps?.rules ?? []),-->
<!--          {-->
<!--            required: column.formItemProps?.required,-->
<!--            message: `请输入${column.formItemProps?.label}`,-->
<!--          },-->
<!--        ]"-->
<!--      >-->
<!--        <div style="min-width: 120px">-->
<!--          <component-->
<!--            :is="componentMap[column.type]"-->
<!--            :data="record"-->
<!--            v-model:value="record[column.dataIndex]"-->
<!--            :disabled="column.componentProps.disabled"-->
<!--          />-->
<!--        </div>-->
<!--      </j-form-item>-->
<!--    </template>-->
<!--  </j-table>-->
</template>

<script setup lang="ts">
// import componentMap from '@/components/FormDesigner/utils/componentMap'
import FormItem from '@/views/process/me/Detail/components/FormItem.vue'
import {
  handleFormToTable
} from "./TableFormPreviewUtil";
import {cloneDeep} from "lodash-es";

type Emits = {
  (e: 'update:dataSource', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  hasRules: {
    type: Boolean,
    default: false,
  }
})

const myDataSource = ref<any>([])

const myColumns = computed(() => {
  console.log(cloneDeep(props.columns),'columns')
  return handleFormToTable(cloneDeep(props.columns) as any[])
})

watch(
  () => props.dataSource,
  (val) => {
    myDataSource.value = val
  },
  { deep: true, immediate: true },
)
watch(
  () => myDataSource.value,
  (val) => {
    emits('update:dataSource', val)
  },
  { deep: true, immediate: true },
)
</script>

<style lang="less" scoped>
.title::after {
  position: absolute;
  top: 35%;
  left: 8px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
