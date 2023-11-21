<template>
  <div class="table-actions" ref="tableActions">
    <j-space size="large">
      <PermissionButton
        v-for="item in actions.slice(
          0,
          showLength < 4 || showLength >= actions.length
            ? showLength
            : showLength - 1,
        )"
        :key="item.key"
        type="link"
        v-bind:="handleFunction(item.permissionProps, record)"
        style="padding: 0"
        :danger="item.command === 'Delete'"
        :popConfirm="handleFunction(item.permissionProps, record)?.popConfirm"
        :class="extractCssClass(item.style)"
        :hasPermission="
          route.params.sid ? `${route.params.sid}:${item.key}` : true
        "
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
      </PermissionButton>
      <j-dropdown v-if="actions.length > showLength" placement="bottom">
        <j-button type="link" style="padding: 0">
          <AIcon type="EllipsisOutlined" />
        </j-button>
        <template #overlay>
          <j-menu>
            <j-menu-item
              v-for="(item, i) in actions.slice(showLength - 1, actions.length)"
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
                :hasPermission="
                  route.params.sid ? `${route.params.sid}:${item.key}` : true
                "
                :data-id="item.id"
              >
                <template #icon v-if="item.icon || item.key === 'delete'">
                  <img
                    :src="item.icon"
                    v-if="item.icon?.includes('http')"
                    class="image-icon"
                  />
                  <AIcon
                    v-else
                    :type="item.icon ? item.icon : 'DeleteOutlined'"
                  />
                </template>
              </PermissionButton>
            </j-menu-item>
          </j-menu>
        </template>
      </j-dropdown>
    </j-space>
  </div>
</template>

<script setup name="OtherActions">
import {
  extractCssClass,
  insertCustomCssToHead,
} from '@/components/FormDesigner/utils/utils'
import { isFunction, isObject } from 'lodash-es'

const props = defineProps({
  record: {
    type: Object,
    default: () => ({}),
  },
  actions: {
    type: Array,
    default: () => [],
  },
})

const route = useRoute()
const tableActions = ref()
const showLength = ref(0)
onMounted(() => {
  console.log(Math.ceil(tableActions.value.clientWidth / 40))
  showLength.value = Math.floor(tableActions.value.clientWidth / 40)
})

window.addEventListener('resize', () => {
  nextTick(() => {
    showLength.value = Math.ceil(tableActions.value?.clientWidth / 40)
  })
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
.table-actions {
  width: 100%;
  display: flex;
}
.image-icon {
  margin: 0;
}
</style>
