
<template>
 <QuickEditTable 
      validate
      ref="tableRef"
      :data="dataSource"
      :columns="myColumns">
      <template #key="{ record, valueChange }">
         <j-select
            v-model:value="record.key"
            placeholder="请选择依赖项"
            :options="options"
            @change="
            () => {
              onChange()
              valueChange(record.key);
            }
          "
        />
      </template>
      <template #value="{ record, valueChange }">
        <j-input
          v-model:value="record.value"
          placeholder="请输入参数值"
          @change="
            () => {
              onChange()
              valueChange(record.value);
            }
          "
        />
      </template>
 </QuickEditTable>
</template>

<script setup >
import { useTarget } from '../../../../../hooks'
import {QuickEditTable} from '@LowCode/components/index'

const { target } = useTarget()
const props = defineProps({
  queryParams:{
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:queryParams', 'change'])
const dataSource = ref([]);
const designer = inject('PageDesigner')
const tableRef = ref();

const myColumns = [
  {
    title: "参数名称",
    dataIndex: "name",
    ellipsis: true,
    // width: 200,
  },
  {
    title: "依赖项",
    dataIndex: "key",
    ellipsis: true,
    // width: 200,
  },
  {
    title: "参数值",
    dataIndex: "value",
    ellipsis: true,
    // width: 200,
    // form: {
    //   rules: {
    //     asyncValidator: (_, value) => {
    //       if (!value) {
    //         return Promise.reject("参数值");
    //       }
    //       return Promise.resolve();
    //     },
    //   },
    // },
  },
];

const options = computed(() => {
  // 过滤自己
  return Object.keys(designer.dependencies.value).filter(key => key !== target.value.id).map((key) => {
    return {
      label: designer.dependencies[key],
      value: key
    }
  })
})

const onChange = () => {
  emit('update:queryParams', dataSource.value);
}

watch(
  ()=>props.queryParams,
  ()=>{
    dataSource.value = props.queryParams;
  },
  {deep:true,immediate:true}
)
  

</script>

<style scoped lang='less'>

</style>