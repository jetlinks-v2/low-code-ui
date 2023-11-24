import { useTool } from "../../hooks"
import generatorData from "../../utils/generatorData"
import { uid } from "../../utils/uid"
import Selection from '../Selection/index'
import { withModifiers } from 'vue'
import { Timeline, TimelineItem } from 'jetlinks-ui-components'
import DraggableLayout from "./DraggableLayout"
import { omit } from "lodash-es"

export default defineComponent({
    name: 'TimelineLayout',
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

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: 'timeline-item',
                children: [],
                componentProps: {
                    label: '时间轴' + uid(4)
                },
            })
            onAddChild(_item, props.data)
        }

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Timeline {...props.data.componentProps}>
                        {
                            unref(list).map((item: any) => {
                                return <TimelineItem {...omit(item.componentProps, 'label')}>
                                    <p>{...item.componentProps?.label}</p>
                                    <Selection
                                        class={unref(isDragArea) && 'drag-area'}
                                        data={item}
                                        tag="div"
                                        hasCopy={true}
                                        hasDel={unref(list).length > 1}
                                        parent={unref(list)}
                                    >
                                        <DraggableLayout
                                            data-layout-type={'timeline-item'}
                                            data={item?.children || []}
                                            parent={item}
                                        />
                                    </Selection>
                                </TimelineItem>
                            })
                        }
                    </Timeline>
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加时间轴</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})