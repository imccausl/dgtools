type QueryBuilderFactoryParams<
  Item extends Record<string, unknown>,
  Filters extends readonly string[],
  Params extends Record<string, string>,
> = {
  filters: Filters
  queryFn: (params: Params) => Promise<Item[]>
}

type FilterMethodName<K extends string> = `by${Capitalize<K>}`

type BuilderInstance<Item, FilterKey extends string> = PromiseLike<Item[]> &
  Record<
    FilterMethodName<FilterKey>,
    (value: string) => BuilderInstance<Item, FilterKey>
  >

export function createQuery<
  Item extends Record<string, unknown>,
  Filters extends readonly string[],
  Params extends Record<string, string>,
>({ filters, queryFn }: QueryBuilderFactoryParams<Item, Filters, Params>) {
  type FilterKey = Filters[number] & string
  type BuilderKey = FilterMethodName<FilterKey>
  type Builder = BuilderInstance<Item, FilterKey>

  function build(params: Params): Builder {
    const appliedFilters: Partial<Record<FilterKey, string>> = {}

    const run = async () => {
      const queryResult = await queryFn(params)
      return queryResult.filter((queryItem) => {
        return (
          Object.entries(appliedFilters) as [FilterKey, string | undefined][]
        ).every(([filterKey, filterValue]) => {
          if (filterValue === undefined || filterValue === null) return true
          const value = queryItem[filterKey]
          if (typeof value === 'string') {
            return value.toLowerCase() === filterValue.toLowerCase()
          }
          return value === filterValue
        })
      })
    }

    const builder = {} as Builder

    builder.then = <TResult1 = Item[], TResult2 = never>(
      onfulfilled?:
        | ((value: Item[]) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ) => run().then(onfulfilled, onrejected)

    filters.forEach((filter) => {
      const methodName = `by${filter
        .charAt(0)
        .toUpperCase()}${filter.slice(1)}` as BuilderKey

      builder[methodName] = ((value: string) => {
        appliedFilters[filter as FilterKey] = value
        return builder
      }) as Builder[BuilderKey]
    })

    return builder
  }

  return build
}
