<template>
  <div class="menu-config" ref="menuConfig">
    <div class="card">
      <h3>基本信息</h3>
      <p>页面名称</p>
      <j-input v-model:value="form.pageName" disabled />

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
                message: errorData('name') ? '' : '请输入2-16个字符',
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
              <j-input
                v-model:value="form!.name"
                :maxLength="16"
                placeholder="请输入菜单名称"
              />
            </ErrorItem>
          </j-form-item>
          <j-form-item
            label="icon"
            name="icon"
            :rules="[
              {
                required: true,
                message: errorData('name') ? '' : '请配置图标',
                trigger: 'change',
              },
            ]"
            style="flex: 0 0 186px"
          >
            <div class="icon-upload has-icon" v-if="form!.icon">
              <AIcon :type="form!.icon" style="font-size: 20px" />
              <span class="mark" @click="dialogVisible = true"></span>
            </div>
            <ErrorItem :border="false" :error-data="errorData('icon')" v-else>
              <div class="icon-upload no-icon">
                <span>
                  <AIcon type="PlusOutlined" style="font-size: 20px" />
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
    v-model:type="form!.icon"
    :refs="$refs.menuConfig"
  />
</template>
<script setup lang="ts">
import ChooseIconDialog from '@/components/ListPage/MenuConfig/components/icon.vue'
import { MENU_CONFIG } from '../../keys'
import { ErrorItem } from '../..'

const props = defineProps({
  errorList: {
    type: Array,
    default: () => [],
  },
  refs: {
    type: Object,
  },
})

const dialogVisible = ref<boolean>(false)
const form = inject(MENU_CONFIG)
const emits = defineEmits(['change', 'update:open', 'confirm'])

const errorData = computed(() => {
  return (val: string): any => {
    return props.errorList?.find((item: any) => item.key === val)
  }
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
  () => form,
  (value) => {
    emits('change', value)
    emits('update:form', form)
  },
  { deep: true },
)
defineExpose({
  vaildate: onCheck,
  form: form,
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
          width: 48px;
          height: 48px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          cursor: pointer;
          border-radius: 4px;
          transition: 0.5s;
          .choose-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed #d9d9d9;
          }

          &:hover {
            border-color: #415ed1;
          }
        }

        .has-icon {
          position: relative;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.06);

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
