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
    <Modal v-if="visible && buttonConfig?.type === 'Modal'" :button-config="buttonConfig" @close="setVisible(false)" />
    <Drawer v-if="visible && buttonConfig?.type === 'Drawer'" :button-config="buttonConfig" @close="setVisible(false)" />
</template>

<script lang="ts" setup name="Button">
import { omit } from "lodash-es";
import { PropType, ref } from "vue";
import Modal from './buttonModal.vue'
import Drawer from './buttonDrawer.vue'
import { request as axiosRequest } from "@jetlinks-web/core/src/request";
import {usePageProvider} from "@LowCode/components/PageDesigner/hooks";
import {useRouter} from 'vue-router'
import { useMenuStore } from '@LowCode/store'

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
        type: Object,
    },
});

const pageProvider = usePageProvider()
const route = useRoute()
const router = useRouter()
const menu = useMenuStore()

const visible = ref(false)

const setVisible = (val: boolean) => {
    visible.value = val;
};


const defaultParams = () => {
    try {
        return JSON.parse(props.buttonConfig?.config?.defaultParams)
    } catch (e) {
        return undefined
    }
}

const handleRequestFn = async () => {
    const config = props.buttonConfig?.config
    if (props.buttonConfig?.config.query) {
        const paramsData = defaultParams()
        try {
            const resp = await axiosRequest[config.methods](config.query, paramsData)
            if (config.click) {
                const handleResultFn = new Function('context', 'route', 'router', 'result', config.click)
                handleResultFn(pageProvider.context, route, router, resp)
            }
        } catch (e) {
            console.error(e)
        }
    } else {
      if (config.click) {
        const handleResultFn = new Function('context', 'route', 'jumpPageByCode','axios','refs', config.click)
        handleResultFn(pageProvider.context, route, menu.jumpPageByCode, axiosRequest,{
            slots: pageProvider.slots,
        })
      }
    }
}

const onClick = () => {
    if (props.buttonConfig?.type === 'Button') {
        handleRequestFn()
    } else {
        setVisible(true)
    }
};

const onConfirm = () => {
    handleRequestFn()
};
</script>
