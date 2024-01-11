import {useClipboard} from "@vueuse/core";
 const CopyButton = defineComponent({
    name: 'UseClipboard',
    props: [
        'source'
    ] as unknown as undefined,

    setup(props, { slots }) {
        const data = reactive(useClipboard(props))

        return () => slots.default?.(data)
    },
})

export default CopyButton
