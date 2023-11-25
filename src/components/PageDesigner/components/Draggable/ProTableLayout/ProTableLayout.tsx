import { ProTable, Button } from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import { defineComponent } from 'vue'
import { useTool, usePageProvider, usePageDependencies } from '../../../hooks'
import { request as axiosRequest } from '@jetlinks-web/core'

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
        const { isDragArea, isEditModel } = useTool()
        const { dependencies: params } = usePageDependencies(props.data.componentProps?.responder?.dependencies)

        const _data = computed(() => {
            return props.data
        })

        const columns = computed(() => {
            return props.data.componentProps.columns.map(item => {
                if (item.render) {
                    item.scopedSlots = true
                }
                return item
            })
        })

        const dataSource = computed(() => {
            return props.data.componentProps.dataSource
        })

        const columnsSlots = computed(() => {
            return props.data.componentProps.columns?.reduce((prev: Record<string, any>, next) => {
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
                resp.result = handleResultFn.call(this, resp.result)
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

        const headerTitleRender = () => {
            return (
                <Selection {...useAttrs()}>
                    <Button type="dashed" style={{ width: '100px' }}>+</Button>
                </Selection>
            )
        }

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        columns={columns.value}
                        dataSource={dataSource.value}
                        modelValue={'TABLE'}
                        params={params.value}
                        noPagination={noPagination.value}
                        pagination={props.data.componentProps.paginationSetting?.pagination}
                        request={hasRequest.value ? handleRequestFn : undefined}
                        defaultParams={defaultParams.value}
                        v-slots={{
                            headerTitle: headerTitleRender,
                            ...columnsSlots.value
                        }}
                    >
                    </ProTable>

                </Selection>
            )
        }

    }
})
