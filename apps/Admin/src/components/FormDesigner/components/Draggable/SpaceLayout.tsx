import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Space } from 'jetlinks-ui-components'
import './index.less'
import { cloneDeep } from 'lodash-es'
import { withModifiers } from 'vue'

export default defineComponent({
    name: 'SpaceLayout',
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
        const isEditModel = computed(() => {
            return unref(designer?.model) === 'edit'
        })

        return () => {
            const _path = cloneDeep(props?.path || []);

            const _index = props?.index || 0;

            if (props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name
            }

            const handleAdd = () => {
                props.data.context?.appendItem()
                const addData = unref(list).slice(-1)
                designer.setSelection(addData)
            }
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDrag={true} hasDel={true} hasCopy={true} data={props.data} parent={props.parent}>
                    {
                        unref(list).length ? <Space data-layout-type={'space'} {...props.data.componentProps}>
                            {
                                unref(list).map((element) => {
                                    return (
                                        <div key={element.key} {...element.componentProps}>
                                            <Selection
                                                class={'drag-area'}
                                                data={element}
                                                tag="div"
                                                hasCopy={true}
                                                hasDel={true}
                                                parent={unref(list)}
                                            >
                                                <DraggableLayout
                                                    data-layout-type={'space-item'}
                                                    data={element.children}
                                                    parent={element}
                                                    path={_path}
                                                    index={_index + 1}
                                                />
                                            </Selection>
                                        </div>
                                    )
                                })
                            }
                        </Space> : (unref(isEditModel) ? <div class="draggable-empty">弹性间距</div> : <div></div>)
                    }
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加数据</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
