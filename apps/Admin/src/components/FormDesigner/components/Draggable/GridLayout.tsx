import { Row } from 'jetlinks-ui-components'
import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Col } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep } from 'lodash-es'

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
            props.data.context?.appendItem()
            const addData = unref(list).slice(-1)
            designer.setSelection(addData)
        }

        const isEditModel = computed(() => {
            return unref(designer?.model) === 'edit'
        })
        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;
            if(props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name || ''
            }
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    <Row data-layout-type={'grid'} {...props.data.componentProps}>
                        {
                            unref(list).map((element) => {
                                return (
                                    <Col key={element.key} {...element.componentProps}>
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
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>添加网格列</div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
