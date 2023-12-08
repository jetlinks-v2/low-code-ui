import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import {Tabs, TabPane, Badge} from 'jetlinks-ui-components'
import './index.less'
import {withModifiers} from 'vue'
import { map, omit} from 'lodash-es'
import {useLifeCycle, usePubsub, useTool} from '../../hooks'
import generatorData from '../../utils/generatorData'
import {handleDataSourceFn} from "../../utils/utils";

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
            $self.visible = flag
        }
        const setValue = (_val: any) => {
            $self.value = _val
        }

        const { executionMounted } = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

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
                                    return (
                                        <TabPane key={element.key} {...omit(element.componentProps, 'name')}
                                                 tab={_tabContent(element)}>
                                            <Selection
                                                class={unref(isDragArea) && 'drag-area'}
                                                data={element}
                                                tag="div"
                                                hasCopy={false}
                                                hasDel={true}
                                                parent={unref(list)}
                                                style={{
                                                    padding: '20px 10px'
                                                }}
                                            >
                                                <DraggableLayout
                                                    data-layout-type={'tabs-item'}
                                                    data={element.children}
                                                    parent={element}
                                                />
                                            </Selection>
                                        </TabPane>
                                    )
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
