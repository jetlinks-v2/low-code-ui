<template>
  <div class="card-center">
    <Card
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
    >
      <template #img>
        <ImageUpload
            v-model:value="formState.customIcon"
            :accept="'.jpg,.jpeg,.png'"
            cropperTitle="自定义图标"
            @change="onChange"
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
          <j-col>
            <CardField v-model:value="formState.titleCode" @change="onChange" />
          </j-col>
        </j-row>
        <j-row :gutter="[24, 24]">
          <j-col :span="12">
            <div>
              <j-input
                  v-model:value="formState.field1Title"
                  placeholder="请输入"
              />
            </div>
            <CardField key="field1Code" v-model:value="formState.field1Code" @change="onChange" />
          </j-col>
          <j-col :span="12">
            <div>
              <j-input
                  v-model:value="formState.field2Title"
                  placeholder="请输入"
              />
            </div>
            <CardField key="field2Code" v-model:value="formState.field2Code" @change="onChange" />
          </j-col>
        </j-row>
      </template>
      <template #status>
        <CardStatus v-model:value="formState.emphasisField" @change="onChange" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {Card} from "@LowCode/components/index";
import {ImageUpload} from "@LowCode/components";
import CardField from './CardField.vue';
import CardStatus from './CardStatus.vue';
import {cloneDeep} from "lodash-es";

const props = defineProps({
  value: {
    type: Object,
    default: () => {
    },
  },
});
const emits = defineEmits(["change", 'update:value']);
const init = {
  customIcon: "",
  emphasisField: {
    showStatus: false
  },
  field1Title: "展示字段1",
  field2Title: "展示字段2",
  titleCode: "",
  field1Code: "",
  field2Code: "",
}
//卡片展示内容form
const formState = reactive(init);
const onChange = () => {
  emits('change', formState)
  emits('update:value', formState)
}

watchEffect(() => {
  if(Object.keys(props.value)?.length){
    Object.assign(formState, props.value)
  } else {
    Object.assign(formState, cloneDeep(init))
  }
})
</script>

<style lang="less" scoped>
.upload-image {
  width: 86px;
  height: 86px;

  img {
    width: 100%;
  }
}

.card-center {
  :deep(.card-footer) {
    .ant-btn {
      color: black !important;
    }
  }
}
</style>
  