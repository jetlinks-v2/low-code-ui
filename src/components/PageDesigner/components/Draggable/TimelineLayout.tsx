import {useLifeCycle, usePubsub, useTool} from "../../hooks"
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
        const {isDragArea, isEditModel} = useTool()
        const $self = reactive({
            visible: true,
            dataSource: [{label: '2023-12-06', value: ''}]
        })
        const setDataSource = (arr: any[]) => {
            $self.dataSource = arr
        }
        const {executionMounted} = useLifeCycle(props.data.componentProps, {setDataSource}, isEditModel)

        onMounted(() => {
            executionMounted()
        })

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn)

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)}
                           parent={props.parent}>
                    <Timeline {...props.data.componentProps}>
                        {
                            $self.dataSource.map((val: any) => {
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