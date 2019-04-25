import { readJson } from './resource'
import { getDiscount } from './redis'

interface IProduct {
  id: string
}

export let getProducts = () => readJson<IProduct[]>('../data/products.json')

export let isProductBlacklisted = async (id: string) => {
  let blacklist = await readJson<string[]>('../data/blacklist.json')

  return blacklist.includes(id)
}

export let isProductSpecial = async (id: string) => {
  let special = await readJson<string[]>('../data/special.json')

  return special.includes(id)
}

export let computeProductState = async (
  { id }: IProduct,
  processBlacklisted = true
) => {
  if (!processBlacklisted) {
    return {
      id,
      type: 'product',
      isBlacklisted: await isProductBlacklisted(id)
    }
  }

  let [isSpecial, discount, isBlacklisted] = await Promise.all([
    isProductSpecial(id),
    getDiscount(id), // может падать из-за отсутвия редиса, можно закоментить
    isProductBlacklisted(id)
  ])

  return {
    id,
    type: 'product',
    isBlacklisted,
    isSpecial,
    discount
  }
}
