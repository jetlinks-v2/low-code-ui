import {useLifeCycle, usePubsub, useTool} from "../../hooks"
import Selection from '../Selection/index'
import PagePreview from '@LowCode/components/PageDesigner/preview.vue'
import {handleDataSourceFn} from "../../utils/utils";
import {Empty} from 'jetlinks-ui-components'
import {computed} from "vue";

export default defineComponent({
    name: 'ListLayout',
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
            dataSource: [{}]
        })
        const setDataSource = (arr: any[]) => {
            if (unref(isEditModel)) return
            $self.dataSource = arr
        }
        const setVisible = (flag: boolean) => {
            if (unref(isEditModel)) return
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
                    <div>
                        {
                            $self.dataSource?.length ?
                                $self.dataSource.map((item) => {
                                    return <div>
                                        <PagePreview
                                            pageValue={item}
                                            data={config.value}
                                        />
                                    </div>
                                }) :
                                <Empty style={{padding: '100px'}}/>
                        }
                    </div>
                </Selection>
            )
        }
    }
})