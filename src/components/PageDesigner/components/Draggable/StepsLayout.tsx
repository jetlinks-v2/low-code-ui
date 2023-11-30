import DraggableLayout from '../Draggable/DraggableLayout'
import Selection from '../Selection/index'
import { Steps, Step, Button, Space, AIcon } from 'jetlinks-ui-components'
import './index.less'
import { useLifeCycle, useTool } from '../../hooks'
import { withModifiers } from 'vue'
import generatorData from '../../utils/generatorData'
import { uid } from '../../utils/uid'

export default defineComponent({
    name: 'StepsLayout',
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
        const { isDragArea, isEditModel, onAddChild } = useTool()
        const { executionMounted } = useLifeCycle(props.data.componentProps, {}, isEditModel)

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

        const onPrev = () => {
            if (isEditModel.value) {
                if (current.value > 0) {
                    current.value--;
                }
            }
        }

        const onNext = () => {
            if (isEditModel.value) {
                if (current.value < unref(list)?.length - 1) {
                    current.value++;
                }
            }
        }

        const onFinish = () => {
            if (isEditModel.value) {
                console.log('finish')
            }
        }

        const onChange = (cur: number) => {
            if (isEditModel.value) {
                current.value = cur || 0
            }
        }
        onMounted(() => {
            executionMounted()
        })

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Steps current={current.value} data-layout-type={'steps'} {...unref(_data).componentProps} onChange={onChange}>
                        {
                            unref(list).map((element: any) => {
                                return (
                                    <Step {...element.componentProps} icon={element.componentProps?.icon ? <AIcon type={element.componentProps?.icon} /> : undefined} />
                                )
                            })
                        }
                    </Steps>
                    <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={unref(list)?.[current.value]}
                        tag="div"
                        hasCopy={true}
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
                        <Space>
                            {current.value > 0 && <Button onClick={onPrev}>上一步</Button>}
                            {current.value < unref(list)?.length - 1 && <Button onClick={onNext}>下一步</Button>}
                            {current.value === unref(list)?.length - 1 && <Button onClick={onFinish} type='primary'>完成</Button>}
                        </Space>
                    </div>
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加步骤</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
