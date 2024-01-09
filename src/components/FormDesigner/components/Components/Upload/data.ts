import {getImage} from "@jetlinks-web/utils";

export const imgTypeMap = new Map()
imgTypeMap.set('doc', getImage('/form-designer/types/DOC.png'))
imgTypeMap.set('docx', getImage('/form-designer/types/DOC.png'))
imgTypeMap.set('jpg', getImage('/form-designer/types/JPG.png'))
imgTypeMap.set('other', getImage('/form-designer/types/other.png'))
imgTypeMap.set('pdf', getImage('/form-designer/types/PDF.png'))
imgTypeMap.set('png', getImage('/form-designer/types/PNG.png'))
imgTypeMap.set('ppt', getImage('/form-designer/types/PPT.png'))
imgTypeMap.set('rar', getImage('/form-designer/types/RAR.png'))
imgTypeMap.set('xlsx', getImage('/form-designer/types/XLSX.png'))
imgTypeMap.set('zip', getImage('/form-designer/types/ZIP.png'))