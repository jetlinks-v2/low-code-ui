<template>
  <div class="header">
    <div class="right">
      <j-space>
        <template v-if="isEditModel">
          <j-button type="primary" @click="onValid">验证</j-button>
          <j-button
              type="primary"
              @click="onPreview('preview')"
              style="padding-left: 4px; padding-right: 4px"
          ><AIcon style="font-size: 20px" type="CaretRightOutlined"
          /></j-button>
        </template>
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
import {useCheck, useTool} from "../../hooks";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const designer: any = inject('PageDesigner')
const { isEditModel, setSelection, setModel } = useTool();
const { onValidate } = useCheck()

const onValid = async () => {
  designer.spinning.value = true;
  const _val = await onValidate().catch(() => {
    designer.spinning.value = false;
  });
  console.log(_val, 'ddddd')
  designer.spinning.value = false;
  if (_val) {
    onlyMessage("校验通过");
  }
};
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