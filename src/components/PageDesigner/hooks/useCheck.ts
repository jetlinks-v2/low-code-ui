import {ISchema} from "../typings";
import useTool from './useTool'
import { useProduct } from '@LowCode/store'
const useCheck = (validateData?: any) => {
    const designer: any = inject('PageDesigner')
    const project = useProduct()
    const { getFormList } = useTool()
    const errorMap = new Map()

    // const noCheckArr = ['root']
    const nameCheckArr = ['text', 'button', 'dropdown', 'tag', 'form', 'steps', 'info', 'timeline', 'card', 'inline', 'tabs']

    const checkedConfigItem = (node: ISchema) => {
        const obj = {
            key: node?.key,
            message: (node?.name || node?.key) + '配置错误'
        }
        const _type = node.type || 'root'
        if (_type === 'root' && node.componentProps?.isPage) {
            if(!node.componentProps?.pageCode || !node.componentProps?.pageName){
                return obj
            }
            const maps = project.getDataMap()
            const arr: any[] = []
            maps.forEach(_value => {
                if(_value?.others?.menu?.main && _value?.id !== designer.data?.id && _value?.others?.menu?.code){
                    arr.push(_value?.others?.menu?.code)
                }
            })
            if(arr.includes(node.componentProps?.pageCode)){
                return obj
            }
        } else {
            if(nameCheckArr.includes(_type) && !node.name) {
                // 校验名称
                return obj
            }
            // 校验text
            if(_type === 'text' && !node.componentProps?.value) {
                return obj
            }
            // 下拉菜单
            if(_type === 'dropdown' && !node.componentProps?.menu?.length) {
                return obj
            }
            // 表单
            if(_type === 'form'){
                if (!(node.componentProps.source.value)) {
                    return obj
                } else {
                    const flag = getFormList.value.find((i) => i.value === node.componentProps?.source?.value)
                    if (!flag) {
                        return obj
                    }
                }
            }
            // 步骤条
            if(_type === 'steps' && !node.componentProps?.action?.length){
                return obj
            }
            if(_type === 'steps-item' && !node.componentProps?.title){
                return obj
            }
            // 描述列表
            if(_type === 'info-item' && !node.componentProps?.labelWidth){
                return obj
            }
            if(_type === 'info-item-item' && (!node.componentProps?.label || !node.componentProps?.span)){
                return obj
            }
            // 搜索框
            if(_type === 'search' && !node.componentProps?.columns?.length){
                return obj
            }
            // 表格
            if(_type === 'proTable' && !node.componentProps?.columns?.length){
                return obj
            }
            // tabs
            if(_type === 'tabs-item' && !node.componentProps?.name){
                return obj
            }
        }
        return false
    }

    const checkConfig = async (node: ISchema) => {
        const _data: any = checkedConfigItem(node);
        if (_data) {
            errorMap.set(node.key, _data)
        }
        if (node.children && node.children?.length) {
            for (let index = 0; index < node?.children?.length; index++) {
                const element = node?.children[index];
                await checkConfig(element)
            }
        }
    }

    const checkedConfig = (node: ISchema) => {
        errorMap.clear()
        return new Promise(async (resolve) => {
            await checkConfig(node)
            resolve([...errorMap.values()])
        })
    }

    // 校验
    const onValidate = async () => {
        return new Promise(async (resolve, reject) => {
            const resp: any = await checkedConfig(validateData || designer.pageData.value);
            if (designer?.errorKey) {
              designer.errorKey.value = resp;
            }
            if (resp?.length) {
                reject(resp);
            } else {
                resolve(true);
            }
        });
    };

    return {
        onValidate
    }
}

export default useCheck
