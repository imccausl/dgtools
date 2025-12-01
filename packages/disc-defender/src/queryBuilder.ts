type QueryBuilderFactoryParams<T> = {
  filters: string[]
  params: Record<string, string>
  queryFn: (params: Record<string, string>) => Promise<T>
}

function createQuery<T>({
  filters,
  params,
  queryFn,
}: QueryBuilderFactoryParams<T>) {
  class QueryBuilder implements PromiseLike<T> {
    [key: `by${string}`]: ((value: string) => this) | undefined
    readonly #filters: Record<string, string> = {}
    readonly #params: Record<string, string>

    constructor(params: Record<string, string>) {
      this.#params = params

      filters.forEach((filter) => {
        this[`by${filter.charAt(0).toUpperCase() + filter.slice(1)}`] = (
          value: string,
        ) => {
          this.#filters[filter] = value
          return this
        }
      })
    }

    async #run() {
      const queryResult = await queryFn(params)
      return queryResult.filter((queryItem) => {
        return Object.entries(this.#filters).every(([key, value]) => {
          if (value === undefined) return true
          const discValue = (queryItem as any)[key]
          if (typeof discValue === 'string') {
            return discValue.toLowerCase() === value.toLowerCase()
          }
          return discValue === value
        })
      })
    }

    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
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

  return QueryBuilder
}

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
