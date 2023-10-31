import { insertNodeAt, insertNodesAt, removeNode, removeNodes } from "./util/htmlHelper";
import {
    getComponentAttributes,
    createSortableOption,
    getValidSortableEntries
} from "./core/componentBuilderHelper";
import { computeComponentStructure } from "./core/renderHelper";
import { events } from "./core/sortableEvents";
import { h, defineComponent, nextTick } from "vue";
import { MultiDrag, Sortable } from "sortablejs";

Sortable.mount(new MultiDrag());

function emit(evtName, evtData) {
    nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}

function manage(evtName) {
    return (evtData, originalElement) => {
        if (this.realList !== null) {
            return this[`onDrag${evtName}`](evtData, originalElement);
        }
    };
}

function manageAndEmit(evtName) {
    const delegateCallBack = manage.call(this, evtName);
    return (evtData, originalElement) => {
        delegateCallBack.call(this, evtData, originalElement);
        emit.call(this, evtName, evtData);
    };
}

let draggingElement: any[] = [];

const draggable = defineComponent({
    name: "draggable",
    inheritAttrs: false,
    props: {
        list: {
            type: Array,
            required: false, // 传入的数据
            default: null
        },
        modelValue: {
            type: Array,
            required: false, // 双向绑定
            default: null
        },
        itemKey: {
            type: [String, Function],
            required: true // item的key
        },
        clone: {
            type: Function, // 复制后的数据
            default: original => {
                return original;
            }
        },
        tag: {
            type: String, // Sortable的tag
            default: "div"
        },
        move: {
            type: Function, // 
            default: null
        },
        componentData: { // 
            type: Object,
            required: false,
            default: null
        }
    },
    emits: [
        "update:modelValue", // 双向绑定
        "change", // 
        ...[...events.manageAndEmit, ...events.emit].map(evt => evt.toLowerCase())
    ],
    data() {
        return {
            error: false,
            context: []
        };
    },
    created() {
        // list和modelValue只能传入一个人
        if (this.list !== null && this.modelValue !== null) {
            console.error(
                "modelValue and list props are mutually exclusive! Please set one or another."
            );
        }
    },
    mounted() {
        if (this.error) {
            return;
        }
        // $attrs: 一个包含了组件所有透传 attributes 的对象。
        // attributes: 是指由父组件传入，且没有被子组件声明为 props 或是组件自定义事件的 attributes 和事件处理函数。
        const { $attrs, $el, componentStructure } = this;
        // $el: 该组件实例管理的 DOM 根节点。
        componentStructure?.updated();

        const sortableOptions = createSortableOption({
            $attrs,
            callBackBuilder: {
                manageAndEmit: event => manageAndEmit.call(this, event),
                emit: event => emit.bind(this, event),
                manage: event => manage.call(this, event)
            }
        });
        const targetDomElement = $el.nodeType === 1 ? $el : $el.parentElement;
        this._sortable = new Sortable(targetDomElement, sortableOptions); // 初始化
        this.targetDomElement = targetDomElement; // 挂载的dom
        targetDomElement.__draggable_component__ = this;
    },
    updated() { // 在组件因为一个响应式状态变更而更新其 DOM 树之后调用
        this.componentStructure?.updated();
    },
    beforeUnmount() {
        if (this._sortable !== undefined) this._sortable.destroy();
    },
    computed: {
        realList() { // 实际的list
            const { list } = this;
            return list ? list : this.modelValue;
        },
        getKey() { // 获取key
            const { itemKey } = this;
            if (typeof itemKey === "function") {
                return itemKey;
            }
            return element => element[itemKey];
        }
    },

    watch: {
        $attrs: {
            handler(newOptionValue) {
                const { _sortable } = this;
                if (!_sortable) return;
                getValidSortableEntries(newOptionValue).forEach(([key, value]) => {
                    _sortable.option(key, value);
                });
            },
            deep: true
        }
    },

    methods: {
        getUnderlyingVm(domElement) { // 获取真实值和下标
            return this?.componentStructure?.getUnderlyingVm(domElement) || null;
        },

        getUnderlyingPotencialDraggableComponent(htmElement) {
            return htmElement.__draggable_component__;
        },

        emitChanges(evt) {
            nextTick(() => this.$emit("change", evt));
        },

        alterList(onList) {
            if (this.list) { // 处理list
                onList(this.list);
                return;
            }
            // 处理modelValue
            const newList = [...this.modelValue];
            onList(newList);
            this.$emit("update:modelValue", newList);
        },

        spliceList() {
            const _list = list => list.splice(...arguments);
            this.alterList(_list);
        },

        updatePosition(oldIndex, newIndex) {
            const updatePosition = list =>
                list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
            this.alterList(updatePosition);
        },

        getRelatedContextFromMoveEvent({ to, related }) {
            const component = this.getUnderlyingPotencialDraggableComponent(to);
            if (!component) {
                return { component };
            }
            const list = component.realList;
            const context = { list, component };
            if (to !== related && list) {
                const destination = component.getUnderlyingVm(related) || {};
                return { ...destination, ...context };
            }
            return context;
        },

        getVmIndexFromDomIndex(domIndex) {
            return this.componentStructure.getVmIndexFromDomIndex(
                domIndex,
                this.targetDomElement
            );
        },

        onDragStart(evt) { // 开始拖拽
            this.context = []
            const _items = evt.items?.length ? evt.items : [evt.item]
            const _data = _items.map(item => {
                const _context: any = this.getUnderlyingVm(item)
                this.context.push(_context)
                item._underlying_vm_ = this.clone(_context.element);
                return item
            })
            if (evt.items?.length) {
                evt.items = _data
            } else {
                evt.item = _data?.[0]
            }
            draggingElement = _items
        },

        onDragAdd(evt) { // 元素从另一个列表中拖放到列表中
            const element = evt.item?._underlying_vm_;
            if (element === undefined) {
                return;
            }
            removeNode(evt.item); // 删除该节点
            const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
            // @ts-ignore
            this.spliceList(newIndex, 0, element); // 添加数据
            const added = { element, newIndex };
            this.emitChanges({ added }); // 抛出数据
        },

        onDragRemove(evt) { // 元素从列表中移除到另一个列表中：clone不移除
            insertNodeAt(this.$el, evt.item, evt.oldIndex);
            if (evt.pullMode === "clone") {
                removeNode(evt.clone); // 删除拖拽过来的那个element
                return;
            }
            const { index: oldIndex, element } = this.context?.[0];
            // @ts-ignore
            this.spliceList(oldIndex, 1);
            const removed = { element, oldIndex };
            this.emitChanges({ removed });
        },

        onDragUpdate(evt) { // 更改列表内的排序
            if (evt.items?.length) { // 多选
                // 删除原来的节点
                removeNodes(evt.items)
                insertNodesAt(evt.from, evt.oldIndicies, evt.newIndicies); // 插入到新位置
                evt.items.forEach((_, _index) => {
                    const oldIndex = this.context?.[_index]?.index;
                    const newIndex = this.getVmIndexFromDomIndex(evt.newIndicies?.[_index]?.index);
                    this.updatePosition(oldIndex, newIndex);
                    const moved = { element: this.context?.[_index]?.element, oldIndex, newIndex };
                    this.emitChanges({ moved });
                })
            } else {
                removeNode(evt.item); // 删除原来的节点
                insertNodeAt(evt.from, evt.item, evt.oldIndex); // 插入到新位置
                const oldIndex = this.context?.[0].index;
                const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
                this.updatePosition(oldIndex, newIndex);
                const moved = { element: this.context?.[0]?.element, oldIndex, newIndex };
                this.emitChanges({ moved });
            }
        },

        computeFutureIndex(relatedContext, evt) {
            if (!relatedContext.element) {
                return 0;
            }
            const domChildren = [...evt.to.children].filter(
                el => el.style["display"] !== "none"
            );
            const currentDomIndex = domChildren.indexOf(evt.related);
            const currentIndex = relatedContext.component.getVmIndexFromDomIndex(
                currentDomIndex
            );
            const draggedInList = domChildren.indexOf(draggingElement) !== -1;
            return draggedInList || !evt.willInsertAfter
                ? currentIndex
                : currentIndex + 1;
        },

        onDragMove(evt, originalEvent) {
            const { move, realList } = this;
            if (!move || !realList) {
                return true;
            }

            const relatedContext = this.getRelatedContextFromMoveEvent(evt);
            const futureIndex = this.computeFutureIndex(relatedContext, evt);
            const draggedContext = {
                ...this.context,
                futureIndex
            };
            const sendEvent = {
                ...evt,
                relatedContext,
                draggedContext
            };
            return move(sendEvent, originalEvent);
        },

        onDragEnd() {
            draggingElement = [];
        }
    },
    render() {
        try {
            this.error = false;
            //  $slots: 一个表示父组件所传入插槽的对象。
            const { $slots, $attrs, tag, componentData, realList, getKey } = this;
            const componentStructure = computeComponentStructure({
                $slots,
                tag,
                realList,
                getKey
            });
            this.componentStructure = componentStructure;
            const attributes = getComponentAttributes({ $attrs, componentData });
            return componentStructure.render(h, attributes);
        } catch (err: any) {
            this.error = true;
            return h("pre", { style: { color: "red" } }, err.stack);
        }
    }
});

export default draggable



