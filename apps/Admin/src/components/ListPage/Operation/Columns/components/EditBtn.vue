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
  let text = '';
  switch(activeBtn.value.type) {
    case 'customer':
      text = '自定义操作'
    break
    case 'update':
      text =  '常用操作-编辑'
    break
    case 'delete':
      text = '常用操作-删除'
    break
    case 'detail':
      text =  '常用操作-查看详情'
    break
  }
  return text
})


const save = async (callback: () => void) => {
  const valid = await EditRef.value?.submit()
  if(valid) {
    if(editType.value == 'add'){
      operationButtonStore.addColumnsBtn(valid)
    } else if(editType.value == 'edit'){
      operationButtonStore.editColumnsBtn(valid)
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
