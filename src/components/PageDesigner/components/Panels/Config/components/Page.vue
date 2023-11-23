<template>
  <div>
    <j-form-item :validateFirst="true" label="背景图片" name="layout">
      <!-- <div class="layout-box">
        <div
          class="layout-item"
          @click="onClick(item.value)"
          :class="target.componentProps.layout === item.value && 'layout-value'"
          v-for="item in list"
          :key="item.value"
        >
          <img :src="item.img" />
        </div>
      </div> -->
    </j-form-item>
    <!-- <j-form-item :validateFirst="true" label="页面位置" name="position">
      <CheckButton
        :options="[
          { label: '左', value: 'left' },
          { label: '中', value: 'center' },
          { label: '右', value: 'right' },
        ]"
        @change="onDataChange"
        v-model:value="target.componentProps.position"
      />
    </j-form-item>
     -->
  </div>
</template>

<script lang="ts" setup>
import { useTarget } from "../../../../hooks";

const { target } = useTarget();

const emits = defineEmits(["refresh"]);

const onDataChange = () => {
  emits("refresh", target.value);
};
</script>

<style lang="less" scoped>
.layout-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  .layout-item {
    width: 96px;
    height: 56px;
    background-color: #f1f4fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #ebf1fc;
    }
  }

  .layout-value {
    background-color: #315efb !important;
  }
}
</style>