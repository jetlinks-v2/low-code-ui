import DraggableLayout from '../DraggableLayout'
import Selection from '../../Selection'
import '../index.less'
import {useLifeCycle, usePubsub, useTool} from '../../../hooks'
import {handleDataSourceFn} from "../../../utils/utils";
export default defineComponent({
    name: 'InfoItemItemLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        parent: {
            type: Array,
            default: () => []
        },
        parentData: {
            type: Object,
            default: () => ({})
        },
        isBordered: {
            type: Boolean,
            default: true
        }
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

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.componentProps?.label)

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
                    <div style={{
                        display: 'flex',
                        minHeight: '40px',
                        border: props.isBordered ? '#e5e5e5 solid 1px' : 'none',
                        marginTop: '-1px',
                        marginRight: '-1px'
                    }}>
                        <div
                            style={{
                                width: (props.parentData?.componentProps?.labelWidth || 200) + 'px',
                                backgroundColor: props.isBordered ? '#fafafa' : '#fff',
                                borderRight: props.isBordered ? '#e5e5e5 solid 1px' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px 24px'
                            }}
                            class={!props.isBordered && "info-label"}>
                            <span>{props.data?.componentProps?.label}</span>
                        </div>
                        <div style={{flex: 1, padding: '16px 24px'}}>
                            {
                                (props.data?.children || []).map((_item: any) => {
                                    return <Selection
                                        class={unref(isDragArea) && 'drag-area'}
                                        data={_item}
                                        tag="div"
                                        hasCopy={false}
                                        hasDel={false}
                                        parent={_item.children}
                                    >
                                        <DraggableLayout
                                            data-layout-type={'info-item-item-item'}
                                            data={_item?.children || []}
                                            parent={_item}
                                        />
                                    </Selection>
                                })
                            }
                        </div>
                    </div>
                </Selection>
            )
        }
    }
})