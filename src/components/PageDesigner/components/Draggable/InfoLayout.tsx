import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import TitleComponent from '@LowCode/components/TitleComponent/index.vue'
import './index.less'
import {inject, withModifiers} from 'vue'
import {useLifeCycle, usePageDependencies, usePageProvider, useTool} from '../../hooks'
import generatorData from '../../utils/generatorData'
import {uid} from '../../utils/uid'
import {Row, Col} from 'jetlinks-ui-components'
import {request as axiosRequest} from "@jetlinks-web/core/src/request";
import {map, sum, ceil, cloneDeep} from "lodash-es";

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
        const designer = inject<any>('PageDesigner')
        const PageProvider = usePageProvider()
        const detailInfo = ref()

        const {executionMounted} = useLifeCycle(props.data.componentProps, {}, isEditModel)

        const defaultParams = () => {
            try {
                return JSON.parse(props.data.componentProps?.request?.defaultParams)
            } catch (e) {
                return undefined
            }
        }

        const handleRequestFn = async () => {
            const {request, handleResult} = props.data.componentProps
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
                        componentProps: {}
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

        // const getChildren = (arr: any[], column: number) => {
        //     const list = cloneDeep(arr)
        //     list.forEach((item, index) => {
        //         if (item.componentProps.span > column) {
        //             item.componentProps.span = column
        //         } else {
        //             const _sum = sum(map(arr.slice(0, index + 1), 'componentProps.span'))
        //             const _ceil = ceil(_sum / column)
        //             const _nextSpan = arr?.[index + 1]?.componentProps?.span
        //             if((_ceil*column - _sum < _nextSpan && _ceil*column - _sum !== 0) || !_nextSpan) {
        //                 item.componentProps.span = _ceil*column - _sum + item.componentProps.span
        //             }
        //         }
        //     })
        //     return list
        // }

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
                                    hasCopy={true}
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
                                                        hasCopy={true}
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
                        hasCopy={true}
                        hasDel={true}
                        parent={unref(list)}
                        style={{
                            padding: '20px 10px'
                        }}
                    >
                        <div><TitleComponent data={item?.componentProps?.title}/></div>
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


        onMounted(() => {
            executionMounted()
        })

        onBeforeMount(() => {
            if (isEditModel) {
                designer.dependencies.value[props.data.key] = props.data.name || props.data.key
            }
        })

        return () => {
            return (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data}
                           parent={props.parent}>
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


{/*{*/
}
{/*    item.children?.length ? <Row style={{*/
}
{/*        borderLeft: item?.componentProps?.bordered ? '#e5e5e5 solid 1px' : 'none'*/
}
{/*    }}>*/
}
{/*        {*/
}
{/*            item.children.map((i: any, index: number) => {*/
}
{/*                return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span} >*/
}
{/*                    <Selection*/
}
{/*                        class={unref(isDragArea) && 'drag-area'}*/
}
{/*                        data={i}*/
}
{/*                        tag="div"*/
}
{/*                        hasCopy={true}*/
}
{/*                        hasDel={true}*/
}
{/*                        parent={item.children}*/
}
{/*                    >*/
}
{/*                        <div style={item?.componentProps?.bordered ? handleBorder(item?.componentProps?.column, i?.componentProps?.span, index) : {*/
}
{/*                            display: 'flex',*/
}
{/*                            alignItems: 'center',*/
}
{/*                        }}>*/
}
{/*                            <div*/
}
{/*                                style={item?.componentProps?.bordered ? borderStyle(i?.componentProps?.labelWidth) : { padding: '16px 24px', width: `${i?.componentProps?.labelWidth}px` }}*/
}
{/*                                class={!item?.componentProps?.bordered && "info-label"}*/
}
{/*                            >*/
}
{/*                                {i.componentProps?.label}*/
}
{/*                            </div>*/
}
{/*                            <Selection data={i} tag="div" class={unref(isDragArea) && 'drag-area'}>*/
}
{/*                                <DraggableLayout*/
}
{/*                                    data-layout-type={'info-item-item-item'}*/
}
{/*                                    data={i?.children || []}*/
}
{/*                                    parent={i}*/
}
{/*                                />*/
}
{/*                            </Selection>*/
}
{/*                        </div>*/
}
{/*                    </Selection>*/
}
{/*                </Col>*/
}
{/*            })*/
}
{/*        }*/
}
{/*    </Row>*/
}
{/*        : emptyRender()*/
}
{/*}*/
}
