<template>
  <div>
    <j-space v-if="visible && _item.key">
      <j-button  v-bind="omit(_item,['key','text','icon'])">
        <template #icon>
          <AIcon :type="_item?.icon"></AIcon>
        </template>
        {{ _item?.text }}
      </j-button>
      <j-button type="link" @click="reload"
                ><AIcon type="RedoOutlined" />重选</j-button
            >
    </j-space>
    <j-dropdown v-else>
      <j-button v-bind="omit(props, ['icon', 'text'])">{{ text }}</j-button>
      <template #overlay>
        <j-menu @click="handleMenuClick">
          <j-menu-item v-for="item in menu" :key="item?.key">
            <j-button v-bind="omit(item, ['key', 'text','icon'])">
              <template #icon>
                <AIcon :type="item?.icon"></AIcon>
              </template>
            {{
              item?.text
            }}</j-button>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";
import { inject } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: "批量操作",
  },
  type: {
    type: String as PropType<
      "primary" | "dashed" | "link" | "text" | "default"
    >,
    default: "default",
  },
  shape: {
    type: String as PropType<"circle" | "round" | "default">,
    default: "default",
  },
  size: {
    type: String as PropType<"large" | "middle" | "small">,
    default: "middle",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ghost: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
  },
  menu: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const selectConfig:any = inject('selectConfig')
const visible = ref(false)
const _item = ref()
const handleMenuClick = (e :any) =>{
  const val = props.menu.find(i=>i.key === e.key);
  visible.value = true
  _item.value = val
  selectConfig.showSelect()
}
const reload = () =>{
  visible.value = false
  selectConfig.closeSelect()
  console.log(selectConfig.getSelectKeys())
}
</script>

<style lang="less" scoped>
</style>