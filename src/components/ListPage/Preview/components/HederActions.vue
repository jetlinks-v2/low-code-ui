<template>
  <div class="headerBtn">
    <j-space>
      <div v-for="item in props.headerActions" :key="item.key">
        <PermissionButton
          v-if="item?.children?.length === 0"
          type="primary"
          :class="className(item.style)"
          v-bind:="handleFunction(item.permissionProps, item, item)"
          :danger="item.command === 'Delete'"
          :hasPermission="route.params.sid ? `${route.params.sid}:${item.key}` : true"
          :data-id="item.id"
        >
          <j-space>
            <template v-if="item.icon">
              <img :src="item.icon" alt="" v-if="item.icon.includes('http')" class="image-icon">
              <AIcon v-else :type="item?.icon" />
            </template>
            {{ item?.text }}
          </j-space>
        </PermissionButton>


        <BatchDropdown
            v-model:isCheck="isCheck"
            :actions="item?.children"
            v-else
        >
        <PermissionButton
        :key="item.key"
        :danger="item.command === 'Delete'"
        :class="extractCssClass(item.style)"
        :hasPermission="route.params.sid ? `${route.params.sid}:${item.key}` : true"
        :data-id="item.id"
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
        {{ item.title }} <AIcon type="DownOutlined" />
      </PermissionButton>
        </BatchDropdown>
      </div>
    </j-space>
  </div>
</template>
<script setup lang="ts">
import { isFunction, isObject } from 'lodash-es'
import { PropType } from 'vue';
import { extractCssClass, insertCustomCssToHead } from '@LowCode/components/FormDesigner/utils/utils';
import BatchDropdown from './BatchDropdown/index.vue'

const isCheck = ref(false)
const route = useRoute()
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
    insertCustomCssToHead(item.style, item.key, 'dataid')
  })
})

defineExpose({
  isCheck
})
</script>
<style lang="less" scoped>
.headerBtn {
  display: flex;
}
</style>
