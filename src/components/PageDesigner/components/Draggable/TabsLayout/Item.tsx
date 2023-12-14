import DraggableLayout from '../DraggableLayout'
import Selection from '../../Selection'
import '../index.less'
import {useLifeCycle, usePubsub, useTool} from '../../../hooks'
import {handleDataSourceFn} from "../../../utils/utils";

export default defineComponent({
    name: 'TabsItemLayout',
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
        const {isEditModel, isDragArea} = useTool()

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

        const { executionMounted } = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

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
                <Selection
                    class={unref(isDragArea) && 'drag-area'}
                    data={props.data}
                    tag="div"
                    hasCopy={false}
                    hasDel={true}
                    parent={props.parent}
                >
                    <DraggableLayout
                        data-layout-type={'tabs-item'}
                        data={props.data?.children}
                        parent={props.data}
                    />
                </Selection>
            )
        }
    }
})
