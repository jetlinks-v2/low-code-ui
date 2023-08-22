import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Tabs, TabPane } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep } from 'lodash-es'

export default defineComponent({
    name: 'TabsLayout',
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
                _path[_index] = props.data.formItemProps.name
            }
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDel={true} hasCopy={true} hasDrag={true} hasAdd={true} data={props.data} parent={props.parent}>
                    {
                        unref(list).length ? <Tabs data-layout-type={'tabs'} {...props.data.componentProps}>
                            {
                                unref(list).map((element) => {
                                    return (
                                        <TabPane key={element.key} {...element.componentProps}>
                                            <Selection
                                                class={'drag-area'}
                                                data={element}
                                                tag="div"
                                                hasCopy={true}
                                                hasDel={true}
                                                parent={unref(list)}
                                            >
                                                <DraggableLayout
                                                    data-layout-type={'tabs-item'}
                                                    data={element.children}
                                                    parent={element}
                                                    path={_path}
                                                    index={_index + 1}
                                                />
                                            </Selection>
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs> : (unref(isEditModel) ? <div class="draggable-empty">选项卡</div> : <div></div>)
                    }
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>添加选项卡</div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
