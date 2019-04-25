import { createClient } from 'redis'
import DataLoader from 'dataloader'

let client = createClient()

// в данном случае, т.к. редис умеет отдавать несколько документов за один запрос, мы не только дедуплицируем запросы:
// т.е. из
//   get(1)
//   get(1)
//   get(1)
//   get(2)
// сделаем
//   get(1)
//   get(2)
//
// но и сбатчим запросы в один
// т.е. из
//   get(1)
//   get(1)
//   get(1)
//   get(2)
// сделаем
//   get([1, 2])
let dataLoader = new DataLoader<string, any>(
  ids =>
    new Promise(resolve => client.mget(ids, (_, result) => resolve(result)))
)

export let getDiscount = (id: string) => dataLoader.load(id)
