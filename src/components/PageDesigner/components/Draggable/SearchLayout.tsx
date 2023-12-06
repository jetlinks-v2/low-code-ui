import Selection from '../Selection/index'
import {defineComponent, inject} from 'vue'
import {useTool, usePageProvider, useLifeCycle} from '../../hooks'
import Search from '../../../Search/Search.vue'
import {request as axiosRequest} from "@jetlinks-web/core/src/request";
import {queryDictionaryData} from "@LowCode/api/form";
import {_getData} from "@LowCode/components/PageDesigner/utils/utils";

export default defineComponent({
    name: 'ProTableLayout',
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
        const {isEditModel} = useTool()
        const {executionMounted} = useLifeCycle(props.data.componentProps, {}, isEditModel)
        const PageProvider = usePageProvider()
        const designer = inject<any>('PageDesigner')

        const _data = computed(() => {
            return props.data
        })

        const columns = computed(() => {
            return (props.data.componentProps.columns || [])?.map((item: any) => {
                const obj = {
                    dataIndex: item.dataIndex,
                    title: item.title,
                }
                let _options: any = undefined
                if (['select', 'treeSelect'].includes(item.search?.type)) {
                    if (item.search?.options?.type === 'dynamic') {
                        _options = () =>
                            new Promise(async (resolve) => {
                                const {query, handleResult, defaultParams, methods} = item.search?.options?.optionsData || {}
                                const resp = await axiosRequest?.[methods || 'post'](query, JSON.parse(defaultParams || '{}'))
                                if (handleResult) {
                                    const handleResultFn = new Function('result', handleResult)
                                    resolve(handleResultFn(resp))
                                }
                                resolve(resp)
                            })
                    } else if(item.search?.options?.type === 'dic'){
                        _options = () =>
                            new Promise(async (resolve) => {
                                const resp = await queryDictionaryData(item.search?.options?.dictionary)
                                resolve(_getData(resp?.result || []))
                            })
                    } else {
                        _options = JSON.parse(item.search?.options?.optionsJson || '[]')
                    }
                }
                return {
                    ...obj,
                    search: {
                        type: item?.search?.type || 'input',
                        options: _options
                    }
                }
            })
        })

        const onSearch = (params: any) => {
            PageProvider.add?.(props.data.key, params)
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
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)}
                           parent={props.parent}>
                    <Search
                        columns={columns.value}
                        onSearch={onSearch}
                        target={props.data?.key}
                    />
                </Selection>
            )
        }

    }
})
