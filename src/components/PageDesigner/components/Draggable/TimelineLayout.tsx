import {useLifeCycle, usePubsub, useTool} from "../../hooks"
import Selection from '../Selection'
import {Timeline, TimelineItem, Empty} from 'jetlinks-ui-components'
import PagePreview from '@LowCode/components/PageDesigner/preview.vue'
import {omit} from "lodash-es"
import {handleDataSourceFn} from "../../utils/utils";
import {computed} from "vue";
export default defineComponent({
    name: 'TimelineLayout',
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

        const _data = computed(() => {
            return props.data
        })

        const $self = reactive({
            visible: true,
            dataSource: [{label: '2023-12-06', value: ''}]
        })
        const setDataSource = (arr: any[]) => {
            if(unref(isEditModel)) return
            $self.dataSource = arr
        }
        const setVisible = (flag: boolean) => {
            if(unref(isEditModel)) return
            $self.visible = flag
        }

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setDataSource, setVisible}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val && Array.isArray(_val)) {
                $self.dataSource = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        const config = computed(() => {
            return JSON.parse(props.data.componentProps?.source?.code || '{}')
        })

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Timeline {...omit(props.data.componentProps, ['name', 'createdCode', 'cssCode', 'mountedCode', 'request'])}>
                        {
                            $self.dataSource?.length ? $self.dataSource.map((val: any) => {
                                return <TimelineItem {...omit(val, 'label')}>
                                    <p>{val.label}</p>
                                    <PagePreview
                                        pageValue={val}
                                        data={config.value}
                                    />
                                </TimelineItem>
                            }) : <Empty style={{padding: '100px'}} />
                        }
                    </Timeline>
                </Selection>
            )
        }
    }
})