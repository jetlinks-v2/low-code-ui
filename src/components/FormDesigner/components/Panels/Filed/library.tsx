
import { filedData } from '../../../utils/defaultData'
import DraggableWrap from '../../Draggable/DraggableWrap'
import { IconWidget } from '../../Icons';
import './index.less';
import { onEnd } from '@LowCode/components/FormDesigner/components/Draggable/ControlInsertionPlugin';
import generatorData from '@LowCode/components/FormDesigner/utils/generatorData';
import { cloneDeep } from 'lodash-es';

const Library = defineComponent({
    name: 'Library',
    inheritAttrs: false,
    setup() {
        const designer: any = inject('FormDesigner')

        const handleClone = (element) => {
            const item = { ...generatorData(element) }
            return cloneDeep(item)
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <div class="filed-item-card-icon">
                            <span style="width: 50px; height: 30px;">{IconWidget(element.type)}</span>
                        </div>
                        <div class="filed-item-card-text">{element.name}</div>
                    </div>
                )
            }
        }

        const options = {
            animation: 150,
            direction: 'horizontal',
            scroll: false,
            sort: false,
            group: { name: "j-canvas", pull: 'clone', put: false },
            ghostClass: 'ghost',
            clone: handleClone
        }

        return () => {
            return (
                <div class="filed-container">
                    {filedData.map((element) => {
                        return (
                            <div key={element.id} class="filed-item">
                                <div class="filed-item-title">{element.name}</div>
                                {
                                    element.children?.length && (
                                        <DraggableWrap
                                            list={element?.children.filter(i => {
                                                return !(designer?.type === 'workflow' && i?.type === 'form')
                                            }) || []}
                                            {...options}
                                            class={"filed-item-children"}
                                            tag={'div'}
                                            v-slots={slots}
                                            item-key="type"
                                            data-layout-type={'filed-item'}
                                            onEnd={(e) => {
                                                onEnd(e, designer)
                                            }}
                                        ></DraggableWrap>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            )
        };
    },
});

export default Library;
