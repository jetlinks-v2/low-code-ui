<template>
  <template v-if="$self.visible">
    <j-popconfirm v-if="event?.type === 'confirm'" :title="event?.title" @confirm="onConfirm">
      <j-button v-bind="_props" :loading=" $self.loading" :disabled=" $self.disabled">
        <template v-if=" $self.icon" #icon>
          <AIcon :type=" $self.icon"/>
        </template>
        {{ $self.text }}
      </j-button>
    </j-popconfirm>
    <j-button v-else v-bind="_props" @click="onClick" :loading=" $self.loading" :disabled=" $self.disabled">
      <template v-if=" $self.icon" #icon>
        <AIcon :type=" $self.icon"/>
      </template>
      {{ $self.text }}
    </j-button>
    <Modal v-if="visible" :data="dataModal" @save="onClose" @close="onClose" />
  </template>
</template>

<script lang="ts" setup>
import {omit} from "lodash-es";
import {computed, PropType, ref} from "vue";
import {useLifeCycle, usePubsub, useTool} from "@LowCode/components/PageDesigner/hooks";
import Modal from '../MyModal';
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

const {paramsUtil, _global, isEditModel} = useTool()

const visible = ref(false)

const $self = reactive({
  visible: true,
  text: props.text,
  loading: props.loading,
  disabled: props.disabled,
  icon: props.icon
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

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn, props?.name)

handleDataSourceFn(props?.request || {}, unref(isEditModel)).then((_val: any) => {
  if (_val) {
    $self.text = _val
  }
})

onMounted(() => {
  executionMounted()
})

watchEffect(() => {
  $self.text = props.text
})

watchEffect(() => {
  $self.loading = props.loading
})
watchEffect(() => {
  $self.disabled = props.disabled
})
watchEffect(() => {
  $self.icon = props.icon
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
    const handleResultFn = new Function('refs','util', 'global', props.event?.okCode)
    handleResultFn({setVisible, setDisabled, setText, setLoading, setIcon},paramsUtil, _global)
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