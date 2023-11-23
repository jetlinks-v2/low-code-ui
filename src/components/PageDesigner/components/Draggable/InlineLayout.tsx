import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'

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
            return (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {
                        unref(list)?.length ?
                            <div
                                data-layout-type={'inline'}
                                {...props.data.componentProps}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                {
                                    unref(list).map((element: any) => {
                                        return (
                                            <div key={element.key} {...element.componentProps}>
                                                <Selection
                                                    class={unref(isDragArea) && 'drag-area'}
                                                    hasDel={unref(list).length > 1}
                                                    data={element}
                                                    tag="div"
                                                    hasCopy={true}
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
