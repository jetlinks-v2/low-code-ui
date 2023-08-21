<template>
  <j-drawer
    width="25vw"
    :visible="_visible"
    title="添加按钮"
    @close="close"
    destroy-on-close
    :z-index="1000"
    placement="right"
  >
    <BtnsList
      v-if="steps == 'BtnsList'"
      v-model:steps="steps"
    />
    <Editbtn
      v-else-if="steps == 'EditBtns'"
      v-model:steps="steps"
      ref="EditBtnsRef"
    />
    <BtnsType v-else-if="steps == 'BtnsType'" v-model:steps="steps" />
    <template #footer v-if="steps == 'EditBtns'">
      <a-button style="margin-right: 8px" @click="steps = 'BtnsList'"
        >取消</a-button
      >
      <a-button type="primary" @click="save">确定</a-button>
    </template>
  </j-drawer>
</template>
<script setup lang="ts" name="OperationBtns">
import BtnsList from './components/BtnsList.vue'
import Editbtn from './components/EditBtn.vue'
import BtnsType from './components/BtnsType.vue'
import { BtnProps } from '../type'
import { useOperationButton } from '@/store/operationButton'
import { storeToRefs } from 'pinia'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const operationButtonStore = useOperationButton()

const { btnTree } = storeToRefs(operationButtonStore)

const steps = ref('BtnsList')
const _visible = computed({
  get() {
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})

const close = () => {
  steps.value = 'BtnsList'
  emits('update:open', false)
}


/**编辑的按钮 */
const activeBtn = ref<Partial<BtnProps>>({})
const editType = ref<'add' | 'edit'>('add');
const EditBtnsRef = ref()

const save = async () => {
  EditBtnsRef.value?.save(() => {
    steps.value = 'BtnsList';
  });
}

provide('activeBtn', activeBtn)
provide('editType', editType)
</script>
