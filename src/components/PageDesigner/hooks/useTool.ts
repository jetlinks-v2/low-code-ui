import {cloneDeep, debounce, omit} from "lodash-es"
import {appendChildItem, copyDataByKey, deleteDataByKey, handleCopyData} from "../utils/utils"
import {Modal} from 'jetlinks-ui-components'
import {uid} from "../utils/uid"
import {usePageDesigner, useProduct} from "@LowCode/store";
import {providerEnum} from "@LowCode/components/ProJect";
import { useRoute, useRouter } from 'vue-router';
import {request as axiosRequest} from '@jetlinks-web/core'
import {usePageProvider} from "./usePageProvider";
import { useMenuStore } from '@LowCode/store'
import * as utils from '@jetlinks-web/utils'
const useTool = () => {
    const designer: any = inject('PageDesigner')
    const delVisible = ref<boolean>(false)
    const product = useProduct();
    const pageDesigner = usePageDesigner();
    const pageProvider = usePageProvider()
    const _noCopyData = ['steps-item', 'info-item', 'info-item-item', 'info-item-item-item', 'timeline-item', 'inline-item', 'card-item', 'tabs-item']
    const { jumpPageByCode } = useMenuStore()

    const paramsUtil = {
        route: useRoute(),
        router: useRouter(),
        axios: axiosRequest,
        jumpPageByCode: jumpPageByCode,
        utils
    }

    const _global = {
        // context: pageProvider.context,
        $refs: pageProvider.$refs,
        pageValue: designer?.pageValue
    }

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return unref(isEditModel)
    })

    const _model = computed(() => {
        return unref(designer?.model)
    })

    /**
     * 保存数据
     */
    const onSaveData = () => {
        let menu = {}
        if (unref(designer.pageData).componentProps.isPage) {
            menu = {
                main: true,
                name: unref(designer.pageData).componentProps?.pageName,
                icon: unref(designer.pageData).componentProps?.pageIcon,
                code: unref(designer.pageData).componentProps?.pageCode,
                hideInMenu: unref(designer.pageData).componentProps?.onlyRouter,
            }
        } else {
            menu = {
                main: false
            }
        }
        const obj = {
            ...unref(designer.data),
            configuration: {
                type: "page-design",
                code: JSON.stringify(unref(designer.pageData)),
            },
            others: {
                ...designer.data.others,
                menu
            }
        };

        product.update(obj);
    };

    // 设置数据被选中
    const setSelection = (node: any) => {
        if (node === 'root') {
            designer.selected.value = [designer.pageData.value]
        } else {
            designer.selected.value = [node]
        }
        onSaveData()
        const arr= ['inline-item', 'card-item', 'timeline-item', 'table-item', 'list-item', 'info-item-item-item']
        designer.isShowConfig.value = !arr.includes(node?.type)
    }

    const setModel = (_type: 'preview' | 'edit') => {
        designer.model.value = _type
    }

    const isSelectedRoot = computed(() => {
        return !!designer.selected.value.find((item: any) => item.key === 'root')
    })

    const onAddChild = (newData: any, parent: any) => {
        const arr = appendChildItem(designer.pageData.value?.children, newData, parent)
        designer.pageData.value = {
            ...designer.pageData.value,
            children: arr || [],
        }
        setSelection(newData || 'root')
    }

    const onDelete = debounce(() => {
        const arr = designer.selected.value || []
        if (!arr?.length) return
        delVisible.value = true
        Modal.confirm({
            title: '确定删除组件及其配置？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                delVisible.value = false
                // 删除数据
                const _data = deleteDataByKey(designer.pageData.value.children, designer.selected.value)
                designer.pageData.value = {
                    ...designer.pageData.value,
                    children: _data?.arr || [],
                }

                designer.dependencies.value = omit(designer.dependencies.value, designer.selected.value.map((item: any) => item.key))

                setSelection(_data?.data || 'root')
            },
            onCancel() {
                delVisible.value = false
            },
        })
    }, 200)

    // 复制
    const onCopy = (id: string) => {
        if (unref(isSelectedRoot) || designer.focused.value) return
        const arr = (cloneDeep(designer.selected.value) || []).filter((item: any) => {
            return !_noCopyData.includes(item.type)
        })
        pageDesigner.setCopyData(id, arr);
    }

    // 剪切
    const onShear = debounce((id: string) => {
        if (unref(isSelectedRoot) || designer.focused.value) return
        const arr = (cloneDeep(designer.selected.value) || []).filter((item: any) => {
            return !_noCopyData.includes(item.type)
        })
        pageDesigner.setCopyData(id, arr);
        const _data: any = deleteDataByKey(designer.pageData.value.children, arr)
        designer.pageData.value = {
            ...designer.pageData.value,
            children: _data?.arr || [],
        }
        setSelection(_data?.data || 'root')
    }, 200)

    // 粘贴
    const onPaste = (id: string) => {
        if (!designer.selected.value?.length || designer.focused.value) return
        const obj = pageDesigner.getCopyData();
        const list = (obj?.list || []).map((item: any) => {
            return {
                ...item,
                key: item.key + '_' + uid(),
                children: handleCopyData(item?.children || []),
                name: obj.key === id
                    ? "copy_" + item?.name
                    : item?.name,
            }
        })
        if (list.length && designer.selected.value?.length) {
            const dt = designer.selected.value?.[designer.selected.value.length - 1]
            designer.pageData.value = {
                ...designer.pageData.value,
                children: dt?.key === 'root' ? [...designer.pageData.value?.children, ...list] : copyDataByKey(designer.pageData.value?.children, list, dt),
            }
            setSelection(list?.[list.length - 1] || 'root')
            pageDesigner.deleteData();
        }
    }

    const getFormList = computed(() => {
        const list = product.getDataMapByType(providerEnum.FormPage);
        //   过滤掉自身
        // const filterList = list.filter((item) => item.id !== designer?.data?.id);
        return list.map((item) => {
            return {
                label: item.title,
                value: item.id,
                code: item.configuration?.code,
            };
        });
    });

    const getPageList = computed(() => {
        const list = product.getDataMapByType(providerEnum.PageDesign);
        //   过滤掉自身
        const filterList = list.filter((item) => item.id !== designer?.data?.id);
        return filterList.map((item) => {
            return {
                label: item.title,
                value: item.id,
                code: item.configuration?.code,
            };
        });
    });

    return {
        _noCopyData,
        paramsUtil,
        _global,
        isEditModel,
        isDragArea,
        _model,
        isSelectedRoot,
        setSelection,
        onDelete,
        onAddChild,
        onCopy,
        onShear,
        onPaste,
        setModel,
        getFormList,
        getPageList,
    }
}

export default useTool
