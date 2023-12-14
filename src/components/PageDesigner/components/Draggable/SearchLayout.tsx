import Selection from '../Selection/index'
import {defineComponent} from 'vue'
import {useTool, useLifeCycle, usePubsub} from '../../hooks'
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

        const $self = reactive({
            visible: true,
            params: {}
        })

        const {executionMounted} = useLifeCycle(props.data.componentProps, {}, isEditModel)

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

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

        const onSearch = (_params: any) => {
            if(unref(isEditModel)) return
            $self.params = _params
        }

        onMounted(() => {
            executionMounted()
        })

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={props.data} parent={props.parent}>
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
