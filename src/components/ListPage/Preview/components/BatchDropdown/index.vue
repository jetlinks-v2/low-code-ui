<template>
  <div>
    <j-space v-if="_item.key && visible">
      <j-popconfirm
        :title="_item.selected?.popConfirm?.title"
        @confirm="_item.selected?.popConfirm?.onConfirm"
      >
        <!-- <j-button
                type="primary"
                ghost
                :dataid="_item.id"
                :class="extractCssClass(_item.style)"
            >
              <img v-if="_item.icon?.includes('http')" :src="_item.icon" class="image-icon">
              <AIcon v-else :type="_item.icon"/>
                {{ _item.text }}
            </j-button> -->
        <PermissionButton
          :type="_item.type === 'Delete' ? 'danger' : 'primary'"
          ghost
          ref="secondLevelBtn"
          :hasPermission="
            route.params.sid ? `${route.params.sid}:${_item.key}` : true
          "
          :class="extractCssClass(_item.style)"
          :data-id="_item.id"
        >
          <template #icon>
            <img
              v-if="_item.icon?.includes('http')"
              :src="_item.icon"
              class="image-icon"
            />
            <AIcon v-else :type="_item.icon" />
          </template>
          {{ _item.text }}
        </PermissionButton>
      </j-popconfirm>
      <j-button type="link" @click="reload"
        ><AIcon type="RedoOutlined" />重选</j-button
      >
    </j-space>
    <j-dropdown :overlayStyle="{ zIndex: 1000 }" v-else>
      <slot></slot>
      <template #overlay>
        <j-menu @click="handleMenuClick">
          <j-menu-item v-for="item in actions" :key="item.key">
            <PermissionButton
              :type="item.type === 'Delete' ? 'danger' : 'primary'"
              ghost
              :popConfirm="
                item.popConfirm
                  ? {
                      ...item.popConfirm,
                      onCancel: onPopCancel,
                      onConfirm: (e) =>
                        onPopConfirm(e, item?.popConfirm?.onConfirm),
                    }
                  : undefined
              "
              ref="secondLevelBtn"
              :hasPermission="
                route.params.sid ? `${route.params.sid}:${item.key}` : true
              "
              :class="extractCssClass(item.style)"
              :data-id="item.id"
            >
              <template #icon>
                <img
                  v-if="item.icon?.includes('http')"
                  :src="item.icon"
                  class="image-icon"
                />
                <AIcon v-else :type="item.icon" />
              </template>
              {{ item.text }}
            </PermissionButton>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { BatchActionsType } from './types'
import {
  extractCssClass,
  insertCustomCssToHead,
} from '@/components/FormDesigner/utils/utils'
import { store } from '@jetlinks-web/stores'

const props = defineProps({
  actions: {
    type: Array as PropType<BatchActionsType[]>,
    default: () => [],
  },
  isCheck: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:isCheck', 'change'])
const route = useRoute()
const visible = ref<boolean>(false)
const _item = ref<Partial<BatchActionsType>>({})
const secondLevelBtn = ref()

const handleMenuClick = (e: any) => {
  const val = props.actions.find((item) => item.key === e.key)
  if(!store.AuthStore.hasPermission(route.params.sid + ':' + val?.key) && route.params.sid) {
    return
  }
  if (!(val?.popConfirm || val?.onClick)) {
    emits('update:isCheck', true)
    emits('change', true)
    visible.value = true
  } else {
    visible.value = false
    val?.onClick?.(val)
  }
  _item.value = (val || {}) as any
}

const reload = () => {
  _item.value = {}
  emits('update:isCheck', false)
  emits('change', false)
}

const onPopConfirm = (e: any, fun: any) => {
  if (fun) {
    fun(e)
    onPopCancel()
  }
}

const onPopCancel = () => {
  visible.value = false
}

const batchClick = (v) => {
  if (v.selected?.popConfirm) {
  }
}

watchEffect(() => {
  props.actions.forEach((item) => {
    console.log(item)
    insertCustomCssToHead(item.style, item.key, 'dataid')
  })
})
</script>

<style lang="less" scoped></style>
