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