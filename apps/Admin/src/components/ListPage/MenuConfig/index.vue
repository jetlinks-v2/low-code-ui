<template>
  <div class="menu-config">
    <j-drawer
      title="菜单配置"
      placement="right"
      :closable="false"
      :visible="open"
      @close="emits('update:open', false)"
    >
      <Menu
        :pageName="pageName"
        ref="menuRef"
        @update:form="(newValue) => (subValue = newValue)"
        :errorList="errorList"
      />
      <j-button type="primary" @click="submit"> 确定 </j-button>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import Menu from '@/components/ListPage/MenuConfig/components/menu.vue'
import { validMenu } from './utils/valid'
import { useAllListDataStore } from '@/store/listForm'
interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const configurationStore = useAllListDataStore()
const open = computed({
  get() {
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})
const subValue = ref({})
const menuRef = ref()
const pageName = ref('')
const formData = ref({})
onMounted(() => {
  pageName.value = props.data?.title || ''
  formData.value =  configurationStore.getALLlistDataInfo( props.data?.id)?.menu || {}
})

const errorList = ref<any[]>([])
const valid = () => {
  // console.log(menuRef.value?.form);
  return new Promise((resolve, reject) => {
    errorList.value = validMenu(menuRef.value?.form)
    if(errorList.value.length) reject(errorList.value)
    else resolve([])
  })
}
defineExpose({
  errorList,
  valid
})
watch(
  () => props.data,
  (val) => {
    pageName.value = val.title || ''
  },
)
watch(
  () => subValue.value,
  (val) => {
    configurationStore.setALLlistDataInfo('menu', val, props.data?.id)
  },
)
</script>
<style lang="less" scoped>
.card {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fff;

  h3 {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 4px 0 4px 12px;
    font-weight: bold;
    font-size: 16px;

    &::before {
      position: absolute;
      top: 5px px;
      left: 0;
      width: 4px;
      height: calc(100% - 10px);
      background-color: #1d39c4;
      border-radius: 2px;
      content: ' ';
    }
  }

  .basic-form {
    .ant-form-item {
      display: block;
      :deep(.ant-form-item-label) {
        overflow: inherit;
        .img-style {
          cursor: help;
        }
        label::after {
          display: none;
        }
      }
      .mark {
        margin-left: 10px;
      }
      :deep(.ant-form-item-control-input-content) {
        .icon-upload {
          width: 100px;
          height: 100px;
          border: 1px dashed #d9d9d9;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: 0.5s;
          &:hover {
            border-color: #415ed1;
          }
        }
        .has-icon {
          position: relative;
          text-align: center;

          .mark {
            position: absolute;
            left: 0;
            top: 0;
            display: none;
            background-color: rgba(0, 0, 0, 0.35);
            color: #fff;
            width: 100%;
            height: 100%;
            font-size: 16px;
            align-items: center;
            justify-content: center;
          }
          &:hover .mark {
            display: flex;
          }
        }
        .no-icon {
          background-color: rgba(0, 0, 0, 0.06);
        }
      }
    }
  }
}
</style>
