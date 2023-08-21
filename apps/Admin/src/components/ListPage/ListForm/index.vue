<template>
  <div class="list-form-center">
    <j-drawer
      title="列表形态配置"
      placement="left"
      :closable="true"
      :visible="open"
      @close="open = false"
    >
      <div v-if="!state.configurationShow">
        <p>数据展示方式</p>
        <div class="j-check-button">
          <div
            :class="[
              'j-check-button-item',
              state.configured.includes('list') ? 'selected' : '',
            ]"
            @click="configuredChange('list')"
          >
            数据列表
          </div>

          <div
            :class="[
              'j-check-button-item',
              state.configured.includes('card') ? 'selected' : '',
            ]"
            @click="configuredChange('card')"
          >
            卡片列表
          </div>
        </div>
        <div v-if="state.configured.includes('card')">
          <p class="title">卡片配置</p>
          <j-button style="width: 300px" @click="state.configurationShow = true"
            >配置</j-button
          >
        </div>

        <div v-if="state.configured?.length === 2">
          <p class="title">默认形态</p>
          <j-radio-group v-model:value="state.defaultForm" button-style="solid">
            <j-radio-button value="list" class="check-btn">
              数据列表
            </j-radio-button>

            <j-radio-button value="card" class="check-btn">
              卡片列表
            </j-radio-button>
          </j-radio-group>
        </div>
      </div>

      <div v-if="state.configurationShow" class="card-type">
        <a-page-header @back="back" title=" ">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <Card ref="cardRef" />
      </div>
      <template #footer>
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="cancel">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useListFormStore } from '@/store/listForm'
import Card from '@/components/ListPage/ListForm/components/Card.vue'
const open = ref<boolean>(true)
const cardRef = ref()
//数组展示方式，卡片配置显示隐藏
const state = reactive({
  type: 'list',
  configured: ['list'],
  configurationShow: false,
  defaultForm: 'list',
})
//卡片配置返回
const back = () => {
  state.configurationShow = false
}
const configurationStore = useListFormStore()
//取消
const cancel = () => {
  if (state.configurationShow) {
    back()
  } else {
    open.value = false
  }
}
//提交
const submit = async () => {
  let data: any = {}
  const vaildate = await cardRef.value?.vaildate()
  if (vaildate) {
    data = { ...configurationStore.getListFormInfo() }
    state.configurationShow = false
  }
  data.type = state.type
}
//已配置数据展示方式，默认数据列表
const configuredChange = (value: string) => {
  if (state.configured?.length === 1 && state.configured[0] === value) {
    state.configured[0] = 'list'
  } else {
    const index = state.configured.findIndex((item: any) => item === value)
    state.configured.includes(value)
      ? state.configured.splice(index, 1)
      : state.configured.push(value)
  }
  state.defaultForm =
    state.configured?.length === 1 ? state.configured[0] : 'list'
}
defineExpose({
  open: open.value,
})
</script>

<style lang="less" scoped>
.check-btn {
  width: 150px;
  text-align: center;
}
.card-type {
  .ant-page-header {
    padding: 0;
  }
}
.j-check-button {
  display: flex;
  width: 100%;
  .j-check-button-item:first-child {
    border-left: 1px solid #d9d9d9;
    border-radius: 2px 0 0 2px;
  }
  .j-check-button-item {
    width: 150px;
    position: relative;
    display: inline-block;
    height: 32px;
    margin: 0;
    padding: 0 15px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 30px;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-top-width: 1.02px;
    border-left-width: 0;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: var(--ant-primary-color);
    }

    &.selected {
      color: #fff;
      background: var(--ant-primary-color);
      border-color: var(--ant-primary-color);
    }
  }
}
.title {
  margin-top: 20px;
}
</style>
