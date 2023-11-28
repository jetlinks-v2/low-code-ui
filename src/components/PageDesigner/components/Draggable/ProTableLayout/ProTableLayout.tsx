import { ProTable } from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import { defineComponent, withModifiers } from 'vue'
import {useTool, usePageDependencies, usePageProvider} from '../../../hooks'
import { request as axiosRequest } from '@jetlinks-web/core'
import DraggableLayout from '../DraggableLayout'
import generatorData from '@LowCode/components/PageDesigner/utils/generatorData'
import '../index.less'

export default defineComponent({
    name: 'ProTableLayout',
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
        const { isDragArea, isEditModel, onAddChild } = useTool()
        const pageProvider = usePageProvider()
        const { dependencies: params } = usePageDependencies(props.data.componentProps?.responder?.dependencies)
        const route = useRoute()
        const tableRef = ref()

        const _data = computed(() => {
            return props.data
        })

        const handleAdd = (type: 'table-item-header' | 'table-item-actions') => {
            const _item = generatorData({
                type,
                children: [],
                componentProps: {},
            })
            onAddChild(_item, props.data)
        }

        const buttonRender = (_type: 'table-item-header' | 'table-item-actions') => {
            const headerChildren = (unref(_data)?.children || []).filter((item: any) => {
                return item?.type === _type
            })?.[0]
            if (headerChildren) {
                return (
                    <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={headerChildren}
                        tag="div"
                        hasCopy={false}
                        hasDel={true}
                        parent={unref(_data)}
                    >
                        <DraggableLayout
                            data-layout-type={_type}
                            data={headerChildren?.children || []}
                            parent={headerChildren}
                        />
                    </Selection>
                )
            } else {
                if (unref(isEditModel)) {
                    return <div class="draggable-add">
                        <div class="draggable-add-btn" onClick={withModifiers(() => {
                            handleAdd(_type)
                        }, ['stop'])}><span>添加操作按钮</span>
                        </div>
                    </div>
                }
            }
        }

        const columns = computed(() => {
            const arr = props.data.componentProps.columns.map((item: any) => {
                if (item.render) {
                    item.scopedSlots = true
                }
                return item
            })
            if (props.data.componentProps?.actionVisible) {
                arr.push({
                    title: '操作',
                    dataIndex: 'jetlinks_actions',
                    scopedSlots: true,
                    width: props.data.componentProps?.actionWidth || 200,
                    render: () => {
                        return buttonRender('table-item-actions')
                    }
                })
            }
            return arr
        })

        const dataSource = computed(() => {
            return props.data.componentProps.dataSource
        })

        const columnsSlots = computed(() => {
            return columns.value?.reduce((prev: Record<string, any>, next) => {
                if (next.render) {
                    prev[next.dataIndex] = next.render
                }
                return prev
            }, {}) || {}
        })

        const noPagination = computed(() => {
            return !props.data.componentProps.paginationSetting?.open
        })

        const hasRequest = computed(() => {
            const { request } = props.data.componentProps
            return !!request?.query && !isEditModel.value
        })

        const handleRequestFn = async (paramsData: any) => {
            const { request, handleResult } = props.data.componentProps
            const resp = await axiosRequest.post(request.query, paramsData)
            if (handleResult) {
                const handleResultFn = new Function('result', handleResult)
                resp.result = handleResultFn(resp.result)
            }
            return resp
        }

        const defaultParams = computed(() => {
            try {
                return JSON.parse(props.data.componentProps?.request?.defaultParams)
            } catch (e) {
                return undefined
            }
        })

        const onCreatedFn = (code?: string) => {
            if (code && !isEditModel.value) {
                const context = {
                    context: pageProvider.context,
                    axios: axiosRequest,
                    route: route,
                    refs: {
                        tableRef
                    }
                }
                const fn = new Function('context', code)
                fn(context)
            }
        }

        onCreatedFn(props.data.componentProps?.onCreated)

        onMounted(() => {
            onCreatedFn(props.data.componentProps?.onCreated)
        })

        return () => {

            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        ref={tableRef}
                        columns={columns.value}
                        dataSource={dataSource.value}
                        modelValue={props.data?.componentProps?.model || 'TABLE'}
                        params={params.value}
                        noPagination={noPagination.value}
                        pagination={props.data.componentProps.paginationSetting?.pagination}
                        request={hasRequest.value ? handleRequestFn : undefined}
                        defaultParams={defaultParams.value}
                        v-slots={{
                            headerTitle: buttonRender('table-item-header'),
                            ...columnsSlots.value
                        }}
                    >
                    </ProTable>
                </Selection>
            )
        }

    }
})
