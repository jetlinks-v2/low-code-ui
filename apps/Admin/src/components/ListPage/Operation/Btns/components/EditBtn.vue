<template>
  <div>
    <j-space>
      <j-button @click="emits('update:steps', 'BtnsType')" type="text">
        <AIcon type="LeftOutlined"></AIcon>
        返回
      </j-button>
      <span>{{ title }}</span>
    </j-space>
    <Edit :data="activeBtn" ref="EditRef"></Edit>
  </div>
</template>

<script setup lang="ts" name="EditBtn">
import Edit from '../../components/Edit.vue';
import { useOperationButton } from '@/store/operationButton';
interface Emit {
  (e: 'update:steps', value: string): void
}
const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  steps: {
    type: String,
  },
})

const emits = defineEmits<Emit>()
const EditRef = ref();
const operationButtonStore = useOperationButton()
const activeBtn = inject('activeBtn') as Record<string, any>
const editType = inject('editType') as Record<string, any>
const title = computed(() => {
  return activeBtn.value.type == 'customer'
    ? '自定义操作'
    : activeBtn.value.type == 'add'
    ? '常用操作-新增'
    : '常用操作-批量导入/导出/删除'
})


const save = async (callback: () => void) => {
  const valid = await EditRef.value?.submit()
  if(valid) {
    if(editType.value == 'add'){
      operationButtonStore.addBtn(valid)
    } else if(editType.value == 'edit'){
      operationButtonStore.editBtn(valid)
    }
    callback && callback();
  }
}

defineExpose({
  save,
})
</script>
<style scoped lang="less">
form {
  padding: 20px;
}
</style>
