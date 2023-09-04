<template>
  <div class="btns-config-type">
    <j-button @click="emits('update:steps', 'BtnsList')" type="text">
      <AIcon type="LeftOutlined"></AIcon>
      返回
    </j-button>
    <j-row :gutter="20">
      <j-col :span="6">
        <div class="config-type" @click="handleEditBtn('customer', '', '')">
          <div v-if="type == 'columns'">自定义操作</div>
          <div v-else>自定义按钮</div>
          <div>根据业务需求自由配置</div>
        </div>
      </j-col>
      <j-col :span="18">
        <div class="config-type">
          <template v-if="type === 'columns'">
            <div>常用操作</div>
            <div>能够满足大多数场景对单条数据的操作需求</div>
          </template>
          <template v-else>
            <div>常用按钮</div>
            <div>能够满足大多数场景对数据列表的操作需求</div>
          </template>
          <div style="padding: 10px 20px 0px 20px" v-if="type === 'columns'">
            <j-row :gutter="20">
              <j-col :span="12">
                <div class="btns" style="height: 100%;" @click="handleEditBtn('Detail', '查看详情', 'EyeOutlined')">查看详情</div>
              </j-col>
              <j-col :span="12">
                <div class="btns" style="height: 40px;margin-bottom: 10px;" @click="handleEditBtn('Update', '编辑', 'EditOutlined')">编辑</div>
                <div class="btns" style="height: 40px;" @click="handleEditBtn('Delete', '删除', 'DeleteOutlined')">删除</div>
              </j-col>
            </j-row>
          </div>
          <div style="padding: 10px 20px 0px 20px" v-else>
            <j-row :gutter="20">
              <j-col :span="12">
                <div class="btns" style="height: 40px;margin-bottom: 10px;" @click="handleEditBtn('Add', '新增', 'PlusOutlined')">新增</div>
                <div class="btns" style="height: 40px;" @click="handleEditBtn('Import', '批量导入', 'ImportOutlined')">批量导入</div>
              </j-col>
              <j-col :span="12">
                <div class="btns" style="height: 40px;margin-bottom: 10px;" @click="handleEditBtn('Delete', '批量删除', 'DeleteOutlined')">批量删除</div>
                <div class="btns" style="height: 40px;" @click="handleEditBtn('Export', '批量导出', 'ExportOutlined')">批量导出</div>
              </j-col>
            </j-row>
          </div>
        </div>
      </j-col>
    </j-row>
  </div>
</template>

<script setup lang="ts" name="BtnsType">
import {
  activeBtnKey,
  editTypeKey,
  typeKey,
  DATA_BIND
} from '../keys'
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
const dataBind:any = inject(DATA_BIND)
const type = inject(typeKey)

const emits = defineEmits<Emit>()
const handleEditBtn = (type: string, title: string, icon: string) => {
  if (editType!.value === 'add') {
    activeBtn!.value = { type, title, icon, command: type, functions: dataBind.data?.function }
  } else {
    activeBtn!.value = Object.assign(activeBtn!.value, { type, title, icon })
  }
  emits('update:steps', 'EditBtns')
}
</script>

<style scoped lang="less">
.btns-config-type {
  .config-type {
    background-color: #f2f2f2;
    padding: 10px;
    height: 100%;
    border-radius: 5px;
  }
  .btns {
    background-color: #ffffff;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    &:hover {
      background-color: #b9e3f5;
    }
  }
}
</style>
