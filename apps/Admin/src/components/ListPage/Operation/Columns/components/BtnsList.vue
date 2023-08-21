<template>
  <j-space>
    <span>展示</span>
    <j-switch v-model:checked="showColumns"></j-switch>
  </j-space>
  <template v-if="showColumns">
    <div v-if="!columnsTree.length">
      <p>请配置对单条数据支持操作</p>
      <j-button @click="handleAddBtn()">添加操作</j-button>
    </div>
    <div v-else>
      <BtnTree v-model:btn-list="columnsTree" :draggable="false">
        <template #config="{ data }">
          <j-button type="link" @click="handleEditBtn(data)">配置</j-button>
          <j-button type="link" @click="handleDel(data.key)">删除</j-button>
        </template>
      </BtnTree>
      <j-button type="text" @click="handleAddBtn()">+ 添加操作</j-button> 
    </div>
  </template>
</template>
<script setup lang="ts" name="BtnsList">
import { BtnProps } from '../../type';
import { useOperationButton } from '@/store/operationButton'
import { storeToRefs } from 'pinia';
import BtnTree from '../../components/BtnTree.vue';

interface Emit {
  (e: 'update:steps', value: string): void;
}
const props = defineProps({
  steps: {
    type: String,
  }
})

const operationButtonStore = useOperationButton();
const activeBtn = inject('activeBtn') as Record<string, any>;
const editType = inject('editType') as Record<string, any>;
const { columnsTree, parentKey, showColumns } = storeToRefs(operationButtonStore);
/**点击配置按钮 */
const handleEditBtn = (dataRef: BtnProps) => {
  activeBtn.value = {...dataRef}
  editType.value = 'edit'
  emits('update:steps', 'EditBtns')
}
const emits = defineEmits<Emit>();

const handleAddBtn = (parent?: string) => {
  editType.value = 'add'
  parentKey.value = parent;
  emits('update:steps', 'BtnsType')
}

const handleDel = (key: string) => {
  operationButtonStore.delColumnsBtn(key)
}

</script>

<style scoped>
.title {
  border-left: 1px solid;
  padding: 2px 50px 2px 10px;
  border-bottom: 1px solid;
}
</style>
