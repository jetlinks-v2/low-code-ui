import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
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
        path: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        visible: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const designer: any = inject('FormDesigner')
        const { isEditModel, isDragArea, layoutPadStyle } = useTool()

        const list = computed(() => {
            return props.data?.children || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {
                    span: 1
                },
                formItemProps: {
                    isLayout: false
                },
            })
            designer.onAddChild(_item, props.data)
        }

        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;

            if (props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name || ''
            }

            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    <div
                        data-layout-type={'inline'}
                        {...props.data.componentProps}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {
                            unref(list).map((element: any) => {
                                return (
                                    <div key={element.key} {...omit(element.componentProps, 'span')}>
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
                                                index={_index}
                                                visible={props.visible}
                                                editable={props.editable}
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
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加内联项</span></div>
                        </div>
                    }
                </Selection >
            )
        }
    }
})
