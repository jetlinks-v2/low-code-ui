import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import {useLifeCycle, usePubsub, useTool} from '../../hooks'
import {handleDataSourceFn} from '../../utils/utils'
import TitleComponent from "@LowCode/components/TitleComponent/index.vue";

export default defineComponent({
    name: 'TitleLayout',
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
            value: {}
        })

        const setVisible = (flag: boolean) => {
            if(unref(isEditModel)) return
            $self.visible = flag
        }
        const setValue = (_val: any) => {
            if(unref(isEditModel)) return
            $self.value = _val
        }

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val) {
                $self.value = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div
                        data-layout-type={'title'}
                        {...unref(_data).componentProps}
                    >
                        <div style={{marginTop: '10px'}}><TitleComponent data={unref(_data)?.componentProps?.title} icon={unref(_data)?.componentProps?.icon}/></div>
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
                                            data-layout-type={'title-item'}
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
