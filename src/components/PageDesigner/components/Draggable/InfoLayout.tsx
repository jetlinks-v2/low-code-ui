import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import TitleComponent from '@LowCode/components/TitleComponent/index.vue'
import './index.less'
import {inject, withModifiers} from 'vue'
import {useLifeCycle, usePageDependencies, usePageProvider, useTool} from '../../hooks'
import generatorData from '../../utils/generatorData'
import { uid } from '../../utils/uid'
import { Row, Col } from 'jetlinks-ui-components'
import {request as axiosRequest} from "@jetlinks-web/core/src/request";
import { cloneDeep } from 'lodash-es'

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
        const { isEditModel, isDragArea, onAddChild } = useTool()
        const designer = inject<any>('PageDesigner')
        const PageProvider = usePageProvider()
        const detailInfo = ref()

        const { executionMounted } = useLifeCycle(props.data.componentProps, {}, isEditModel)

        const defaultParams = () => {
            try {
                return JSON.parse(props.data.componentProps?.request?.defaultParams)
            } catch (e) {
                return undefined
            }
        }

        const handleRequestFn = async () => {
            const { request, handleResult } = props.data.componentProps
            if (request) {
                const paramsData = defaultParams()
                console.log(request)
                try {
                    const resp = await axiosRequest[request.methods](request.query, paramsData)
                    if (handleResult) {
                        const handleResultFn = new Function('result', handleResult)
                        detailInfo.value = handleResultFn.call(this, resp.result)
                    } else {
                        detailInfo.value = resp.result
                    }
                    PageProvider.add?.(props.data.key, detailInfo.value)
                } catch (e) {
                    console.error(e)
                }
            }
        }

        if (!isEditModel.value) {
            handleRequestFn()
        }

        const list = computed(() => {
            return props.data?.children || []
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
                children: [],
                componentProps: {
                    label: '标题item_' + uid(4),
                    value: '123',
                    labelWidth: 200,
                    span: 1
                },
            })
            onAddChild(_item, item)
        }

        const handleBorder = (column: any, span: number, index: Number) => {
            const first = column - span
            if (index <= first) {
                return {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1px',
                    borderTop: '#e5e5e5 solid 1px',
                    borderRight: '#e5e5e5 solid 1px',
                    borderBottom: '#e5e5e5 solid 1px'
                }
            } else {
                return {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1px',
                    borderRight: '#e5e5e5 solid 1px',
                    borderBottom: '#e5e5e5 solid 1px'
                }
            }
        }

        const emptyRender = () => {
            if (unref(isEditModel)) {
                return <div class="draggable-empty">描述列表</div>
            } else {
                return <div></div>
            }
        }

        const borderStyle = (width: number) => {
            return {
                backgroundColor: '#fafafa',
                padding: '16px 24px',
                width: `${width}px`,
                borderRight: '#e5e5e5 solid 1px'
            }
        }

        const infoRender = () => {
            if (unref(list).length) {
                return unref(list).map((item: any) => {
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
                            item.children?.length ? <Row style={{
                                borderLeft: item?.componentProps?.bordered ? '#e5e5e5 solid 1px' : 'none'
                            }}>
                                {   
                                    item.children.map((i: any, index: number) => {
                                        return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span} >
                                            <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                data={i}
                                                tag="div"
                                                hasCopy={true}
                                                hasDel={true}
                                                parent={item.children}
                                            >
                                                <div style={item?.componentProps?.bordered ? handleBorder(item?.componentProps?.column, i?.componentProps?.span, index) : {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>
                                                    <div
                                                        style={item?.componentProps?.bordered ? borderStyle(i?.componentProps?.labelWidth) : { padding: '16px 24px', width: `${i?.componentProps?.labelWidth}px` }}
                                                        class={!item?.componentProps?.bordered && "info-label"}
                                                    >
                                                        {i.componentProps?.label}
                                                    </div>
                                                    <div style={{ padding: '0 12px' }}>
                                                        <DraggableLayout
                                                            data-layout-type={'info-item-item'}
                                                            data={i?.children || []}
                                                            parent={i}
                                                        />
                                                    </div>
                                                </div>
                                            </Selection>
                                        </Col>
                                    })
                                }
                            </Row>
                                : emptyRender()
                        }
                        {
                            unref(isEditModel) &&
                            <div class="draggable-add">
                                <div class="draggable-add-btn" onClick={withModifiers(() => { handleAddItem(item) }, ['stop'])}><span>添加子项</span></div>
                            </div>
                        }
                    </Selection>
                })
            } else {
                return emptyRender()
            }
        }

        
        onMounted(() => {
            executionMounted()
        })

        onBeforeMount(() => {
            if (isEditModel.value) {
                designer.dependencies.value[props.data.key] = props.data.name || props.data.key
            }
        })

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
