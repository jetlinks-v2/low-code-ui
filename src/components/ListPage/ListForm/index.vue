<template>
  <div class="list-form-center" ref="listFormRef">
    <img
      class="modal-config-img"
      :src="getImage('/list-page/form.png')"
      v-if="open"
    />
    <j-drawer
      title="列表形态配置"
      placement="right"
      width="560px"
      :closable="true"
      :visible="open"
      :getContainer="() => $refs.listFormRef"
      :destroyOnClose="true"
      :wrap-style="{ position: 'absolute', zIndex: 1, overflow: 'hidden' }"
      @close="emits('update:open', false)"
    >
      <j-form v-if="!showType!.configurationShow" layout="vertical">
        <j-form-item
          label="数据展示方式"
          :rules="{
            required: true,
          }"
        >
          <div class="j-check-btn">
            <div :class="classList" @click="configuredChange('list')">
              数据列表
            </div>

            <div :class="classCard" @click="configuredChange('card')">
              卡片列表
            </div>
          </div>
        </j-form-item>
        <j-form-item v-if="showType.configured.includes('list')" label="数据列展示控制">
          <j-switch v-model:checked="showType.showColumns"></j-switch>
        </j-form-item>
        <j-form-item
          label="卡片配置"
          v-if="showType.configured?.includes('card')"
          :rules="{
            required: true,
          }"
        >
          <j-badge :count="errorList.length">
            <j-button
              :style="{
                width: '300px',
                border: errorList.length ? '1px solid red' : '',
              }"
              @click="showType.configurationShow = true"
              >
              <div class="config-done" v-if="listFormInfo.field1?.length > 0">
                <AIcon type="CheckOutlined"/>
              </div>
              配置</j-button
            >
          </j-badge>
        </j-form-item>

        <j-form-item label="默认形态" v-if="showType.configured?.length === 2">
          <j-radio-group
            v-model:value="showType.defaultForm"
            button-style="solid"
          >
            <j-radio-button value="list" class="check-btn">
              数据列表
            </j-radio-button>

            <j-radio-button value="card" class="check-btn">
              卡片列表
            </j-radio-button>
          </j-radio-group>
        </j-form-item>
      </j-form>

      <div v-if="showType!.configurationShow" class="card-type">
        <a-page-header @back="back" title=" ">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <Card ref="cardRef" :id="props.id" :errorList="errorList" />
      </div>
      <template #footer>
        <j-space size="large">
          <j-button @click="cancel"> 取消 </j-button>
          <j-button style="margin-right: 8px" type="primary" @click="submit">
            确定
          </j-button>
        </j-space>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/ListPage/ListForm/components/card.vue'
import { clone, cloneDeep } from 'lodash-es'
import { validListForm } from './utils/valid'
import { LIST_FORM_INFO, SHOW_TYPE_KEY } from '../keys'
import { PropType } from 'vue'
import { getImage } from '@jetlinks-web/utils'

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:listFormInfo', value: any): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
  },
  listFormInfo: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
})

const listFormInfo = computed({
  get() {
    return props.listFormInfo
  },
  set(val) {
    emits('update:listFormInfo', val)
  },
})
const open = computed({
  get() {
    if (props.open) {
      Object.assign(showType, cloneDeep(showTypeInject))
    }
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})
const classCard = computed(() => {
  return {
    'j-check-btn-item': true,
    selected: showType.configured?.includes('card'),
  }
})
const classList = computed(() => {
  return {
    'j-check-btn-item': true,
    selected: showType.configured?.includes('list'),
  }
})

const cardRef = ref()
//数组展示方式，卡片配置显示隐藏

const showTypeInject = inject(SHOW_TYPE_KEY)
const showType = reactive({
  type: 'list',
  configured: ['list'],
  configurationShow: false,
  defaultForm: 'list',
  showColumns: false,
})
//卡片配置返回
const back = () => {
  showType!.configurationShow = false
}
//取消
const cancel = () => {
  if (showType!.configurationShow) {
    back()
  } else {
    open.value = false
  }
}
//提交
const submit = async () => {
  const validate = await cardRef.value?.validate()
  if (validate && showType!.configurationShow) {
    showType!.configurationShow = false
  } else if (!showType!.configurationShow) {
    open.value = false
    Object.assign(showTypeInject!, showType)
    Object.assign(listFormInfo.value, validate)
  }
}
//已配置数据展示方式，默认数据列表
const configuredChange = (value: string) => {
  if (showType!.configured?.length === 1 && showType!.configured[0] === value) {
    showType!.configured[0] = 'list'
  } else {
    const index = showType.configured?.findIndex((item: any) => item === value)
    showType.configured?.includes(value)
      ? showType.configured?.splice(<number>index, 1)
      : showType.configured?.push(value)
  }
  showType!.defaultForm =
    showType!.configured?.length === 1 ? showType!.configured[0] : 'list'
}

const errorList = ref<any[]>([])
const valid = () => {
  errorList.value = validListForm(showTypeInject!, listFormInfo.value)
  return errorList.value.length ? [{ message: '列表形态配置错误' }] : []
  // return new Promise((resolve, reject) => {
  //   errorList.value = validListForm(showType!,listFormInfo.value)
  //   if(errorList.value.length) reject([{message: '列表形态配置错误'}])
  //   else resolve([])
  // })
}

defineExpose({
  valid,
  errorList,
})
</script>

<style lang="less" scoped>
.check-btn {
  width: 90px;
  text-align: center;
}
.card-type {
  .ant-page-header {
    padding: 0;
  }
}
.j-check-btn {
  display: flex;
  width: 100%;
  gap: 0;
  .j-check-btn-item:first-child {
    border-left: 1px solid #d9d9d9;
    margin-right: 16px;
    border-radius: 2px;
  }
  .j-check-btn-item:last-child {
    border-left: 1px solid #d9d9d9;
    border-radius: 2px 0 0 2px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .j-check-btn-item {
    width: 150px;
    position: relative;
    display: inline-block;
    height: 32px;
    margin: 0;
    gap: 0;
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
      color: var(--ant-primary-color) !important;
      background: #fff;
    }

    &.selected {
      color: #fff !important;
      background: var(--ant-primary-color);
      border-color: var(--ant-primary-color);
    }
  }
}
.config-done{
  background-color: @primary-color;
  clip-path: polygon(100% 100%, 0 0, 100% 0%, 100% 100%);
  position: absolute;
  right: 0;
  top: 0;
  width: 22px;
  height: 22px;
  color: #fff;
  border-radius: 0 4px 0 0;
  padding: 2px 0px 0 0;
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
}
.title {
  margin-top: 20px;
}
:deep(.ant-radio-group) {
  .ant-radio-button-wrapper:first-child {
    border-radius: 6px 0px 0px 6px !important;
  }
  .ant-radio-button-wrapper:last-child {
    border-radius: 0px 6px 6px 0px !important;
  }
}
</style>
