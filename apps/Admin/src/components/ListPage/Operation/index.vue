<template>
  <j-drawer
    width="25vw"
    :visible="_visible"
    :title="type == 'columns' ? '操作列' : '添加按钮'"
    @close="close"
    destroy-on-close
    :z-index="1000"
    :placement="type == 'columns' ? 'left' : 'right'"
  >
    <BtnsList
      v-model:data="columnsTree"
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
<script setup lang="ts" name="OperationColumns">
import BtnsList from './components/BtnsList.vue'
import Editbtn from './components/EditBtn.vue'
import BtnsType from './components/BtnsType.vue'
import { OperationConfigTreeItem, ErrorItemType } from './type'
import {
  activeBtnKey,
  columnsTreeKey,
  typeKey,
  showColumnsKey,
  editTypeKey,
  parentKeyKey,
  errorListKey,
} from './keys'
import { validOperationsBtn } from './index'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
})

const columnsTree = ref<OperationConfigTreeItem[]>([])

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
const activeBtn = ref<Partial<OperationConfigTreeItem>>({})
const editType = ref<'add' | 'edit'>('add')
const parentKey = ref('')
const EditBtnsRef = ref()
const showColumns = ref(true)
const errorList = ref<ErrorItemType[]>([])

const save = async () => {
  EditBtnsRef.value?.save(() => {
    steps.value = 'BtnsList'
  })
}

const valid = async () => {
  return new Promise((resolve, reject) => {
    validOperationsBtn(columnsTree.value)
    .then(() => {
      errorList.value = []
      resolve(errorList.value)
    })
    .catch((err: ErrorItemType[]) => {
      errorList.value = err
      resolve(errorList.value)
    })
  })
}

provide(activeBtnKey, activeBtn)
provide(columnsTreeKey, columnsTree)
provide(editTypeKey, editType)
provide(parentKeyKey, parentKey)
provide(typeKey, props.type)
provide(showColumnsKey, showColumns)
provide(errorListKey, errorList)

defineExpose({
  columnsTree,
  valid,
  errorList,
})
</script>
