import { syncWidthByPlatform } from "../../utils/utils"
import DraggableLayout from "./DraggableLayout"

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
        const _data: any = inject('FormDesigner')

        watch(() => props.data.columns.length, (newVal, oldVal) => {
            if (!newVal) {
                props.data.context.delete()
            }
            if (newVal !== oldVal) {
                syncWidthByPlatform(props.data.columns, _data.state.platform, _data.props.layoutType === 1)
            }
        })
        const dragOptions = {
            direction: 'horizontal'
        }
        return () => {
            return (
                <div>
                    <DraggableLayout
                        data-layout-type={'inline'}
                        class={''}
                        type={'inline'}
                        {...dragOptions}
                        data={props.data.columns}
                        parent={props.parent} />
                </div>
            )
        }
    }
})
