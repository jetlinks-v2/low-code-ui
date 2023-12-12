import Selection from '../../Selection'
import TitleComponent from '@LowCode/components/TitleComponent/index.vue'
import '../index.less'
import {withModifiers} from 'vue'
import {useLifeCycle, usePubsub, useTool} from '../../../hooks'
import generatorData from '../../../utils/generatorData'
import {uid} from '../../../utils/uid'
import {handleDataSourceFn} from "../../../utils/utils";
import {Row, Col} from 'jetlinks-ui-components'
import InfoItem from "./infoItem";

export default defineComponent({
    name: 'InfoItemLayout',
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

        const {executionMounted} = useLifeCycle(props.data.componentProps, {setVisible, setValue}, isEditModel)

        const list = computed(() => {
            return props.data?.children || []
        })

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

        const handleAddItem = (item: any) => {
            const _item = generatorData({
                type: item?.type + '-item',
                children: [
                    {
                        type: item?.type + '-item-item',
                        componentProps: {},
                        children: []
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
        const infoItemRender = (item: any) => {
            const isBordered = item?.componentProps?.bordered
            if (item.children?.length) {
                return <Row>
                    {
                        (item.children || []).map((i: any) => {
                            return <Col span={24 / item?.componentProps?.column * i?.componentProps?.span}>
                                <InfoItem data={i} isBordered={isBordered} parent={item.children} parentData={item} />
                            </Col>
                        })
                    }
                </Row>
            }
            return emptyRender()
        }

        return () => {
            return $self.visible && <Selection
                class={unref(isDragArea) && 'drag-area'}
                data={props.data}
                tag="div"
                hasCopy={false}
                hasDel={true}
                parent={props.parent}
                style={{
                    padding: '20px 10px'
                }}
            >
                {props.data?.componentProps?.titleVisible &&
                    <div><TitleComponent data={props.data?.componentProps?.title}
                                         icon={props.data?.componentProps?.icon}/></div>}
                {infoItemRender(props.data)}
                {
                    unref(isEditModel) &&
                    <div class="draggable-add">
                        <div class="draggable-add-btn" onClick={withModifiers(() => {
                            handleAddItem(props.data)
                        }, ['stop'])}><span>添加子项</span></div>
                    </div>
                }
            </Selection>
        }
    }
})