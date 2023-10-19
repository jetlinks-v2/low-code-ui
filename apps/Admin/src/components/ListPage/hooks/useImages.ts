import { getImage } from '@jetlinks/utils';
import { providerEnum } from '@/components/ProJect';

export const useImages = () => {
  const getImages = computed(() => {
    return (type: string) => {
      let image = ''
      switch(type) {
        case providerEnum.CRUD:
          image = getImage(`/project/curd.svg`)
        break;
        case providerEnum.Function:
          image = getImage(`/project/function.svg`)
        break;
        case providerEnum.FormPage:
          image = getImage(`/project/form.svg`)
        break;
        case providerEnum.SQL:
          image = getImage(`/project/sql.svg`)
        break;
        case providerEnum.HtmlPage: 
          image = getImage('/project/html.svg')  
        break
      }
      return image
    }
  })
  return {
    getImages
  }
}