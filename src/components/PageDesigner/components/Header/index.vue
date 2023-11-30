<template>
  <div class="header">
    <div class="right">
      <j-space>
        <j-button
          type="primary"
          v-if="isEditModel"
          @click="onPreview('preview')"
          style="padding-left: 4px; padding-right: 4px"
          ><AIcon style="font-size: 20px" type="CaretRightOutlined"
        /></j-button>
        <template v-else>
          <j-button type="link" @click="onPreview('edit')"
            ><AIcon type="LeftOutlined" />结束预览</j-button
          >
          <div>正在预览</div>
        </template>
      </j-space>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { useTool } from "../../hooks";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const { isEditModel, setSelection, setModel } = useTool();

const emits = defineEmits(["back"]);

const onPreview = (_type: "preview" | "edit") => {
  setModel(_type);
  setSelection("root");
};
</script>
  
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  height: 48px;
  padding: 0 24px;
  margin-bottom: 1px;
  border-bottom: 1px solid #d9d9d9;
}
</style>