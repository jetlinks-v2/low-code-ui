
export const form = {
    "formId": "268e7cc324fc55719d0c7e1796ac0e0e",
    "formName": "lqc——多选测试",
    "multiple": true,
    "provider": "custom",
    "configuration": {
        "type": "root",
        "key": "root",
        "componentProps": {
            "layout": "horizontal",
            "size": "default",
            "cssCode": "",
            "eventCode": ""
        },
        "children": [
            {
                "type": "product",
                "name": "产品选择",
                "key": "product_1ut6hh4jrlq",
                "formItemProps": {
                    "label": "产品选择",
                    "required": false,
                    "rules": [],
                    "name": "product_s91ux0bot11"
                },
                "componentProps": {
                    "style": {
                        "width": "100%"
                    },
                    "cssCode": "",
                    "onChange": "",
                    "disabled": false,
                    "description": "",
                    "keys": [
                        {
                            "key": "id",
                            "config": {
                                "projectId": "test20231101",
                                "functionId": "d8bwWyMsQwbJeGd5",
                                "commandId": "QueryList",
                                "source": "id"
                            },
                            "flag": true
                        },
                        {
                            "key": "name",
                            "config": {
                                "projectId": "test20231101",
                                "functionId": "d8bwWyMsQwbJeGd5",
                                "commandId": "QueryList",
                                "source": "devName"
                            }
                        }
                    ],
                    "visible": true,
                    "editable": true,
                    "mode": "multiple"
                }
            }
        ]
    },
    "data": [
        {
            "formId": "268e7cc324fc55719d0c7e1796ac0e0e",
            "data": [
                {
                    "id": "WouPPaccJXYhqo4Mxeh5ZN9YxlQldMX6",
                    "product_s91ux0bot11": [
                        {
                            "id": "1718835178914160640",
                            "devName": "1030场景联动测试产品A"
                        },
                        {
                            "id": "1717816057695682560",
                            "devName": "1027测试产品broker_C"
                        }
                    ]
                }
            ]
        }
    ]
}

//获取高级组件的source-key的对应关系
const fromItem = (prams: any) => {
    const obj = {}
    prams.configuration?.forEach(item => {
        const keyObj = {}
        if (item.componentProps.keys) {
            item.componentProps.keys.forEach(i => {
                // keyObj[i.key] = i.source
                keyObj[i.config.source] = i.key

            })
        }
        obj[item.formItemProps.name] = {
            type: item.type,
            mode:item.mode,
            // keys: item?.keys.map(i=>i.),
            keysMap: keyObj
        }
    });
    return obj
}

export const handleForm = (obj: any, form: any) => {
    // const componentType = ['product']
    console.log('handleForm==============', obj)
    // let res
    const formObj = fromItem(form)
    const map = new Map(Object.entries(obj))
    Object.keys(formObj).forEach((item: any) => {
        if (map.has(item)) {
            const keysMap = formObj[item].keysMap
             map.get(item)?.forEach(i => {
                for (const e in keysMap) {
                 
                    i[keysMap[e]] = i[e]
                    if(e !== keysMap[e]){
                        delete i[e]
                    }
                    // delete i[e]
                }
                return i
            })
        }
    })
    return obj
}
 
export const handleFormList = (form: any) => {
    return form.data.map(item => {
        const obj = {
            ...item,
           data: item.data.map(e=>handleForm(e,form))
        }
        return obj
    })
}
// data为可编辑表格单行数据 map：fromItem函数处理的source-key关系对象
export const handleData = (data,map)=>{
    Object.keys(map).forEach(item=>{
        Object.keys(map[item].keysMap).forEach(i=>{
            Object.keys(data).forEach(e=>{
                if(e === i){
                    let obj = {}
                    obj[map[item].keysMap[i]] = data[i]
                    if(data[item]){
                        data[item] = {
                            ...data[item],
                            ...obj
                        }
                    }else{
                        data[item] = obj
                    }
                    delete data[i]
                }
            })
        })
    })
    return data
}

export const handleSingleData = (form: any) =>{
    const  formObj = fromItem(form)
    return form.data.map((item=>{
        // const obj = item.data.map(i=>handleData(i,formObj))
        const obj = handleData(item,formObj)
        return obj
    }))
}

