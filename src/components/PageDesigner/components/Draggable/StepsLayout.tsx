import DraggableLayout from '../Draggable/DraggableLayout'
import Selection from '../Selection/index'
import { Steps, Step, Button, Space } from 'jetlinks-ui-components'
import './index.less'
import { omit } from 'lodash-es'
import { useTool } from '../../hooks'
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
        const { isDragArea, isEditModel } = useTool()
        const designer: any = inject('FormDesigner')

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
            designer.onAddChild(_item, props.data)
        }

        const onPrev = () => {
            if (isEditModel.value) {
                if(current.value > 0){
                    current.value--;
                }
            }
        }

        const onNext = () => {
            if (isEditModel.value) {
                if(current.value < unref(list)?.length - 1){
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

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Steps current={current.value} data-layout-type={'steps'} {...omit(unref(_data).componentProps, 'description')} onChange={onChange}>
                        {
                            unref(list).map(element => {
                                return (
                                    <Step {...element.componentProps} />
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
