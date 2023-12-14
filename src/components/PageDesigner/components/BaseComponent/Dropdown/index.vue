<template>
  <div v-if="$self.visible">
    <j-space v-if="visible && _item.key">
      <j-popconfirm v-if="_item?.event?.type === 'confirm'" :title="_item?.event?.confirmText" @confirm="onConfirm(_item)">
        <j-button v-bind="getProps(_item)">
          <template #icon v-if="_item?.icon">
            <AIcon :type="_item?.icon"></AIcon>
          </template>
          {{ _item?.text }}
        </j-button>
      </j-popconfirm>
      <j-button v-else v-bind="getProps(_item)" @click="onClick(_item)">
        <template #icon v-if="_item?.icon">
          <AIcon :type="_item?.icon"></AIcon>
        </template>
        {{ _item?.text }}
      </j-button>
      <j-button type="link" @click="reload">
        <AIcon type="RedoOutlined"/>
        重选
      </j-button>
    </j-space>
    <j-dropdown v-else>
      <j-button v-bind="getProps(props)" :disabled="_disabled" :loading="_loading">
        <template #icon v-if="_icon">
          <AIcon :type="_icon"></AIcon>
        </template>
        {{ _value }}
      </j-button>
      <template #overlay>
        <j-menu @click="handleMenuClick">
          <j-menu-item v-for="item in menu" :key="item?.key">
            <j-button v-bind="omit(item, ['key', 'text', 'icon'])">
              <template #icon v-if="item?.icon">
                <AIcon :type="item?.icon"></AIcon>
              </template>
              {{
                item?.text
              }}
            </j-button>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
    <Modal v-if="comVisible" :data="dataModal" @save="onClose" @close="onClose" />
  </div>
</template>

<script lang="ts" setup>
import {omit} from "lodash-es";
import {useLifeCycle, usePubsub, useTool} from "@LowCode/components/PageDesigner/hooks";
import {computed} from "vue";
import Modal from "../MyModal";
import {handleDataSourceFn} from "../../../utils/utils";

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
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
  clickCode: {
    type: String,
  },
  reloadCode: {
    type: String,
  },
  mountedCode:{
    type: String,
    default: ''
  },
  createdCode:{
    type: String,
    default: ''
  },
  responder: {
    type: Object,
    default: () => ({})
  },
  request: {
    type: Object,
    default: () => ({})
  }
});

const visible = ref(false)
const _item = ref()
const {paramsUtil, _global, isEditModel} = useTool()
const dataModal = ref({})
const comVisible = ref(false)

const handleMenuClick = (e: any) => {
  const val = props.menu.find(i => i.key === e.key);
  _item.value = val
  visible.value = true
  if (props.clickCode) {
    const handleResultFn = new Function('e','util', 'global', props.clickCode)
    handleResultFn(e, paramsUtil, _global)
  }
}
const reload = () => {
  if (props.reloadCode) {
    const handleResultFn = new Function('util', 'global', props.reloadCode)
    handleResultFn(paramsUtil, _global)
  }
  visible.value = false
}

const $self = reactive({
  visible: true,
  text: '',
  loading: false,
  disabled: false,
  icon: ''
})

const setVisible = (flag: boolean) => {
  if(unref(isEditModel)) return
  $self.visible = flag
}
const setText = (_val: any) => {
  if(unref(isEditModel)) return
  $self.text = _val
}
const setLoading = (flag: boolean) => {
  if(unref(isEditModel)) return
  $self.loading = flag
}

const setIcon = (_val: any) => {
  if(unref(isEditModel)) return
  $self.icon = _val
}
const setDisabled = (flag: boolean) => {
  if(unref(isEditModel)) return
  $self.disabled = flag
}

const { executionMounted } = useLifeCycle(props, {setVisible, setDisabled, setText, setLoading, setIcon}, isEditModel)
const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const _handleResultFn = new Function('$self', '$dep', '$depValue', props.responder?.responder)
    _handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn, props.name)

handleDataSourceFn(props?.request || {}, unref(isEditModel)).then((_val: any) => {
  if (_val) {
    $self.text = _val
  }
})

onMounted(() => {
  executionMounted()
})

const _value = computed(() => {
  return $self?.text || props.text
})

const _loading = computed(() => {
  return $self?.loading || props.loading
})

const _disabled = computed(() => {
  return $self?.disabled || props.disabled
})

const _icon = computed(() => {
  return $self?.icon || props.icon
})

const getProps = (item: any) => {
  return omit(item, ['_key', 'icon', 'loading', 'disabled', 'event', 'responder'])
}

const handleRequestFn = (_okCode: string) => {
  if (_okCode) {
    const handleResultFn = new Function('refs','util', 'global', _okCode)
    handleResultFn({setVisible, setDisabled, setText, setLoading, setIcon},paramsUtil, _global)
  }
}

const onClick = (item: any) => {
  if(item?.event?.type === 'common' || item?.event?.type === 'confirm'){
    handleRequestFn(item?.event?.okCode)
  } else {
    dataModal.value = {
      pageType: item.event?.pageType || 'form',
      code: item.event?.pageData,
      title: item.event?.title,
      createdCode: item.event?.createdCode,
      okCode: item.event?.okCode,
      cancelCode: item.event?.cancelCode,
      modalType: item.event?.type || 'modal',
    }
    comVisible.value = true
  }
};

const onConfirm = (item: any) => {
  handleRequestFn(item?.event?.okCode)
};

const onClose = () => {
  comVisible.value = false
}
</script>

<style lang="less" scoped></style>