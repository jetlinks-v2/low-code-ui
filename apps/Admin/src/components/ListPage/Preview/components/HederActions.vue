<template>
  <div class="headerBtn">
    <div v-for="item in props.headerActions" :key="item.key">
      <PermissionButton
        :type="item.type"
        v-bind:="handleFunction(item.permissionProps, item)"
        style="width: 134px; margin-right: 10px"
        :danger="item.command === 'Delete'"
        :popConfirm="handleFunction(item.permissionProps)?.popConfirm"
        v-if="item?.children?.length === 0"
      >
        <!-- <AIcon v-if="item.icon" :type="item?.icon" /> -->
        {{ item?.text }}
      </PermissionButton>

      <j-dropdown
        :trigger="['click']"
        placement="bottomLeft"
        v-if="item?.children?.length !== 0"
      >
        <j-button class="childBtn">
          {{ item.text }}
        </j-button>
        <template #overlay>
          <j-menu>
            <j-menu-item v-for="child in item?.children" :key="child.key">
              <PermissionButton
                v-bind:="handleFunction(child.permissionProps, child)"
                :danger="child.command === 'Delete'"
                style="width: 100%"
                :popConfirm="
                  handleFunction(child.permissionProps, child)?.popConfirm
                "
              >
                <!-- <AIcon v-if="item.icon" :type="item?.icon" /> -->
                {{ child?.text }}
              </PermissionButton>
            </j-menu-item>
          </j-menu>
        </template>
      </j-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isFunction, isObject } from 'lodash-es'
const props = defineProps({
  headerActions: {
    type: Array,
    default: () => [],
  },
})

const handleFunction = (item: any, data?: any) => {
  if (isFunction(item)) {
    return item(data)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}
</script>
<style lang="less" scoped>
.headerBtn {
  display: flex;
  .childBtn {
    margin-right: 10px;
    width: 134px;
  }
}
</style>
