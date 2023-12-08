import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import {usePubsub, useTool} from '../../hooks'
export default defineComponent({
    name: 'CardLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const { isDragArea } = useTool()

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        const $self = reactive({
            visible: true
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
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div
                        data-layout-type={'card'}
                        {...unref(_data).componentProps}
                    >
                        {
                            unref(list).map((element: any) => {
                                return (
                                    <Selection
                                        class={unref(isDragArea) && 'drag-area'}
                                        data={element}
                                        tag="div"
                                        hasCopy={false}
                                        hasDel={unref(list).length > 1}
                                        parent={unref(list)}
                                    >
                                        <DraggableLayout
                                            data-layout-type={'card-item'}
                                            data={element.children}
                                            parent={element}
                                        />
                                    </Selection>
                                )
                            })
                        }
                    </div>
                </Selection>
            )
        }
    }
})
