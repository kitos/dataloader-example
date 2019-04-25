import { computeProductState, getProducts } from './service'

let asyncFilter = async <T extends {}>(
  arr: T[],
  predicate: (o: T) => Promise<boolean>
) => {
  let results = await Promise.all(arr.map(predicate))

  return arr.filter((_, i) => results[i])
}

export let getAllProducts = async () => {
  let allProducts = await getProducts()

  return asyncFilter(allProducts, async product => {
    let { isBlacklisted } = await computeProductState(product)
    return !isBlacklisted
  })
}
