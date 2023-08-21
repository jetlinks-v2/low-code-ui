<template>
  <div class="btns-config-type">
    <j-button @click="emits('update:steps', 'BtnsList')" type="text">
      <AIcon type="LeftOutlined"></AIcon>
      返回
    </j-button>
    <j-row :gutter="20">
      <j-col :span="6">
        <div class="config-type" @click="handleEditBtn('customer', '', '')">
          <div>自定义按钮</div>
          <div>根据业务需求自由配置</div>
        </div>
      </j-col>
      <j-col :span="18">
        <div class="config-type"> 
          <div>常用按钮</div>
          <div>能够满足大多数场景对数据列表的操作需求</div>
          <j-row :gutter="20">
            <j-col :span="12">
              <j-button style="width: 100%;" @click="handleEditBtn('add', '新增', 'PlusOutlined')">新增</j-button>
            </j-col>
            <j-col :span="12">
              <j-button style="width: 100%;" @click="handleEditBtn('import', '批量导入', 'ImportOutlined')">批量导入</j-button>
            </j-col>
          </j-row>
          <j-row :gutter="20">
            <j-col :span="12">
              <j-button style="width: 100%;" @click="handleEditBtn('delete', '批量删除', 'DeleteOutlined')">批量删除</j-button>
            </j-col>
            <j-col :span="12">
              <j-button style="width: 100%;" @click="handleEditBtn('export', '批量导出', 'ExportOutlined')">批量导出</j-button>
            </j-col>
          </j-row>
        </div>
      </j-col>
    </j-row>
  </div>
</template>

<script setup lang="ts" name="EditBtn">

interface Emit {
  (e: 'update:steps', value: string): void;
}
const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  steps: {
    type: String,
  }
})

const activeBtn = inject('activeBtn') as Record<string, any>
const editType = inject('editType') as Record<string, any>;

const emits = defineEmits<Emit>();
const handleEditBtn = (type: string, title: string, icon: string) => {
  if(editType.value === 'add') {
    activeBtn.value = {type, title, icon}
  } else {
    activeBtn.value = Object.assign(activeBtn.value, {type, title, icon})
  }
  emits('update:steps', 'EditBtns');
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
}
</style>