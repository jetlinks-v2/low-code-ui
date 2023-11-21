import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import TitleComponent from '@/components/TitleComponent/index.vue'
import './index.less'
import { withModifiers } from 'vue'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'
import { uid } from '../../utils/uid'
import { Row, Col } from 'jetlinks-ui-components'

export default defineComponent({
    name: 'InfoLayout',
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
        const designer: any = inject('FormDesigner')
        const { isEditModel, isDragArea } = useTool()

        const list = computed(() => {
            return props.data?.children || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [
                    {
                        type: 'info-item-item',
                        children: [],
                        componentProps: {
                            label: '标题1',
                            value: '123'
                        },
                    },
                ],
                componentProps: {
                    title: '标题' + uid(4),
                    span: 3
                },
            })
            designer.onAddChild(_item, props.data)
        }

        const handleAddItem = (item: any) => {
            const _item = generatorData({
                type: item?.type + '-item',
                children: [],
                componentProps: {
                    label: '标题item_' + uid(4),
                    value: '123',
                    span: 1
                },
            })
            designer.onAddChild(_item, item)
        }


        const a = () => {
            if (unref(isEditModel)) {
                return <div class="draggable-empty">描述列表</div>
            } else {
                return <div></div>
            }
        }

        const labelRender = (item, i) => {
            return <Selection
                class={unref(isDragArea) && 'drag-area'}
                data={i}
                tag="div"
                hasCopy={true}
                hasDel={true}
                parent={item?.children || []}
                style={{
                    padding: '20px 10px'
                }}
            >{i.componentProps?.label}</Selection>
        }



        const infoRender = () => {
            if (unref(list).length) {
                return unref(list).map(item => {
                    return <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={item}
                        tag="div"
                        hasCopy={true}
                        hasDel={true}
                        parent={unref(list)}
                        style={{
                            padding: '20px 10px'
                        }}
                    >
                        <div><TitleComponent data={item?.componentProps?.title} /></div>
                        {
                            item?.componentProps?.bordered ? <Row style={{
                                borderLeft: '#e5e5e5 solid 1px'
                            }}>
                                {
                                    item.children.map(i => {
                                        return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span} >
                                            <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                data={i}
                                                tag="div"
                                                hasCopy={true}
                                                hasDel={true}
                                                parent={item.children}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '1px',
                                                    borderTop: '#e5e5e5 solid 1px',
                                                    borderRight: '#e5e5e5 solid 1px',
                                                    borderBottom: '#e5e5e5 solid 1px'
                                                }}
                                            >
                                                <div style={{
                                                    backgroundColor: '#fafafa',
                                                    padding: '16px 24px',
                                                    minWidth: '40%',
                                                    borderRight: '#e5e5e5 solid 1px',
                                                }}>
                                                    {i.componentProps?.label}
                                                </div>
                                                <div style={{ padding: '0 12px' }}>{i.componentProps?.value}</div>
                                            </Selection>
                                        </Col>
                                    })
                                }
                            </Row> :
                                <Row>
                                    {
                                        item.children.map(i => {
                                            return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span} >
                                                <Selection
                                                    class={unref(isDragArea) && 'drag-area'}
                                                    data={i}
                                                    tag="div"
                                                    hasCopy={true}
                                                    hasDel={true}
                                                    parent={item.children}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '1px',
                                                    }}
                                                >
                                                    <div style={{ padding: '16px 24px', minWidth: '40%', }}>{i.componentProps?.label}:</div>
                                                    <div style={{ padding: '0 12px' }}>{i.componentProps?.value}</div>
                                                </Selection>
                                            </Col>
                                        })
                                    }
                                </Row>
                        }

                        {
                            unref(isEditModel) &&
                            <div class="draggable-add">
                                <div class="draggable-add-btn" onClick={withModifiers(() => { handleAddItem(item) }, ['stop'])}><span>添加子项</span></div>
                            </div>
                        }
                    </Selection>
                })
            }
        }

        return () => {
            return (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {infoRender()}
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加列表项</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
