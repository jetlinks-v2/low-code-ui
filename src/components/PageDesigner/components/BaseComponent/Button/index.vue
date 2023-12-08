<template>
  <template v-if="$self.visible">
    <j-popconfirm v-if="evetn?.type === 'confirm'" :title="event?.title" @confirm="onConfirm">
      <j-button v-bind="_props" :loading="_loading" :disabled="disabled">
        <template v-if="_icon" #icon>
          <AIcon :type="_icon"/>
        </template>
        {{ _value }}
      </j-button>
    </j-popconfirm>
    <j-button v-else v-bind="_props" @click="onClick" :loading="_loading" :disabled="disabled">
      <template v-if="_icon" #icon>
        <AIcon :type="_icon"/>
      </template>
      {{ _value }}
    </j-button>
    <Modal v-if="visible" :data="dataModal" @save="onClose" @close="onClose" />
  </template>
</template>

<script lang="ts" setup>
import {omit} from "lodash-es";
import {computed, PropType, ref} from "vue";
import {usePubsub, useTool} from "@LowCode/components/PageDesigner/hooks";
import Modal from '../MyModal';

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: "",
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
  loading: {
    type: Boolean,
    default: false
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
  event: {
    type: Object,
  },
  responder: {
    type: Object,
    default: () => ({})
  }
});

const {paramsUtil, _global} = useTool()

const visible = ref(false)

const $self = reactive({
  visible: true,
  text: props.text,
  loading: props.loading,
  disabled: props.disabled,
  icon: props.icon
})

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const _handleResultFn = new Function('$self', '$dep', '$depValue', props.responder?.responder)
    _handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

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
  return $self?._icon || props._icon
})

const _props = computed(() => {
  return omit(props, ['icon', 'loading', 'disabled', 'event', 'responder'])
})

const dataModal = computed(() => {
  return {
    pageType: props.event?.pageType || 'form',
    code: props.event?.pageData,
    title: props.event?.title,
    createdCode: props.event?.createdCode,
    okCode: props.event?.okCode,
    cancelCode: props.event?.cancelCode,
    modalType: props.event?.type || 'modal',
  }
})

const handleRequestFn = () => {
  if (props.event?.okCode) {
    const handleResultFn = new Function('util', 'global', props.event?.okCode)
    handleResultFn(paramsUtil, _global)
  }
}

const onClick = () => {
  if(props.event?.type === 'common'){
    handleRequestFn()
  } else {
    visible.value = true
  }
};

const onConfirm = () => {
  handleRequestFn()
};

const onClose = () => {
  visible.value = false
}
</script>