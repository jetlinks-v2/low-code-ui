import Selection from '../../Selection'
import {Tabs, Badge, TabPane} from 'jetlinks-ui-components'
import '../index.less'
import {withModifiers} from 'vue'
import {map, omit} from 'lodash-es'
import {useLifeCycle, usePubsub, useTool} from '../../../hooks'
import generatorData from '../../../utils/generatorData'
import {handleDataSourceFn} from "../../../utils/utils";
import Item from './Item'
export default defineComponent({
    name: 'TabsLayout',
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
        const designer: any = inject('PageDesigner')
        const {isEditModel, isDragArea, onAddChild} = useTool()
        const list = computed(() => {
            return props.data?.children || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {
                    name: 'Title'
                },
            })
            onAddChild(_item, props.data)
        }

        const $self = reactive({
            visible: true,
            value: {}
        })

        const setVisible = (flag: boolean) => {
            if(unref(isEditModel)) return
            $self.visible = flag
        }
        const setValue = (_val: any) => {
            if(unref(isEditModel)) return
            $self.value = _val
        }

        const { executionMounted } = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            if (props.data?.componentProps?.responder?.responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', props.data?.componentProps?.responder?.responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)

        handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
            if (_val) {
                $self.value = _val
            }
        })

        onMounted(() => {
            executionMounted()
        })

        const _tabContent = (_element: any) => {
            if (unref(isEditModel)) {
                const _arr = map(_element?.children || [], 'key').filter(i => map(designer.errorKey.value, 'key').includes(i))
                return <div>
                    <Badge count={_arr?.length || 0}>{_element.componentProps?.name}</Badge>
                </div>
            } else {
                return _element.componentProps?.name
            }
        }

        return () => {
            return $self.visible && (
                <Selection {...useAttrs()} hasDel={true} hasCopy={true} hasDrag={true} data={props.data} parent={props.parent}>
                    {
                        unref(list).length ? <Tabs data-layout-type={'tabs'} {...props.data.componentProps}>
                            {
                                unref(list).map((element: any) => {
                                    return <TabPane key={element?.key} {...omit(element?.componentProps, ['name', 'createdCode', 'cssCode', 'mountedCode', 'request'])} tab={_tabContent(element)}>
                                        <Item data={element} parent={unref(list)} />
                                    </TabPane>
                                })
                            }
                        </Tabs> : (unref(isEditModel) ? <div class="draggable-empty">选项卡</div> : <div></div>)
                    }
                    {
                        unref(isEditModel) &&
                        <div class="draggable-add">
                            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>
                                <span>添加选项卡</span></div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
