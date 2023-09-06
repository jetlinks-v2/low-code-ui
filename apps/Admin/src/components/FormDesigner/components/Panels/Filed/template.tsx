import { Scrollbar, Empty } from 'jetlinks-ui-components'
import DragGableWrap from '../../Draggable/DragGableWrap'
import { cloneDeep } from 'lodash-es';
import './index.less';
import { onMove, onEnd } from '../../Draggable/ControlInsertionPlugin';
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
            // const arr = element.template.map(item => {
            //     return {
            //         ...item,
            //         key: `${item?.type}_${uid()}_template`
            //     }
            // })
            return cloneDeep({
                ...element.template?.[0],
                key: `${element.template?.[0]?.type}_${uid()}_template`
            })

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
                                    dataSource={'block'}
                                    direction={'horizontal'}
                                    scroll={false}
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