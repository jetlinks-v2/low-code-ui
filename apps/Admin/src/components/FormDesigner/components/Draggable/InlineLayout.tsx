import { useFormDesignerStore } from "@/store"
import DraggableLayout from "./DraggableLayout"
import './index.less'

export default defineComponent({
    name: 'InlineLayout',
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const designer = useFormDesignerStore()

        watch(() => props.data.children, (newVal, oldVal) => {
            // console.log(newVal, oldVal)
            if (!newVal) {
                // props.data.context.delete()
            }
            if (newVal !== oldVal) {
                // console.log(newVal, oldVal)
                // syncWidthByPlatform(props.data.columns, designer)
            }
        })
        const dragOptions = {
            direction: 'horizontal'
        }
        return () => {
            return (
                <div class={'inline-container'}>
                    <DraggableLayout
                        data-layout-type={'inline'}
                        type={'inline'}
                        {...dragOptions}
                        data={props.data.children}
                        parent={props.parent} />
                </div>
            )
        }
    }
})
