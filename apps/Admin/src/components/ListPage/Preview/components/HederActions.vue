<template>
  <div class="headerBtn">
    <j-space>
      <div v-for="item in props.headerActions" :key="item.key">
        <PermissionButton
          type="primary"
          :class="className(item.style)"
          v-bind:="handleFunction(item.permissionProps, item, item)"
          :danger="item.command === 'Delete'"
          :popConfirm="handleFunction(item.permissionProps)?.popConfirm"
          v-if="item?.children?.length === 0"
        >
          <AIcon v-if="item.icon" :type="item?.icon" />
          {{ item?.text }}
        </PermissionButton>


        <BatchDropdown
            v-model:isCheck="isCheck"
            :actions="item?.children"
            @change="onCheckChange"
            v-else
        >
          <j-button>{{ item.title }} <AIcon type="DownOutlined" /></j-button>
        </BatchDropdown>
        <!-- <j-dropdown
          :trigger="['click']"
          placement="bottomLeft"
          v-if="item?.children?.length !== 0"
        >
          <j-button class="childBtn">
            {{ item.text }}
            <AIcon type="DownOutlined" />
          </j-button>
          <template #overlay>
            <j-menu>
              <j-menu-item v-for="child in item?.children" :key="child.key">
                <PermissionButton
                  v-bind:="handleFunction(child.permissionProps, child)"
                  :danger="child.command === 'Delete'"
                  style="width: 100%"
                  :popConfirm="
                    
                    handleFunction(child.permissionProps, child, child)?.popConfirm
                  
                  "
                >
                  <AIcon v-if="child.icon" :type="child?.icon" />
                  {{ child?.text }}
                </PermissionButton>
              </j-menu-item>
            </j-menu>
          </template>
        </j-dropdown> -->
      </div>
    </j-space>
  </div>
</template>
<script setup lang="ts">
import { isFunction, isObject } from 'lodash-es'
import { PropType } from 'vue';
import { extractCssClass, insertCustomCssToHead } from '@/components/FormDesigner/utils/utils';
import BatchDropdown from './BatchDropdown/index.vue'

const isCheck = ref(false)
const onCheckChange = () => {

  
}

const props = defineProps({
  headerActions: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
})

const className = computed(() => {
  return (val: string) => {
    return extractCssClass(val)
  }
})
const handleFunction = (item: any, data?: any) => {
  if (isFunction(item)) {
    return item(data)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}


watchEffect(() => {
  props.headerActions.forEach((item) => {
    insertCustomCssToHead(item.style, item.key)
  })
})
</script>
<style lang="less" scoped>
.headerBtn {
  display: flex;
}
</style>
