import Draggable from '../JSortable/index'
import { isHTMLTag } from '@vue/shared'
import { PropType } from 'vue'

const DraggableWrap = defineComponent({
    name: 'DraggableWrap',
    // inheritAttrs: false,
    customOptions: {},
    components: {
        Draggable
    },
    props: {
        model: {
            type: String as PropType<'preview' | 'edit'>,
            default: 'edit'
        }
    },
    setup(props) {
        return () => {
            const attrs: any = useAttrs()
            if (props.model === 'edit') {
                return (
                    <Draggable {...attrs}>
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

