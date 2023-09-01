<template>
  <div class="menu-config">
    <div class="card">
      <h3>基本信息</h3>
      <p>页面名称</p>
      <j-input v-model:value="baseInfo.title" disabled />

      <h3 class="title">设置该页面为系统主菜单</h3>
      <j-form ref="basicFormRef" :model="form" class="basic-form">
        <j-form-item name="main">
          <j-switch v-model:checked="form!.main" />
        </j-form-item>
        <template v-if="form!.main">
          <j-form-item
            name="name"
            :rules="[
              {
                required: true,
                message: '建议设置2-16个字符',
                trigger: 'change',
              },
            ]"
          >
            <template #label>
              <span>菜单名称</span>
              <span class="tips">
                <j-tooltip placement="top">
                  <template #title>
                    <p>
                      中文名将应用于系统菜单名称、面包屑等位置，建议设置2-8个字符
                    </p>
                  </template>
                  <AIcon type="InfoCircleOutlined" />
                </j-tooltip>
              </span>
            </template>
            <ErrorItem :error-data="errorData('name')">
              <j-input v-model:value="form!.name" />
            </ErrorItem>
          </j-form-item>
          <j-form-item
            label="icon"
            name="icon"
            :rules="[
              {
                required: true,
                message: '请上传图标',
                trigger: 'change',
              },
            ]"
            style="flex: 0 0 186px"
          >
            <ErrorItem :error-data="errorData('icon')">
              <div class="icon-upload has-icon" v-if="form!.icon">
                <AIcon :type="form!.icon" style="font-size: 50px" />
                <span class="mark" @click="dialogVisible = true">点击修改</span>
              </div>

              <div
                v-else
                @click="dialogVisible = true"
                class="icon-upload no-icon"
              >
                <span>
                  <AIcon type="PlusOutlined" style="font-size: 20px" />
                  <p>点击选择图标</p>
                </span>
              </div>
            </ErrorItem>
          </j-form-item>
        </template>
      </j-form>
    </div>
  </div>
  <!-- 弹窗 -->
  <ChooseIconDialog
    v-model:visible="dialogVisible"
    @confirm="(typeStr:string)=>form!.icon = typeStr"
  />
</template>
<script setup lang="ts">
import ChooseIconDialog from '@/components/ListPage/MenuConfig/components/icon.vue'
import { BASE_INFO, MENU_CONFIG } from '../../keys'
import { useAllListDataStore } from '@/store/listForm';
import { ErrorItem } from '../..';

const props = defineProps({
  errorList: {
    type: Array,
    default: () => [],
  },
})

const dialogVisible = ref<boolean>(false)
const baseInfo = inject(BASE_INFO)
const form = inject(MENU_CONFIG)
const emits = defineEmits()
const configurationStore = useAllListDataStore();

const errorData = computed(() => {
  return (val: string): any => {
    return props.errorList?.find((item: any) => item.key === val)
  }
})

watchEffect(() => {
  configurationStore.setALLlistDataInfo('menu', form, baseInfo.id)
})
const basicFormRef = ref()

const onCheck = async () => {
  try {
    const values = await basicFormRef.value.validateFields()
    return values
  } catch (errorInfo) {
    return errorInfo
  }
}
watch(
  () => [form!.pageName, form!.main, form!.name, form!.icon],
  () => {
    emits('update:form',form)
  },
)
defineExpose({
  vaildate: onCheck,
  form:form
})
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
  .title {
    margin-top: 20px;
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
      .tips {
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
