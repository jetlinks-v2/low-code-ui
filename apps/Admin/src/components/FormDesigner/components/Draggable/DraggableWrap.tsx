import Draggable from 'vuedraggable'
import { useTarget } from '../../hooks'
import { isHTMLTag } from '@vue/shared'

const DraggableWrap = defineComponent({
    name: 'DraggableWrap',
    inheritAttrs: false,
    components: {
        Draggable
    },
    setup() {
        const { isEditModel } = useTarget()
        return () => {
            const attrs: any = useAttrs()
            if (unref(isEditModel)) {
                return (
                    <Draggable
                        {...attrs}>
                        {useSlots()}
                    </Draggable>
                )
            } else {
                const tag = isHTMLTag(attrs.tag) ? attrs.tag : resolveComponent(attrs?.tag)
                const { item } = useSlots()
                return (
                    <tag {...attrs.componentData}>
                        {attrs.list.map(e => {
                            return item({
                                element: e
                            })
                        })}
                    </tag>
                )
            }
        };
    },
});

export default DraggableWrap;