import {useLifeCycle, useTool} from "../../hooks"
import Selection from '../Selection/index'
import DraggableLayout from "./DraggableLayout"

export default defineComponent({
    name: 'ListLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => {
            }
        },
        parent: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const {isDragArea, isEditModel, onAddChild} = useTool()
        const dataSource = ref<any[]>([1])
        const {executionMounted} = useLifeCycle(props.data.componentProps, {dataSource}, isEditModel)

        onMounted(() => {
            executionMounted()
        })

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)}
                           parent={props.parent}>
                    <div>
                        {
                            unref(dataSource).map(() => {
                                return <div>
                                    {
                                        unref(list).map((item: any) => {
                                            return <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                data={item}
                                                tag="div"
                                                hasCopy={false}
                                                hasDel={unref(list).length > 1}
                                                parent={unref(list)}
                                            >
                                                <DraggableLayout
                                                    data-layout-type={'timeline-item'}
                                                    data={item?.children || []}
                                                    parent={item}
                                                />
                                            </Selection>
                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
                </Selection>
            )
        }
    }
})