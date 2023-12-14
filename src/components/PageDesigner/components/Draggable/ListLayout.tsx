import {useLifeCycle, usePubsub, useTool} from "../../hooks"
import Selection from '../Selection/index'
import DraggableLayout from "./DraggableLayout"
import {handleDataSourceFn} from "../../utils/utils";

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
        const {isDragArea, isEditModel} = useTool()

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        const $self = reactive({
            visible: true,
            dataSource: [1]
        })
        const setDataSource = (arr: any[]) => {
            if(unref(isEditModel)) return
            $self.dataSource = arr
        }
        const setVisible = (flag: boolean) => {
            if(unref(isEditModel)) return
            $self.visible = flag
        }

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setDataSource, setVisible}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val && Array.isArray(_val)) {
                $self.dataSource = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div>
                        {
                            $self.dataSource.map(() => {
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