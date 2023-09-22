import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';

export default defineComponent({
    name: 'GridLayout',
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
        path: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const designer: any = inject('FormDesigner')
        const { isEditModel, isDragArea, layoutPadStyle } = useTool()
        const _width = ref<number>(100)

        const list = computed(() => {
            return props.data?.children || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {
                    span: 1
                }
            })
            designer.onAddChild(_item, props.data)
        }

        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;
            const _span = (props.data.componentProps?.inlineMax || 4)

            if (props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name || ''
            }
            const a = (_width.value - 50) / (50 + (props.data.componentProps?.colSpan || 0)) + 1
            const _number = Math.floor(a) > _span ? _span : Math.floor(a)

            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    <ResizeObserver onResize={({ width }) => {
                        _width.value = width
                    }}>
                        <div
                            data-layout-type={'grid'}
                            {...omit(props.data.componentProps, ['rowSpan', 'colSpan', 'inlineMax'])}
                            style={{
                                display: 'grid',
                                gap: `${props.data.componentProps?.rowSpan}px ${props.data.componentProps?.colSpan}px`,
                                gridTemplateColumns: `repeat(${_number}, 1fr)`,
                            }}
                        >
                            {
                                unref(list).map((element) => {
                                    const a = (element.componentProps?.span || 1)
                                    return (
                                        <div key={element.key} {...omit(element.componentProps, 'span')} style={{ gridColumn: `span ${a > _span ? _span : a} / auto` }}>
                                            <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                hasDel={unref(list).length > 1}
                                                data={element}
                                                style={unref(layoutPadStyle)}
                                                tag="div"
                                                hasCopy={true}
                                                parent={unref(list)}
                                            >
                                                <DraggableLayout
                                                    data={element?.children || []}
                                                    data-layout-type={'item'}
                                                    parent={element}
                                                    path={_path}
                                                    index={_index + 1}
                                                />
                                            </Selection>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            unref(isEditModel) &&
                            <div class="draggable-add">
                                <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加网格列</span></div>
                            </div>
                        }
                    </ResizeObserver>
                </Selection >
            )
        }
    }
})
