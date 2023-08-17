<template>
  <div v-if="!btnTree.length">
    <p>请配置当前页面需要的操作按钮</p>
    <j-button @click="handleAddBtn()">添加按钮</j-button>
  </div>
  <div v-else>
    <BtnTree v-model:btn-list="btnTree">
      <template #config="{ data }">
        <j-button type="link" v-if="data.type == 'customer' && data.level === 0" @click="handleAddBtn(data.key)">+下级</j-button>
        <j-button type="link" @click="handleEditBtn(data)">配置</j-button>
        <j-button type="link" @click="handleDel(data.key)">删除</j-button>
      </template>
    </BtnTree>
    <j-button type="text" @click="handleAddBtn()">+ 添加按钮</j-button> 
  </div>
</template>
<script setup lang="ts" name="BtnsList">
import { BtnProps } from '../type';
import { useOperationButton } from '@/store/operationButton';
import { storeToRefs } from 'pinia';
import BtnTree from '../../Components/BtnTree.vue';

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
const { btnTree, parentKey } = storeToRefs(operationButtonStore);
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
  operationButtonStore.delBtn(key)
}

</script>

<style scoped>
.title {
  border-left: 1px solid;
  padding: 2px 50px 2px 10px;
  border-bottom: 1px solid;
}
</style>
