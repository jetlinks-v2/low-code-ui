<template>
  <div class="btns-list">
    <j-space v-if="type == 'columns'">
      <span>展示</span>
      <j-switch v-model:checked="showColumns"></j-switch>
    </j-space>
    <template v-if="showColumns || type !== 'columns'">
      <div v-if="!columnsTree?.length">
        <p>
          {{
            type == 'columns'
              ? '请配置对单条数据支持操作'
              : '请配置当前页面需要的操作按钮'
          }}
        </p>
        <j-button @click="handleAddBtn()">{{
          type == 'columns' ? '添加操作' : '添加按钮'
        }}</j-button>
      </div>
      <div v-else>
        <BtnTree
          v-model:btn-list="columnsTree"
          :draggable="type === 'columns' ? false : true"
        >
          <template #config="{ data }">
            <j-button
              type="link"
              v-if="
                data.type === 'customer' && data.level === 0 && type !== 'columns'
              "
              @click="handleAddBtn(data.key)"
              >+下级</j-button
            >
            <j-button
              type="link"
              @click="handleEditBtn(data)"
              :class="{ error: errorList!.find((item) => item.key == data.key) }"
              >配置</j-button
            >
            <j-button type="link" @click="handleDel(data.key)">删除</j-button>
          </template>
        </BtnTree>
        <j-button type="text" @click="handleAddBtn()">+ {{ type == 'columns' ? '添加操作' : '添加按钮' }}</j-button>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts" name="BtnsList">
import BtnTree from './BtnTree.vue'
import { OperationConfigTreeItem } from '../type'
import {
  columnsTreeKey,
  activeBtnKey,
  editTypeKey,
  typeKey,
  parentKeyKey,
  showColumnsKey,
  errorListKey
} from '../keys'

interface Emit {
  (e: 'update:steps', value: string): void
}
const props = defineProps({
  steps: {
    type: String,
  },
})

const activeBtn = inject(activeBtnKey)
const editType = inject(editTypeKey)
const parentKey = inject(parentKeyKey)
const type = inject(typeKey)
const columnsTree = inject(columnsTreeKey)
const errorList = inject(errorListKey)
const showColumns = inject(showColumnsKey)

/**点击配置按钮 */
const handleEditBtn = (dataRef: OperationConfigTreeItem) => {
  activeBtn!.value = { ...dataRef }
  editType!.value = 'edit'
  emits('update:steps', 'EditBtns')
}
const emits = defineEmits<Emit>()

const handleAddBtn = (parent?: string) => {
  console.log(editType);
  editType!.value = 'add'
  parentKey!.value = parent
  emits('update:steps', 'BtnsType')
}

const handleDel = (key: string) => {
  columnsTree?.value.forEach((item) => {
    if (item.key === key) {
      columnsTree?.value.splice(columnsTree?.value.indexOf(item), 1)
    }
    if (item.children && item.children.length) {
      item.children = item.children.filter((child) => child.key !== key)
    }
  })
}
</script>

<style scoped>
.title {
  border-left: 1px solid;
  padding: 2px 50px 2px 10px;
  border-bottom: 1px solid;
}
.error {
  color: red;
}
</style>
