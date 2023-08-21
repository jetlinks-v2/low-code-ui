<template>
  <div class="btns-config-type">
    <j-button @click="emits('update:steps', 'BtnsList')" type="text">
      <AIcon type="LeftOutlined"></AIcon>
      返回
    </j-button>
    <j-row :gutter="20">
      <j-col :span="6">
        <div class="config-type" @click="handleEditBtn('customer', '', '')">
          <div>自定义操作</div>
          <div>根据业务需求自由配置</div>
        </div>
      </j-col>
      <j-col :span="18">
        <div class="config-type">
          <div>常用操作</div>
          <div>能够满足大多数场景对单挑数据的操作需求</div>
          <div style="padding: 10px 20px 0px 20px">
            <j-row :gutter="20">
              <j-col :span="12">
                <div class="btns" style="height: 100%;" @click="handleEditBtn('detail', '查看详情', 'EyeOutlined')">查看详情</div>
              </j-col>
              <j-col :span="12">
                <div class="btns" style="height: 40px;margin-bottom: 10px;" @click="handleEditBtn('update', '编辑', 'EditOutlined')">编辑</div>
                <div class="btns" style="height: 40px;" @click="handleEditBtn('delete', '编辑', 'DeleteOutlined')">删除</div>
              </j-col>
            </j-row>
          </div>
        </div>
      </j-col>
    </j-row>
  </div>
</template>

<script setup lang="ts" name="EditBtn">
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

const activeBtn = inject('activeBtn') as Record<string, any>
const editType = inject('editType') as Record<string, any>

const emits = defineEmits<Emit>()
const handleEditBtn = (type: string, title: string, icon: string) => {
  if (editType.value === 'add') {
    activeBtn.value = { type, title, icon }
  } else {
    activeBtn.value = Object.assign(activeBtn.value, { type, title, icon })
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
