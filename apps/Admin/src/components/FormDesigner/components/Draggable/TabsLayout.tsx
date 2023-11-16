import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Tabs, TabPane, FormItem, Badge } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep, map, omit } from 'lodash-es'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'

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
                    name: 'Title'
                },
                formItemProps: {
                    // name: props.data?.type + '-item' + '_' + uid(6),
                    isLayout: false
                }
            })
            designer.onAddChild(_item, props.data)
        }

        const _formItemProps = computed(() => {
            return props.data?.formItemProps
        })

        const _isLayout = computed(() => {
            return props.data?.formItemProps.isLayout
        })

        return () => {
            let _path = cloneDeep(props?.path || []);
            let _index: number = props?.index || 0;
            if (props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name
            }

            const _tabContent = (_element: any) => {
                if (unref(isEditModel)) {
                    const _arr = map(_element?.children || [], 'key').filter(i => map(designer.errorKey.value, 'key').includes(i))
                    return <div>
                        <Badge count={_arr?.length || 0}>{_element.componentProps?.name}</Badge>
                    </div>
                } else {
                    return _element.componentProps?.name
                }
            }

            const renderContent = () => {
                return <>
                    {
                        unref(list).length ? <Tabs data-layout-type={'tabs'} {...props.data.componentProps}>
                            {
                                unref(list).map((element) => {
                                    if (element.formItemProps?.name) {
                                        _path = [..._path, element.formItemProps?.name]
                                        _index = _index + 1
                                    }
                                    return (
                                        <TabPane key={element.key} {...omit(element.componentProps, 'name')} tab={_tabContent(element)}>
                                            <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                data={element}
                                                tag="div"
                                                hasCopy={true}
                                                hasDel={true}
                                                parent={unref(list)}
                                                style={{
                                                    padding: '20px 10px'
                                                }}
                                            >
                                                <DraggableLayout
                                                    data-layout-type={'tabs-item'}
                                                    data={element.children}
                                                    parent={element}
                                                    path={_path}
                                                    index={unref(_isLayout) ? _index + 1 : _index}
                                                    visible={props.visible}
                                                    editable={props.editable}
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
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加选项卡</span></div>
                        </div>
                    }
                </>
            }

            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {
                        unref(_isLayout) ?
                            <FormItem {...unref(_formItemProps)} validateFirst={true}>
                                {renderContent()}
                            </FormItem>
                            : renderContent()
                    }
                </Selection>
            )
        }
    }
})
