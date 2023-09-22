<template>
  <div class="btns-list">
    <j-form layout="vertical" v-if="type === 'columns'">
      <j-form-item label="展示">
        <j-switch v-model:checked="showColumns"></j-switch>
      </j-form-item>
    </j-form>
    <template v-if="showColumns || type !== 'columns'">
      <div >
        <p>
          {{
            type == 'columns'
              ? '请配置对单条数据支持操作'
              : '请配置当前页面需要的操作按钮'
          }}
        </p>
        <j-button v-if="!columnsTree?.length" class="add-btn" @click="handleAddBtn()" type="dashed">{{
          type == 'columns' ? '添加操作' : '添加按钮'
        }}</j-button>
      </div>
      <div v-if="columnsTree?.length">
        <BtnTree
          v-model:btn-list="columnsTree"
          :draggable="type === 'columns' ? false : true"
        >
          <template #title="{ data }">
            <span :class="{ error: errorList!.find((item) => item.key == data.key) }">{{ data.title }}</span>
          </template>
          <template #config="{ data }">
            <j-space size="middle">
              <AIcon
                v-if="
                  data.type === 'customer' &&
                  data.level === 0 &&
                  type !== 'columns'
                "
                type="PlusOutlined"
                @click="handleAddBtn(data.key)"
              />
                <AIcon
                  type="EditOutlined"
                  :class="{ error: errorList!.find((item) => item.key == data.key) }"
                  class="primary"
                  @click="handleEditBtn(data)"
                />
              <AIcon type="DeleteOutlined" @click="handleDel(data.key)" class="danger"/>
            </j-space>
          </template>
        </BtnTree>
        <j-button class="add-btn" type="dashed" @click="handleAddBtn()"
          >+ {{ type == 'columns' ? '添加操作' : '添加按钮' }}</j-button
        >
      </div>
    </template>
  </div>
</template>
<script setup lang="ts" name="BtnsList">
import BtnTree from './BtnTree.vue'
import { OperationConfigTreeItem } from '../type'
import { ErrorItem } from '../..';
import {
  columnsTreeKey,
  activeBtnKey,
  editTypeKey,
  typeKey,
  parentKeyKey,
  showColumnsKey,
  errorListKey,
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
  console.log(editType)
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

<style scoped lang="less">
.btns-list {
  width: 320px;
  .add-btn {
    width: 100%;
  }
  .danger {
    color: #E50012;
  }
  .primary {
    color: @primary-color;
  }
}
.title {
  border-left: 1px solid;
  padding: 2px 50px 2px 10px;
  border-bottom: 1px solid;
}
.error {
  color: #E50012 !important;
}
:deep(.ant-tree-switcher-noop) {
  opacity: 0;
}
</style>
