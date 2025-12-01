import { findAccounts } from './account.js'
import { type DiscResponse, fetchDiscsDetails } from './api.js'

async function findDiscsByAccountName(accountName: string) {
  const accounts = await findAccounts(accountName)
  if (accounts?.length === 0) {
    throw new Error(`No account found with name: ${accountName}`)
  }
  return fetchDiscsDetails(accounts[0].id)
}

type DiscFilters = {
  brand?: string
  model?: string
  color?: string
  plastic?: string
  pdgaNumber?: string
  firstName?: string
  lastName?: string
}

type Params = {
  accountName: string
}

const filters = [
  'brand',
  'model',
  'color',
  'plastic',
  'pdgaNumber',
  'firstName',
  'lastName',
]
class DiscQueryBuilder implements PromiseLike<DiscResponse[]> {
  [key: `by${string}`]: ((value: string) => this) | undefined
  readonly #filters: DiscFilters = {}
  readonly #params: Params

  constructor(params: Params) {
    this.#params = params

    filters.forEach((filter) => {
      this[`by${filter.charAt(0).toUpperCase() + filter.slice(1)}`] = (
        value: string,
      ) => {
        this.#filters[filter as keyof DiscFilters] = value
        return this
      }
    })
  }

  async #run() {
    const discs = await findDiscsByAccountName(this.#params.accountName)
    return discs.filter((disc) => {
      return Object.entries(this.#filters).every(([key, value]) => {
        if (value === undefined) return true
        const discValue = (disc as any)[key]
        if (typeof discValue === 'string') {
          return discValue.toLowerCase() === value.toLowerCase()
        }
        return discValue === value
      })
    })
  }

  then<TResult1 = DiscResponse[], TResult2 = never>(
    onfulfilled?:
      | ((value: DiscResponse[]) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.#run().then(onfulfilled, onrejected)
  }
}

function getDiscsFor({ accountName }: Params) {
  return new DiscQueryBuilder({ accountName })
}

export { getDiscsFor }
