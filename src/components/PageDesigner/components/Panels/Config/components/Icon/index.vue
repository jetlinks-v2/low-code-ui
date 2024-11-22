<template>
  <div>
    <div
      class="icon-upload has-icon"
      :style="{ 'width': _width, 'height': _width }"
      v-if="value"
    >
      <AIcon :type="value" :style="{'font-size': _size}" />
      <j-space class="mark">
        <span @click="onOpen"><AIcon type="EditOutlined" /></span>
        <span @click="onRemove" style="color: red"
          ><AIcon type="DeleteOutlined"
        /></span>
      </j-space>
    </div>

    <div v-else @click="onOpen" :style="{ 'width': _width, 'height': _width }" class="icon-upload no-icon">
      <span>
        <AIcon type="PlusOutlined" style="font-size: 30px" />
        <p v-if="size !== 'small'">点击选择图标</p>
      </span>
    </div>
    <template v-if="dialogVisible">
      <j-modal
        visible
        title="图标"
        width="800px"
        @cancel="onCancel"
        @ok="onSave"
      >
        <j-radio-group v-model:value="selected" class="radio">
          <j-radio-button
            v-for="typeStr in iconKeys"
            :value="typeStr"
            :key="typeStr"
            :class="{ active: selected === typeStr }"
          >
            <AIcon :type="typeStr" />
          </j-radio-button>
        </j-radio-group>
      </j-modal>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import iconKeys from "./fields";

const props = defineProps({
  value: {
    type: String,
  },
  size: {
    type: String as PropType<"default" | "small">,
    default: "default",
  },
});

const emits = defineEmits(["update:value", "change"]);

const dialogVisible = ref<boolean>(false);
const selected = ref<string>();

const _width = computed(() => {
  return props.size === "small" ? "50px" : "100px";
});

const _size = computed(() => {
  return props.size === "small" ? "40px" : "90px";
});

const onSave = () => {
  emits("update:value", selected.value);
  emits("change", selected.value);
  dialogVisible.value = false;
};

const onRemove = () => {
  emits("update:value", "");
  emits("change", "");
};

const onOpen = () => {
  dialogVisible.value = true;
  selected.value = props.value;
};

const onCancel = () => {
  dialogVisible.value = false;
};
</script>

<style lang="less" scoped>
.icon-upload {
  border: 1px dashed #d9d9d9;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    border-color: #415ed1;
  }
}
.has-icon {
  position: relative;
  text-align: center;

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

.radio {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(10, 1fr);
  max-height: 500px;
  overflow-y: auto;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    font-size: 24px;
    border: 2px solid #efefef;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: #415ed1;
      border-color: #415ed1;
    }
  }
}
</style>