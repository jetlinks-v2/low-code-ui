<template>
  <div class="btns-config-type">
    <j-button @click="emits('update:steps', 'BtnsList')" type="text">
      <AIcon type="LeftOutlined"></AIcon>
      返回
    </j-button>
    <div class="config-type" >
      <j-space>
        <img :src="getImage('/list-page/add.png')" alt="" />
        <h2 v-if="type == 'columns'">自定义操作</h2>
        <h2 v-else>自定义按钮</h2>
      </j-space>
      <p>根据业务需求自由配置</p>
      <j-button @click="handleEditBtn('customer', '', '')">自定义按钮</j-button>
    </div>
    <div class="config-type">
      <template v-if="type === 'columns'">
        <j-space>
          <img :src="getImage('/list-page/common-use.png')" alt="" />
          <h2>常用操作</h2>
        </j-space>
        <p>能够满足大多数场景对单条数据的操作需求</p>
      </template>
      <template v-else>
        <j-space>
          <img :src="getImage('/list-page/common-use.png')" alt="" />
          <h2>常用按钮</h2>
        </j-space>
        <div>能够满足大多数场景对数据列表的操作需求</div>
      </template>
      <div class="use-btns" v-if="type === 'columns'">
        <j-button
          class="btns"
          @click="handleEditBtn('Detail', '查看详情', 'EyeOutlined')"
          >查看详情</j-button
        >
        <j-button
          class="btns"
          @click="handleEditBtn('Update', '编辑', 'EditOutlined')"
          >编辑</j-button
        >
        <j-button
          class="btns"
          @click="handleEditBtn('Delete', '删除', 'DeleteOutlined')"
          >删除</j-button
        >
      </div>
      <div class="use-btns" v-else>
        <j-button
          class="btns"
          @click="handleEditBtn('Add', '新增', 'PlusOutlined')"
          >新增</j-button
        >
        <j-button
          class="btns"
          @click="handleEditBtn('Import', '批量导入', 'ImportOutlined')"
          >批量导入</j-button
        >
        <j-button
          class="btns"
          @click="handleEditBtn('Delete', '批量删除', 'DeleteOutlined')"
          >批量删除</j-button
        >
        <j-button
          class="btns"
          @click="handleEditBtn('Export', '批量导出', 'ExportOutlined')"
          >批量导出</j-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="BtnsType">
import { activeBtnKey, editTypeKey, typeKey, DATA_BIND } from '../keys'
import { getImage } from '@jetlinks/utils'
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

const activeBtn = inject(activeBtnKey)
const editType = inject(editTypeKey)
const dataBind: any = inject(DATA_BIND)
const type = inject(typeKey)

const emits = defineEmits<Emit>()
const handleEditBtn = (type: string, title: string, icon: string) => {
  if (editType!.value === 'add') {
    activeBtn!.value = {
      type,
      title,
      icon,
      command: type,
      functions: dataBind.data?.function,
    }
  } else {
    activeBtn!.value = Object.assign(activeBtn!.value, { type, title, icon })
  }
  emits('update:steps', 'EditBtns')
}
</script>

<style scoped lang="less">
.btns-config-type {
  .config-type {
    background-color: #F8F9FC;
    padding: 16px;
    height: 100%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    margin-bottom: 16px;
  }
  .use-btns {
    width: 100%;
    padding: 10px 20px 0px 20px;
    display: flex;
    flex-wrap: wrap;
  }
  .btns {
    margin-bottom: 16px;
    margin-right: 16px;
  }
  h2 {
    margin: 0;
    font-weight: 500;
  }
}
</style>
