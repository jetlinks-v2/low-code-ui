<template>
  <div>
    <j-form-item :validateFirst="true" label="背景图片" name="backgroundImage">
      <div class="upload">
        <ImageUpload
          v-model:value="target.componentProps.backgroundImage"
          :accept="'.jpg,.jpeg,.png'"
          cropperTitle="自定义背景图片"
          @change="onDataChange"
        >
          <template #content="{ imageUrl }">
            <div class="upload-image">
              <img :src="imageUrl" v-if="imageUrl" />
              <AIcon v-else type="PlusOutlined" style="font-size: 30px" />
            </div>
          </template>
        </ImageUpload>
      </div>
    </j-form-item>
    <j-form-item
      label="是否为页面"
      :name="['componentProps', 'isPage']"
      :validateFirst="true"
    >
      <j-switch
        v-model:checked="target.componentProps.isPage"
        @change="onDataChange"
      />
    </j-form-item>
  </div>
</template>

<script lang="ts" setup>
import { useTarget } from "../../../../hooks";
import { ImageUpload } from "@LowCode/components";

const { target } = useTarget();

const emits = defineEmits(["refresh"]);

const onDataChange = () => {
  emits("refresh", target.value);
};
</script>

<style lang="less" scoped>
.upload {
  width: 100px;
  height: 100px;
}
.upload-image {
  width: 86px;
  height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
  }
}
</style>