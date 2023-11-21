<template>
  <j-dropdown
    placement="bottomRight"
  >
    <j-button>
      <AIcon type="EllipsisOutlined" />
      <span>其它</span>
    </j-button>
    <template #overlay>
      <j-menu>
        <j-menu-item
          v-for="(item, i) in actions"
          :key="i + item.key"
        >
          <PermissionButton
            v-if="item.permissionProps"
            v-bind:="handleFunction(item.permissionProps)"
            :danger="item.key === 'delete' "
            type="link"
            :data-id="item.key"
            :class="extractCssClass(item.style)"
          >
            <template #icon v-if="item.icon || item.key === 'delete'">
              <img
                :src="item.icon"
                v-if="item.icon?.includes('http')"
                class="image-icon"
              />
              <AIcon v-else :type="item.icon ? item.icon : 'DeleteOutlined'" />
            </template>
            <span>{{ item.text }}</span>
          </PermissionButton>
          <j-button v-else type="link" :icon="item.icon" @click="item.click" >
            {{ item.text }}
          </j-button>
        </j-menu-item>
      </j-menu>
    </template>
  </j-dropdown>
</template>

<script setup name="OtherActions">
import { extractCssClass, insertCustomCssToHead } from '../FormDesigner/utils/utils';
import {isFunction, isObject} from "lodash-es";

const props = defineProps({
  record: {
    type: Object,
    default: () => ({})
  },
  actions: {
    type: Array,
    default: () => []
  },
})

const handleFunction = (item) => {
  if (isFunction(item)) {
    return item(props.record)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}

watchEffect(() => {
  props.actions?.forEach((item) => {
    insertCustomCssToHead(item.style, item.key, 'dataid')
  })
})
</script>

<style scoped>
.image-icon {
  width: 14px;
  height: 14px;
  margin-right: 10px;
}
</style>
