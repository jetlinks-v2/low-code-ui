import { Scrollbar, Empty } from 'jetlinks-ui-components'
import DragGableWrap from '../../Draggable/DragGableWrap'
import { cloneDeep, omit } from 'lodash-es';
import './index.less';
import { onMove, onEnd } from '../../Draggable/ControlInsertionPlugin';
import generatorData from '@/components/FormDesigner/utils/generatorData';
import { Card, AIcon } from 'jetlinks-ui-components';
import { useProduct } from '@/store';
import { uid } from '@/components/FormDesigner/utils/uid';

const Template = defineComponent({
    name: 'Template',
    inheritAttrs: false,
    setup() {
        const designer: any = inject('FormDesigner')
        const product = useProduct()

        const list = computed(() => {
            return product.data?.[0]?.others?.formTemplate || []
        })

        const handleClone = (element) => {
            const item = {
                ...element.template,
                key: `${element.template?.type}_${uid()}_template`
            }
            return cloneDeep(item)
        }

        const handleMove = () => {
            return true
        }

        const dragOptions = {
            dataSource: 'block',
            direction: 'horizontal',
            scroll: false,
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <Card hoverable>
                            <div class="filed-item-card-item">
                                <AIcon type="AppstoreFilled" style={{ fontSize: '25px' }} />
                                <span>{element?.name}</span>
                            </div>
                        </Card>
                    </div>
                )
            }
        }

        return () => {
            return (
                <Scrollbar height={'100%'}>
                    <div class="filed-template">
                        {
                            list.value.length ?
                                <DragGableWrap
                                    list={list.value}
                                    clone={handleClone}
                                    class="filed-item-children"
                                    sort={false}
                                    move={handleMove}
                                    {...dragOptions}
                                    group={
                                        { name: 'j-canvas', pull: 'clone', put: false }
                                    }
                                    model="edit"
                                    item-key="null"
                                    v-slots={slots}
                                    onMove={(e) => {
                                        onMove(e, designer)
                                    }}
                                    onEnd={(e) => {
                                        onEnd(e, designer)
                                    }}
                                    data-layout-type={'filed-item'}
                                ></DragGableWrap>
                                : <Empty style={{ marginTop: '200px' }} />
                        }
                    </div>
                </Scrollbar>
            )
        };
    },
});

export default Template;