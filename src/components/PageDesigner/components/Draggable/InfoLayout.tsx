import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import TitleComponent from '@LowCode/components/TitleComponent/index.vue'
import './index.less'
import {withModifiers} from 'vue'
import {useLifeCycle, usePubsub, useTool} from '../../hooks'
import generatorData from '../../utils/generatorData'
import {uid} from '../../utils/uid'
import {Row, Col} from 'jetlinks-ui-components'
import {handleDataSourceFn} from "../../utils/utils";

export default defineComponent({
    name: 'InfoLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => {
            }
        },
        parent: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const {isEditModel, isDragArea, onAddChild} = useTool()

        const $self = reactive({
            visible: true,
            value: {}
        })

        const setVisible = (flag: boolean) => {
            $self.visible = flag
        }
        const setValue = (_val: any) => {
            $self.value = _val
        }

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const list = computed(() => {
            return props.data?.children || []
        })

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val) {
                $self.value = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        // 计算列表组件行自动铺满
        // const dealCol = () =>{
        //     list.value?.map(((item:any)=>{
        //         let preTotal = 0
        //         let total = 0
        //         let changeMap = new Map()
        //         if(item?.children?.length){
        //             item.children.map((i:any,index:number)=>{
        //                 if(total + 24 / item?.componentProps?.column * i?.componentProps?.span >24){
        //                     changeMap.set(index-1,(24 - preTotal)/24 * item?.componentProps?.column)
        //                     preTotal = 0
        //                     total = 24 / item?.componentProps?.column * i?.componentProps?.span
        //                 }else if(index == item.children.length-1){
        //                     console.log(123)
        //                     changeMap.set(index,(24 - preTotal)/24 * item?.componentProps?.column)
        //                 }else{
        //                     preTotal = total
        //                     total += 24 / item?.componentProps?.column * i?.componentProps?.span
        //                     if(total == 24){
        //                         preTotal = 0
        //                         total = 0
        //                     }
        //                 }
        //             })
        //         }
        //         console.log(changeMap,'map')
        //         changeMap.forEach((value:any,key:number)=>{
        //             item.children[key].componentProps.span = value
        //         })
        //     }))
        // }
        // dealCol()
        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {
                    title: '标题' + uid(4),
                    bordered: true,
                    column: 3
                },
            })
            onAddChild(_item, props.data)
        }

        const handleAddItem = (item: any) => {
            const _item = generatorData({
                type: item?.type + '-item',
                children: [
                    {
                        type: item?.type + '-item-item',
                        componentProps: {},
                        children: []
                    }
                ],
                componentProps: {
                    label: '标题item_' + uid(4),
                    value: '123',
                    labelWidth: 200,
                    span: 1
                },
            })
            onAddChild(_item, item)
        }

        const emptyRender = () => {
            if (unref(isEditModel)) {
                return <div class="draggable-empty">描述列表</div>
            } else {
                return <div></div>
            }
        }

        const infoItemRender = (item: any) => {
            const isBordered = item?.componentProps?.bordered
            if (item.children?.length) {
                return <Row>
                    {
                        (item.children || []).map((i: any) => {
                            return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span}>
                                <Selection
                                    class={unref(isDragArea) && 'drag-area'}
                                    data={i}
                                    tag="div"
                                    hasCopy={false}
                                    hasDel={true}
                                    parent={item.children}
                                >
                                    <div style={{
                                        display: 'flex',
                                        minHeight: '40px',
                                        border: isBordered ? '#e5e5e5 solid 1px' : 'none',
                                        marginTop: '-1px',
                                        marginRight: '-1px'
                                    }}>
                                        <div
                                            style={{
                                                width: (item?.componentProps?.labelWidth || 200) + 'px',
                                                backgroundColor: isBordered ? '#fafafa' : '#fff',
                                                borderRight: isBordered ? '#e5e5e5 solid 1px' : 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '16px 24px'
                                            }}
                                            class={!isBordered && "info-label"}>
                                            <span>{i.componentProps?.label}</span>
                                        </div>
                                        <div style={{flex: 1, padding: '16px 24px'}}>
                                            {
                                                (i.children || []).map((_item: any) => {
                                                    return <Selection
                                                        class={unref(isDragArea) && 'drag-area'}
                                                        data={_item}
                                                        tag="div"
                                                        hasCopy={false}
                                                        hasDel={true}
                                                        parent={_item.children}
                                                    >
                                                        <DraggableLayout
                                                            data-layout-type={'info-item-item-item'}
                                                            data={_item?.children || []}
                                                            parent={_item}
                                                        />
                                                    </Selection>
                                                })
                                            }
                                        </div>
                                    </div>
                                </Selection>
                            </Col>
                        })
                    }
                </Row>
            }
            return emptyRender()
        }

        const infoRender = () => {
            if (unref(list).length) {
                return unref(list).map((item: any) => {
                    return <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={item}
                        tag="div"
                        hasCopy={false}
                        hasDel={true}
                        parent={unref(list)}
                        style={{
                            padding: '20px 10px'
                        }}
                    >
                        {item?.componentProps?.titleVisible && <div><TitleComponent data={item?.componentProps?.title} icon={item?.componentProps?.icon}/></div>}
                        {infoItemRender(item)}
                        {
                            unref(isEditModel) &&
                            <div class="draggable-add">
                                <div class="draggable-add-btn" onClick={withModifiers(() => {
                                    handleAddItem(item)
                                }, ['stop'])}><span>添加子项</span></div>
                            </div>
                        }
                    </Selection>
                })
            } else {
                return emptyRender()
            }
        }

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {infoRender()}
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>
                                <span>添加列表项</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})