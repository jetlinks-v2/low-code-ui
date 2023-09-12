// import { Row, Col } from 'jetlinks-ui-components'
import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { addContext } from '../../utils/addContext'

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
        const list = computed(() => {
            return props.data?.children || []
        })

        const handleAdd = () => {
            if (!props.data?.context) {
                addContext(props.data, props.parent)
            }
            props.data.context?.appendItem()
            designer.setSelection(props.data)
        }

        const isEditModel = computed(() => {
            return unref(designer?.model) === 'edit'
        })

        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;
            if (props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name || ''
            }
            const _span = (props.data.componentProps?.inlineMax || 1)
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    <div
                        data-layout-type={'grid'}
                        {...omit(props.data.componentProps, ['rowSpan', 'colSpan', 'inlineMax'])}
                        style={{
                            display: 'grid',
                            gap: `${props.data.componentProps?.rowSpan}px ${props.data.componentProps?.colSpan}px`,
                            gridTemplateColumns: `repeat(${_span}, 1fr)`
                        }}
                    >
                        {
                            unref(list).map((element) => {
                                const a = (element.componentProps?.span || 1)
                                return (
                                    <div key={element.key} {...omit(element.componentProps, 'span')} style={{ gridColumn: `span ${a} / auto` }}>
                                        <Selection
                                            class={'drag-area'}
                                            hasDel={unref(list).length > 1}
                                            data={element}
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
                </Selection >
            )
        }
    }
})
