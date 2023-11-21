import DraggableLayout from '../Draggable/DraggableLayout'
import Selection from '../Selection/index'
import { Steps, Step } from 'jetlinks-ui-components'
import './index.less'
import { omit } from 'lodash-es'
import { useTool } from '../../hooks'

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
        const { isDragArea } = useTool()

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Steps data-layout-type={'steps'} {...omit(unref(_data).componentProps, 'description')}>
                        {
                            unref(list).map(element => {
                                return (
                                    <Step {...element.componentProps} />
                                )
                            })
                        }
                    </Steps>
                    <div>
                        123
                    </div>
                    <div>
                        456
                    </div>
                    {/* <Selection
                                            class={unref(isDragArea) && 'drag-area'}
                                            data={element}
                                            tag="div"
                                            hasCopy={true}
                                            hasDel={unref(list).length > 1}
                                            parent={unref(list)}
                                        >

                                            <DraggableLayout
                                                data-layout-type={'steps-item'}
                                                data={element.children}
                                                parent={element}
                                            />

                                        </Selection> */}
                </Selection>
            )
        }
    }
})
