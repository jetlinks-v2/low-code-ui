import { omit } from "lodash-es"

const useProps = (element: any) => {
  const _componentProps: any = {
    ...omit(element?.componentProps, ['cssCode',]),
  }

  if (element.type === 'search') {
    _componentProps.target = element?.key
  }

  return {
    ...element,
    componentProps: _componentProps
  }
}

export default useProps
