<template>
          <j-space size="large">
            <PermissionButton
              v-for="item in actions.slice(0, 3)"
              :key="item.key"
              type="link"
              v-bind:="handleFunction(item.permissionProps, record)"
              style="padding: 0"
              :danger="item.command === 'Delete'"
              :popConfirm="
                handleFunction(item.permissionProps, record)?.popConfirm
              "
              :class="extractCssClass(item.style)"
              :data-id="item.key"
            >
              <template v-if="item.icon">
                <img
                  :src="item.icon"
                  alt=""
                  v-if="item.icon.includes('http')"
                  class="image-icon"
                />
                <AIcon v-else :type="item?.icon" />
              </template>
            </PermissionButton>
          </j-space>
  <j-dropdown
    v-if="actions.length > 3"
    placement="bottomRight"
  >
    <j-button type="link">
      <AIcon type="EllipsisOutlined" />
    </j-button>
    <template #overlay>
      <j-menu>
        <j-menu-item
          v-for="(item, i) in actions.slice(3, actions.length)"
          :key="i + item.key"
        >
          <PermissionButton
            v-if="item.permissionProps"
            :key="item.key"
              type="link"
              v-bind:="handleFunction(item.permissionProps, record)"
              style="padding: 0"
              :danger="item.command === 'Delete'"
              :popConfirm="
                handleFunction(item.permissionProps, record)?.popConfirm
              "
              :class="extractCssClass(item.style)"
              :data-id="item.key"
          >
            <template #icon v-if="item.icon || item.key === 'delete'">
              <img
                :src="item.icon"
                v-if="item.icon?.includes('http')"
                class="image-icon"
              />
              <AIcon v-else :type="item.icon ? item.icon : 'DeleteOutlined'" />
            </template>
          </PermissionButton>
        </j-menu-item>
      </j-menu>
    </template>
  </j-dropdown>
</template>

<script setup name="OtherActions">
import {
  extractCssClass,
  insertCustomCssToHead,
} from '@/components/FormDesigner/utils/utils'
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
  props.actions.forEach((item) => {
    insertCustomCssToHead(item.style, item.key, 'dataid')
  })
})

</script>

<style scoped>
.image-icon {
  width: 14px;
  height: 14px;
}
</style>
