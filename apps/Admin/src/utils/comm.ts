import dayjs from "dayjs";
import { downloadFileByUrl } from '@jetlinks/utils'
import { message } from 'jetlinks-ui-components';

export const downloadJson = (record: Record<string, any>, fileName: string, format?: string) => {
    const _time = dayjs(new Date()).format(format || 'YYYY_MM_DD')
    const _download = `${fileName || record?.name}-${_time}`
    //字符串内容转成Blob地址
    const blob = new Blob([JSON.stringify(record)]);
    const _url = URL.createObjectURL(blob);
    downloadFileByUrl(_url, _download, 'json')
}

export const onlyMessage = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    message[type]({
      content: msg,
      key: type
    })
}

/**
 * 根据正则处理字母大写
 * @param str
 * @param reg
 */
export const upperCase = (str: string, reg?: RegExp) => {
  const _reg = reg || /[-_](.)/g
  return str.replace(_reg, function(match, char) {
    return char.toUpperCase();
  });
}

/**
 * 判断是否为图片地址
 */
export const isImg = (str: string) => {
  const _reg = /\.(jpg|jpeg|png|gif).*$/i
  return _reg.test(str)
}
