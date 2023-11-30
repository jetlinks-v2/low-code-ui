<template>
  <div>
    <j-space v-if="visible && _item.key">
      <j-popconfirm v-if="_item?.buttonType === 'Popconfirm'" :title="_item.event?.title" @confirm="onConfirm">
        <j-button  v-bind="omit(_item,['key','text','icon'])">
          <template #icon v-if="_item?.icon">
            <AIcon :type="_item?.icon"></AIcon>
          </template>
          {{ _item?.text }}
        </j-button>
      </j-popconfirm>
      <j-button  v-else v-bind="omit(_item,['key','text','icon'])" @click="onClick">
          <template #icon v-if="_item?.icon">
            <AIcon :type="_item?.icon"></AIcon>
          </template>
          {{ _item?.text  }}
        </j-button>
      <j-button type="link" @click="reload"
                >
                <AIcon type="RedoOutlined" />
                重选</j-button
            >
    </j-space>
    <j-dropdown v-else>
      <j-button v-bind="omit(props, ['icon', 'text'])">{{ text }}</j-button>
      <template #overlay>
        <j-menu @click="handleMenuClick">
          <j-menu-item v-for="item in menu" :key="item?.key">
            <j-button v-bind="omit(item, ['key', 'text','icon'])">
              <template #icon v-if="item?.icon">
                <AIcon :type="item?.icon"></AIcon>
              </template>
            {{
              item?.text
            }}</j-button>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
    <Modal v-if="comVisible && _item?.buttonType === 'Modal'" :data="_item?.event" @close="setVisible(false)" />
    <Drawer v-if="comVisible && _item?.buttonType === 'Drawer'" :data="_item?.event" @close="setVisible(false)" />
  </div>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";
import { inject } from 'vue'
import { request as axiosRequest } from "@jetlinks-web/core/src/request";
import { onlyMessage } from "@LowCode/utils/comm";
import Modal from './Modal.vue'
import Drawer from './Drawer.vue'
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

const comVisible = ref(false)

const setVisible = (val: boolean) => {
    comVisible.value = val;
};

const handleMenuClick = (e :any) =>{
  const val = props.menu.find(i=>i.key === e.key);
  visible.value = true
  _item.value = val
  selectConfig.showSelect()
}
const reload = () =>{
  visible.value = false
  selectConfig.closeSelect()
}

const defaultParams = () => {
    try {
        return JSON.parse(_item.value?.event?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async () => {
    const config = _item.value?.event
    if (_item.value?.event?.query) {
      const  selectKeys = selectConfig.getSelectKeys()
        const paramsData = {
          selectKeys,
          ...defaultParams(),
        }
        try {
            const resp = await axiosRequest[config.methods](config.query, paramsData)
            if (config.click) {
                const handleResultFn = new Function('result','onlyMessage', config.click)
                handleResultFn(resp.result,onlyMessage)
            } 
        } catch (e) {
            console.error(e)
        }
    }
}

const onClick = () => {
    if (_item?.value.buttonType === 'Button') {
        handleRequestFn()
    } else {
        setVisible(true)
    }
};

const onConfirm = () => {
    handleRequestFn()
};
</script>

<style lang="less" scoped>
</style>