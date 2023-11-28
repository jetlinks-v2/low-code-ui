<template>
    <j-popconfirm v-if="buttonConfig?.type === 'Popconfirm'" :title="buttonConfig.config?.title" @confirm="onConfirm">
        <j-button v-bind="omit(props, 'icon')">
            <template v-if="icon" #icon>
                <AIcon :type="icon" />
            </template>
            {{ text }}</j-button>
    </j-popconfirm>

    <j-button v-else v-bind="omit(props, 'icon')" @click="onClick">
        <template v-if="icon" #icon>
            <AIcon :type="icon" />
        </template>
        {{ text }}
    </j-button>
    <Modal v-if="visible && buttonConfig?.type === 'Modal'" :button-config="buttonConfig" @close="setVisible(false)"/>
    <Drawer  v-if="visible && buttonConfig?.type === 'Drawer'" :button-config="buttonConfig" @close="setVisible(false)"/>
</template>
  
<script lang="ts" setup name="Button">
import { omit } from "lodash-es";
import { PropType, ref } from "vue";
import Modal from './buttonModal.vue'
import Drawer from './buttonDrawer.vue'

const props = defineProps({
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
    // loading: {
    //   type: String as PropType<"large" | "middle" | "small">,
    //   default: "middle",
    // },
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
    buttonConfig: {
        type: Object
    }
});



const visible = ref(false)

const setVisible = (val: boolean) => {
    visible.value = val;
};


const setFunc = (code: string) => {
    const func = new Function(code);
    func()
}

const onClick = () => {
    if (props.buttonConfig?.type === 'Button') {
        setFunc(props.buttonConfig?.config.click)
    } else {
        setVisible(true)
    }
};

const onConfirm = () => {
    setFunc(props.buttonConfig?.config?.confirm)
};


</script>