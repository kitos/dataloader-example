import { join } from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import DataLoader from 'dataloader'

let readF = promisify(readFile)

let dataLoader = new DataLoader<string, any>(paths =>
  Promise.all(paths.map(_readJson))
)

export let readJson = <T extends {}>(path: string) =>
  dataLoader.load(path) as Promise<T>

export let _readJson = async <T extends {}>(relativePath: string) => {
  let path = join(__dirname, relativePath)
  let json = await readF(path)

  console.log('access to file')

  return JSON.parse(json.toString()) as T
}
