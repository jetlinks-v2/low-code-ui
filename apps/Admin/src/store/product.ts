import {defineStore} from "pinia";

export const useProduct = defineStore('product', () => {
  const product = ref([]) // 项目


  const queryProduct = async () => {

  }

  return {
    product,
    queryProduct
  }
})
