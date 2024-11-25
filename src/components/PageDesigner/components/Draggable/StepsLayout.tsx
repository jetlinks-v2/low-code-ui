import DraggableLayout from '../Draggable/DraggableLayout'
import Selection from '../Selection/index'
import {Steps, Step, Button, Space, AIcon} from 'jetlinks-ui-components'
import './index.less'
import {useLifeCycle, usePubsub, useTool} from '../../hooks'
import {withModifiers} from 'vue'
import generatorData from '../../utils/generatorData'
import {uid} from '../../utils/uid'
import {handleDataSourceFn} from "../../utils/utils";

export default defineComponent({
    name: 'StepsLayout',
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
        const {isDragArea, isEditModel, onAddChild, paramsUtil, _global} = useTool()
        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })
        const current = ref<number>(0)

        const handleAdd = () => {
            const _item = generatorData({
                type: 'steps-item',
                children: [],
                componentProps: {
                    title: '标题' + uid(4)
                },
            })
            onAddChild(_item, props.data)
        }

        const onChange = (cur: number) => {
            if (isEditModel.value) {
                current.value = cur || 0
            }
        }

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

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val) {
                $self.value = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        const buttonRender = () => {
            return (props.data.componentProps?.action || []).filter((item: any) => {
                return item.show.includes(unref(list)?.[current.value]?.key)
            }).map((i: any) => {
                const _props = {
                    danger: i.danger,
                    key: i.key,
                    text: i.text,
                    type: i.type,
                    icon: i.icon ? <AIcon type={i.icon} /> : ''
                }
                return <Button {..._props} onClick={() => {
                    if(!unref(isEditModel) && i.eventCode) {
                        const handleResultFn = new Function('refs', 'util', 'global', i?.eventCode)
                        handleResultFn({
                            current
                        }, paramsUtil, _global)
                    }
                }}>{i.text}</Button>
            })
        }

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Steps current={current.value} data-layout-type={'steps'} {...unref(_data).componentProps}
                           onChange={onChange}>
                        {
                            unref(list).map((element: any) => {
                                return (
                                    <Step {...element.componentProps} icon={element.componentProps?.icon ?
                                        <AIcon type={element.componentProps?.icon}/> : undefined}/>
                                )
                            })
                        }
                    </Steps>
                    <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={unref(list)?.[current.value]}
                        tag="div"
                        hasCopy={false}
                        hasDel={unref(list).length > 1}
                        parent={unref(list)}
                        style={{
                            margin: '20px 10px',
                        }}
                    >
                        <DraggableLayout
                            data-layout-type={'steps-item'}
                            data={unref(list)?.[current.value]?.children || []}
                            parent={unref(list)?.[current.value]}
                        />
                    </Selection>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        margin: '10px'
                    }}>
                        <Space>{buttonRender()}</Space>
                    </div>
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>
                                <span>添加步骤</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
