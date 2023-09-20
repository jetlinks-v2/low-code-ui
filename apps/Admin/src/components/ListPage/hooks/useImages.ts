import { getImage } from '@jetlinks/utils';
import { providerEnum } from '@/components/ProJect';

export const useImages = () => {
  const getImages = computed(() => {
    return (type: string) => {
      let image = ''
      switch(type) {
        case providerEnum.CRUD:
          image = getImage(`/project/curd.png`)
        break;
        case providerEnum.Function:
          image = getImage(`/project/function.png`)
        break;
        case providerEnum.FormPage:
          image = getImage(`/project/form.png`)
        break;
        case providerEnum.SQL:
          image = getImage(`/project/sql.png`)
        break;
        case providerEnum.HtmlPage: 
          image = getImage('/project/html.png')  
        break
      }
      return image
    }
  })
  return {
    getImages
  }
}