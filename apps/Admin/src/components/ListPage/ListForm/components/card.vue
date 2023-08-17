<template>
  <div class="card-center">
    <p>卡片样式</p>
    <Card
      status="offline"
      :actions="actions"
      :record="formState"
      :statusText="formState.emphasisField"
      :statusNames="{
        online: 'processing',
        offline: 'error',
        notActive: 'warning',
      }"
    >
      <template #status>
        {{ formState.customIcon }}
      </template>
      <template #img>
        <j-avatar
          shape="square"
          :size="100"
          :src="formState.customIcon"
          @click="cardState.type = 'customIcon'"
          class="card-icon"
        >
          <template #icon>
            <pro-image src="https://www.antdv.com/#error" />
          </template>
        </j-avatar>
      </template>
      <template #content>
        <j-row>
          <j-col
            :span="12"
            class="card-field"
            @click="cardState.type = 'field1'"
          >
            <h3>
              {{ formState.field1 || '字段1' }}
            </h3>
          </j-col>
          <j-col
            :span="12"
            class="card-field"
            @click="cardState.type = 'emphasisField'"
          >
            <div>
              {{ formState.emphasisField || '强调字段' }}
            </div>
          </j-col>
        </j-row>

        <j-row>
          <j-col
            :span="12"
            class="card-field"
            @click="cardState.type = 'field2'"
          >
            <div>展示字段2</div>
            <div>
              {{ formState.field2 || '字段2' }}
            </div>
          </j-col>
          <j-col
            :span="12"
            class="card-field"
            @click="cardState.type = 'field3'"
          >
            <div>展示字段3</div>
            <div>
              {{ formState.field3 || '字段3' }}
            </div>
          </j-col>
        </j-row>
      </template>
    </Card>

    <p class="tips">
      请选择卡片展示内容
      <j-tooltip placement="top" :get-popup-container="getPopupContainer">
        <template #title>
          <p>字段1仅展示所选字段的值，适合展示“名称</p>
          <p>字段2、3会展示所选字段名称和所选字段的值</p>
          <p>强调字段展示方式较明显，适合展示“状态”</p>
        </template>
        <AIcon type="QuestionCircleOutlined" />
      </j-tooltip>
    </p>
    <div class="card-form">
      <j-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        style="padding: 10px"
      >
        <div v-if="cardState.type === 'customIcon'">
          <j-form-item
            label="自定义图标"
            name="customIcon"
            :rules="[{ required: true, message: '请上传图标!' }]"
            class="upload-icon"
          >
            <Upload v-model:value="formState.customIcon" :accept="accept" />
          </j-form-item>

          <j-form-item label="动态图标" name="dynamicIcon">
            <j-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.dynamicIcon"
              showSearch
              :options="options"
            />
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'field1'">
          <j-form-item
            label="字段1"
            name="field1"
            :rules="[
              {
                required: true,
                message: '请选择字段1!',
              },
            ]"
          >
            <j-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.field1"
              showSearch
              :options="options"
            />
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'field2'">
          <j-form-item
            label="字段2"
            name="field2"
            :rules="[
              {
                required: true,
                message: '请选择字段2!',
              },
            ]"
          >
            <j-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.field2"
              showSearch
              :options="options"
            />
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'field3'">
          <j-form-item
            label="字段3"
            name="field3"
            :rules="[
              {
                required: true,
                message: '请选择字段3!',
              },
            ]"
          >
            <j-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.field3"
              showSearch
              :options="options"
            />
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'emphasisField'">
          <j-form-item label="强调字段" name="emphasisField">
            <j-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.emphasisField"
              showSearch
              :options="options"
            />
          </j-form-item>
          <j-form-item label="特殊样式" name="specialStyle">
            <j-monaco-editor v-model="formState.specialStyle" language="css" />
          </j-form-item>
        </div>
        <j-form-item v-show="false">
          <j-button type="primary" @click="onCheck">Check</j-button>
        </j-form-item>
      </j-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Upload from '@/components/Upload/Image/ImageUpload.vue'
import { useListFormStore } from '@/store/listForm'
import Card from '@/components/Card'
const configurationStore = useListFormStore()
const formRef = ref()
//卡片样式点击类型
const cardState = reactive({
  type: 'customIcon', //customIcon,field1,field2,field3,emphasisField
})
//卡片展示内容form
const formState = reactive({
  customIcon: '',
  dynamicIcon: '',
  field1: '',
  field2: '',
  field3: '',
  emphasisField: '',
  specialStyle: undefined,
})
const options: any = ref([])
//上传icon格式
const accept = '.jpg,.jpeg,.png'
//悬浮提示自动调整位置
const getPopupContainer = (trigger: HTMLElement) => {
  return trigger.parentElement
}
//卡片
const status = reactive({
  text: '正常',
  value: 'normal',
  color: '#00ff00',
})
const actions = [
  {
    key: 'view',
    text: '查看',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,
      icon: 'EyeOutlined',
      onClick: (e) => {
        console.log(data)
        handleView(data.id)
      },
    }),
  },
  {
    key: 'view1',
    text: '查看1',
    permissionProps: {
      tooltip: {
        title: '查看1',
      },
      hasPermission: false,
      icon: 'EyeOutlined',
    },
  },
  {
    key: 'view2',
    text: '查看2',
  },

  {
    key: 'delete',
    text: '删除',
    permissionProps: (data) => ({
      tooltip: {
        title: '删除',
      },
      popConfirm: {
        title: data.status === 'error' ? '禁用' : '确认删除？',
        onConfirm: () => {
          console.log(data)
        },
      },
      hasPermission: true,
      icon: 'EyeOutlined',
      onClick: () => {
        handleView(data.id)
      },
    }),
  },
]

const validateValue = () => {
  const value = ['customIcon', 'field3', 'field2', 'field1']
  value.map((item: any) => {
    if (formState[item] === '') {
      cardState.type = item
      onCheck()
    }
  })
}
const onCheck = async () => {
  try {
    await formRef.value.validateFields()
    validateValue()
    if (
      formState.customIcon !== '' &&
      formState.field1 !== '' &&
      formState.field2 !== '' &&
      formState.field3 !== ''
    ) {
      configurationStore.setListFormInfo(formState)
      return true
    }
  } catch (errorInfo) {
    return false
  }
}
watch(
  () => cardState.type,
  () => {
    options.value = [{ value: cardState.type, label: cardState.type }]
  },
  { immediate: true, deep: true },
)
const init = () => {
  const data = { ...configurationStore.getListFormInfo() }
  Object.assign(formState, data)
}
onMounted(() => {
  init()
})
defineExpose({
  vaildate: onCheck,
})
</script>

<style lang="less" scoped>
.card-form {
  background-color: #f2f2f2;
}
.upload-icon {
  ::v-deep(.upload-image-border) {
    position: relative;
    width: 100px !important;
    height: 100px !important;
    overflow: hidden;
    transition: all 0.3s;
    border: none !important;
  }
}
.card-icon {
  height: 88px !important;
  width: 88px !important;
  cursor: pointer;
  &:hover {
    background: rgba(255, 190, 105, 0.5);
    border: dashed 2px #ff9100;
  }
}
.card-field {
  cursor: pointer;
  &:hover {
    border: dashed 2px #ff9100;
  }
}
.tips {
  padding: 10px 10px 0px 0px;
}
</style>
