import {useLifeCycle, useTool} from "../../hooks"
import Selection from '../Selection/index'
import {Timeline, TimelineItem} from 'jetlinks-ui-components'
import DraggableLayout from "./DraggableLayout"
import {omit} from "lodash-es"

export default defineComponent({
    name: 'TimelineLayout',
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
        const myValue = ref<any[]>([{label: '2015-09-01', color: 'red'}])
        const {executionMounted} = useLifeCycle(props.data.componentProps, {myValue}, isEditModel)

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
                    <Timeline {...props.data.componentProps}>
                        {
                            unref(myValue).map((val: any) => {
                                return <TimelineItem {...omit(val, 'label')}>
                                    <p>{val.label}</p>
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
                                </TimelineItem>
                            })
                        }
                    </Timeline>
                </Selection>
            )
        }
    }
})