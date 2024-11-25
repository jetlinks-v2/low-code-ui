import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import {useLifeCycle, usePubsub, useTool} from '../../hooks'
import generatorData from '../../utils/generatorData'
import {handleDataSourceFn} from "../../utils/utils";
import {omit} from "lodash-es";

export default defineComponent({
    name: 'InlineLayout',
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
        const { isEditModel, isDragArea, onAddChild } = useTool()

        const list = computed(() => {
            return props.data?.children || []
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

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {},
                formItemProps: {
                    isLayout: false
                },
            })
            onAddChild(_item, props.data)
        }

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {
                        unref(list)?.length ?
                            <div
                                data-layout-type={'inline'}
                                {...omit(props.data.componentProps, ['cssCode', 'createdCode', 'mountedCode', 'request', 'gap', 'justifyContent', 'alignItems'])}
                                style={{
                                    display: "flex",
                                    gap: (props.data.componentProps?.gap ?? 24) + 'px',
                                    justifyContent: props.data.componentProps?.justifyContent || 'flex-start',
                                    alignItems: props.data.componentProps?.alignItems || 'center'
                                }}
                            >
                                {
                                    unref(list).map((element: any) => {
                                        return (
                                            <div key={element.key} {...omit(element.componentProps, ['cssCode', 'createdCode', 'mountedCode', 'request'])}>
                                                <Selection
                                                    class={unref(isDragArea) && 'drag-area'}
                                                    hasDel={unref(list).length > 1}
                                                    data={element}
                                                    tag="div"
                                                    hasCopy={false}
                                                    parent={unref(list)}
                                                >
                                                    <DraggableLayout
                                                        data={element?.children || []}
                                                        data-layout-type={'inline-item'}
                                                        parent={element}
                                                    />
                                                </Selection>
                                            </div>
                                        )
                                    })
                                }
                            </div> : (unref(isEditModel) ? <div class="draggable-empty">内联</div> : <div></div>)
                    }
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加内联项</span></div>
                        </div>
                    }
                </Selection >
            )
        }
    }
})
