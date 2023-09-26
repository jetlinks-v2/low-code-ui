<template>
  <div class="card-center">
    <p>卡片样式</p>
    <Card
      status="notActive"
      :actions="actions"
      :record="formState"
      :statusText="formState.emphasisField || '强调字段'"
      :statusNames="{
        online: 'processing',
        offline: 'error',
        notActive: 'warning',
      }"
      :warpStyle="{ width: '385px' }"
      :statusColor="statusColor"
    >
      <template #img>
        <j-avatar
          shape="square"
          :size="100"
          :src="formState.customIcon"
          @click="cardState.type = 'customIcon'"
          class="card-icon"
          :class="{ active: cardState.type === 'customIcon' }"
        >
          <template #icon>
            <!-- <pro-image src="https://www.antdv.com/#error" /> -->
            <j-image src="/images/list-page/table-card-default.png" :preview="false" />
          </template>
        </j-avatar>
      </template>
      <template #content>
        <j-row>
          <j-col
            :span="12"
            class="card-field"
            :class="{ active: cardState.type === 'field1' }"
            @click="cardState.type = 'field1'"
          >
            <ErrorItem :errorData="errorData('field1')">
              <h3>
                {{ formState.field1 || '字段1内容' }}
              </h3>
            </ErrorItem>
          </j-col>
          <j-col
            :span="12"
            class="emphasisField-bg"
            :class="{ active: cardState.type === 'emphasisField' }"
            @click="cardState.type = 'emphasisField'"
          >
            <div class="emphasisField-text"></div>
          </j-col>
        </j-row>

        <j-row>
          <j-col
            :span="12"
            class="card-field"
            :class="{ active: cardState.type === 'field2' }"
            @click="cardState.type = 'field2'"
          >
            <div>{{ formState.field2Title || '展示字段2' }}</div>
            <div>
              {{ formState.field2 || '字段2内容' }}
            </div>
          </j-col>
          <j-col
            :span="12"
            class="card-field"
            :class="{ active: cardState.type === 'field3' }"
            @click="cardState.type = 'field3'"
          >
            <div>{{ formState.field3Title || '展示字段3' }}</div>
            <div>
              {{ formState.field3 || '字段3内容' }}
            </div>
          </j-col>
        </j-row>
      </template>
    </Card>

    <p class="tips">
      请选择卡片展示内容
      <j-tooltip placement="top" :get-popup-container="getPopupContainer">
        <template #title>
          <p>字段1仅展示所选字段的值，适合展示“名称”</p>
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
          <j-form-item label="自定义图标" name="customIcon" class="upload-icon">
            <Upload
              v-model:value="formState.customIcon"
              :accept="accept"
              cropperTitle="自定义图标"
            >
              <template #content="{ imageUrl }">
                <div v-if="imageUrl">
                  <img :src="imageUrl" class="upload-image">
                </div>
                <div v-else>
                  <!-- <pro-image src="https://www.antdv.com/#error" /> -->
                  <j-image src="/images/list-page/table-card-default.png" :preview="false" />
                </div>
              </template>
            </Upload>
          </j-form-item>

          <j-form-item label="动态图标" name="dynamicIcon">
            <a-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.dynamicIcon"
              showSearch
              :options="titleOptions"
              :field-names="{ label: 'name', value: 'id' }"
            >
              <template #notFoundContent>
                <j-empty>
                  <template #description>
                    <span>请先配置列表数据</span>
                  </template>
                </j-empty>
              </template>
            </a-select>
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'field1'">
          <ErrorItem :errorData="errorData('field1')">
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
              <a-select
                width="200px"
                placeholder="请先配置列表数据"
                v-model:value="formState.field1"
                showSearch
                allowClear
                :options="titleOptions"
                :field-names="{ label: 'name', value: 'id' }"
              >
                <template #notFoundContent>
                  <j-empty>
                    <template #description>
                      <span>请先配置列表数据</span>
                    </template>
                  </j-empty>
                </template>
              </a-select>
            </j-form-item>
          </ErrorItem>
        </div>
        <div v-if="cardState.type === 'field2'">
          <j-form-item label="字段2" name="field2">
            <a-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.field2"
              showSearch
              allowClear
              :options="titleOptions"
              :field-names="{ label: 'name', value: 'id' }"
              @change="field2Change"
            >
              <template #notFoundContent>
                <j-empty>
                  <template #description>
                    <span>请先配置列表数据</span>
                  </template>
                </j-empty>
              </template>
            </a-select>
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'field3'">
          <j-form-item label="字段3" name="field3">
            <a-select
              width="200px"
              placeholder="请先配置列表数据"
              v-model:value="formState.field3"
              showSearch
              :options="titleOptions"
              :field-names="{ label: 'name', value: 'id' }"
              @change="field3Change"
            >
              <template #notFoundContent>
                <j-empty>
                  <template #description>
                    <span>请先配置列表数据</span>
                  </template>
                </j-empty>
              </template>
            </a-select>
          </j-form-item>
        </div>
        <div v-if="cardState.type === 'emphasisField'">
          <ErrorItem :errorData="errorData('emphasisField')">
            <j-form-item label="强调字段" name="emphasisField">
              <a-select
                width="200px"
                placeholder="请先配置列表数据"
                v-model:value="formState.emphasisField"
                showSearch
                allowClear
                :options="titleOptions"
                :field-names="{ label: 'name', value: 'id' }"
              >
                <template #notFoundContent>
                  <j-empty>
                    <template #description>
                      <span>请先配置列表数据</span>
                    </template>
                  </j-empty>
                </template>
              </a-select>
            </j-form-item>
          </ErrorItem>
          <j-form-item label="特殊样式" name="specialStyle">
            <EditorButton
              v-model:value="formState.specialStyle"
              language="json"
              text="编写特殊样式"
            >
            </EditorButton>
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
import { ErrorItem } from '../..'
import EditorButton from '@/components/EditorModal/EditorButton.vue'
import {
  LIST_FORM_INFO,
  ACTION_CONFIG_KEY,
  DATA_BIND,
  DATA_SOURCE,
} from '../../keys'
const props = defineProps({
  id: {
    type: null,
  },
  errorList: {
    type: Array,
    default: () => [],
  },
})
const formRef = ref()
//卡片样式点击类型
const cardState = reactive({
  type: 'customIcon', //customIcon,field1,field2,field3,emphasisField
})
//卡片展示内容form
const listForm = inject(LIST_FORM_INFO)
const formState = reactive({
  ...listForm,
})
const dataBind = inject(DATA_BIND)
const dataSource = inject(DATA_SOURCE)

const errorData = computed(() => {
  return (val: string) => {
    return props.errorList?.find((item: any) => item.key == val)
  }
})
//上传icon格式
const accept = '.jpg,.jpeg,.png'
//悬浮提示自动调整位置
const getPopupContainer = (trigger: HTMLElement) => {
  return trigger.parentElement
}
//卡片

const actions = [
  {
    key: 'view',
    text: '按钮',
  },
  {
    key: 'view1',
    text: '按钮',
  },
  {
    key: 'view2',
    text: '按钮',
  },
]

const validateValue = () => {
  const value = ['field1']
  value.map((item: any) => {
    if (formState[item] === '') {
      cardState.type = item
      onCheck()
    }
  })
  statusColor.value = JSON.parse(formState.specialStyle || '{}')
}
const onCheck = async () => {
  Object.assign(listForm, formState)
  return true
}
const field2Change = (value: any, options: any) => {
  formState.field2Title = options.name
}
const field3Change = (value: any, options: any) => {
  formState.field3Title = options.name
}
const statusColor = ref({
  error: '',
  offline: '',
  warning: '#13c2c2',
})

const titleOptions = computed(() => {
  return dataSource
})

defineExpose({
  validate: onCheck,
})
</script>

<style lang="less" scoped>
.card-form {
  background-color: #f2f2f2;
}
.upload-icon {
  ::v-deep(.upload-image-border) {
    position: relative;
    width: 48px !important;
    height: 48px !important;
    overflow: hidden;
    transition: all 0.3s;
    border: none !important;
  }
  :deep(.upload-image-content) {
    padding: 0 !important;
  }
  .upload-image{
    width: 100%;
  }
}
.card-icon {
  height: 88px !important;
  width: 88px !important;
  background-color: rgba(49, 94, 251, 0.2);;
  cursor: pointer;
  &:hover {
    background-color: rgba(49, 94, 251, 0.2);
    border: dashed 1px @primary-color;
  }
  &.active {
    background-color: rgba(49, 94, 251, 0.2);
    border: dashed 1px @primary-color;
    color: @primary-color !important;
  }
}
.card-field {
  cursor: pointer;
  &:hover {
    background-color: rgba(49, 94, 251, 0.1);
    border: dashed 1px @primary-color;
  }
  &.active {
    background-color: rgba(49, 94, 251, 0.2);
    border: dashed 1px @primary-color;
    color: @primary-color !important;
  }
}
.emphasisField-bg {
  position: absolute;
  top: 30px;
  right: -12px;
  display: flex;
  justify-content: center;
  width: 100px;
  padding: 2px 0;
  transform: skewX(45deg);
  z-index: 99999999;
  cursor: pointer;
  &:hover {
    border: dashed 1px @primary-color;
  }
  &.active {
    background-color: rgba(49, 94, 251, 0.2);
    border: dashed 1px @primary-color;
    color: @primary-color !important;
  }
  .emphasisField-text {
    transform: skewX(-45deg);
    height: 20px;
  }
}
.tips {
  padding: 10px 10px 0px 0px;
}
</style>
