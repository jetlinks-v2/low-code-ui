<template>
  <div class="operation-drawer" ref="operationDrawer">
    <template v-if="open">
      <img class="modal-config-img" :src="getImage('/list-page/column-config.png')" v-if="type === 'columns'">
      <img class="modal-config-img" :src="getImage('/list-page/button.png')" v-else>
    </template>
    <j-drawer
      placement="right"
      width="560px"
      destroy-on-close
      :visible="_visible"
      :title="type == 'columns' ? '操作列配置' : '添加按钮配置'"
      :getContainer="() => $refs.operationDrawer"
      :wrap-style="{ position: 'absolute', zIndex: 1 }"
      @close="close"

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
        <j-button style="margin-right: 8px" @click="steps = 'BtnsList'"
          >取消</j-button
        >
        <j-button type="primary" @click="save">确定</j-button>
      </template>
    </j-drawer>
  </div>
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
  editTypeKey,
  parentKeyKey,
  errorListKey,
} from './keys'
import { validOperationsBtn } from './index'
import { PropType } from 'vue'
import { getImage } from '@jetlinks/utils';

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:columnsTree', value: OperationConfigTreeItem[]): void
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
  columnsTree: {
    type: Object as PropType<OperationConfigTreeItem[]>,
    default: () => []
  }
})

const columnsTree = computed({
  get() {
    return props.columnsTree
  },
  set(val: OperationConfigTreeItem[]) {
    emits('update:columnsTree', val)
  }
})

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
const errorList = ref<ErrorItemType[]>([])

const save = async () => {
  EditBtnsRef.value?.save(() => {
    steps.value = 'BtnsList'
  })
}

const valid = async () => {
  return new Promise((resolve, reject) => {
    errorList.value = validOperationsBtn(columnsTree.value)
    if(errorList.value.length) reject([{message: '操作按钮配置错误'}])
    else resolve([])
  })
}


provide(activeBtnKey, activeBtn)
provide(columnsTreeKey, columnsTree)
provide(editTypeKey, editType)
provide(parentKeyKey, parentKey)
provide(typeKey, props.type)
provide(errorListKey, errorList)

defineExpose({
  columnsTree,
  valid,
  errorList,
})

</script>
