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
              <template v-if="imageUrl">
                <img :src="imageUrl" />
                <div class="mark" @click.stop="onRemove"
                ><AIcon type="CloseOutlined"
                /></div>
              </template>
              <AIcon v-else type="PlusOutlined" style="font-size: 30px"/>
            </div>
          </template>
        </ImageUpload>
      </div>
    </j-form-item>
    <j-form-item
        label="设置该页面为系统主菜单"
        :name="['componentProps', 'isPage']"
        :validateFirst="true"
    >
      <j-switch
          v-model:checked="target.componentProps.isPage"
          @change="onDataChange"
      />
    </j-form-item>
    <template v-if="target.componentProps.isPage">
      <j-form-item
          label="菜单名称"
          :name="['componentProps', 'pageName']"
          required
      >
        <j-input v-model:value="target.componentProps.pageName" placeholder="请输入菜单名称" @change="onDataChange"/>
      </j-form-item>
      <j-form-item
          label="菜单图标"
          :name="['componentProps', 'pageIcon']"
      >
        <Icon v-model:value="target.componentProps.pageIcon" @change="onDataChange"/>
      </j-form-item>
      <j-form-item
          label="菜单code"
          :name="['componentProps', 'pageCode']"
          required
      >
        <j-input v-model:value="target.componentProps.pageCode" placeholder="请输入菜单code" @change="onDataChange"/>
      </j-form-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {useTarget} from "../../../../hooks";
import {ImageUpload} from "@LowCode/components";
import Icon from './Icon/index.vue'

const {target} = useTarget();

const emits = defineEmits(["refresh"]);

const onDataChange = () => {
  emits("refresh", target.value);
};

const onRemove = () => {
  target.value.componentProps.backgroundImage = undefined
  emits("refresh", target.value);
}
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
  position: relative;

  img {
    width: 100%;
  }

  .mark {
    position: absolute;
    right: -5px;
    top: -5px;
    z-index: 10;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #1b1f29;
    font-size: 12px;
    line-height: 15px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
