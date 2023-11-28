<template>
  <div class="card-center">
    <Card
      status="notActive"
      :actions="[
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
      ]"
      :record="formState"
      :statusText="formState.emphasisField"
      :statusNames="{
        online: 'processing',
        offline: 'error',
        notActive: 'warning',
      }"
      :statusColor="statusColor"
    >
      <template #img>
        <ImageUpload
          v-model:value="formState.customIcon"
          :accept="'.jpg,.jpeg,.png'"
          cropperTitle="自定义图标"
        >
          <template #content="{ imageUrl }">
            <div class="upload-image">
              <img
                :src="imageUrl || '/images/list-page/table-card-default.png'"
              />
            </div>
          </template>
        </ImageUpload>
      </template>
      <template #content>
        <j-row>
          <j-col
            :span="12"
            class="card-field"
            :class="{ active: cardState.type === 'field1' }"
            @click="cardState.type = 'field1'"
          >
            <h3>
              <!-- #TODO:字段配置 -->
              {{ formState.field1 }}
            </h3>
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
          <j-col :span="12">
            <div>
              <j-input
                v-model:value="formState.field2Title"
                placeholder="请输入"
              />
            </div>
            <div
              class="card-field"
              :class="{ active: cardState.type === 'field2' }"
              @click="cardState.type = 'field2'"
            >
              {{ formState.field2 }}
            </div>
          </j-col>
          <j-col :span="12">
            <div>
              <j-input
                v-model:value="formState.field3Title"
                placeholder="请输入"
              />
            </div>
            <div
              class="card-field"
              :class="{ active: cardState.type === 'field3' }"
              @click="cardState.type = 'field3'"
            >
              {{ formState.field3 }}
            </div>
          </j-col>
        </j-row>
      </template>
    </Card>
  </div>
</template>
  
<script lang="ts" setup>
import { Card } from "@LowCode/components/index";
import { ImageUpload } from "@LowCode/components";

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
});
const emits = defineEmits(["change"]);
//卡片展示内容form
const formState = reactive({
  emphasisField: "强调字段",
  customIcon: "",
  field1Title: "展示字段1",
  field2Title: "展示字段2",
  field3Title: "展示字段3",
  field1: "字段1内容",
  field2: "字段2内容",
  field3: "字段3内容",
});

const statusColor = ref({
  error: "",
  offline: "",
  warning: "#13c2c2",
});

const cardState = reactive({
  type: "customIcon", //customIcon,field1,field2,field3,emphasisField
});
</script>
<style lang="less" scoped>
.card-form {
  background-color: #f2f2f2;
}
.upload-image {
  width: 86px;
  height: 86px;
  img {
    width: 100%;
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
  top: -24px;
  right: -26px;
  display: flex;
  justify-content: center;
  width: 110px;
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
  