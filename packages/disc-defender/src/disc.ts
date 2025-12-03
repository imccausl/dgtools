import { findAccounts } from './account.js'
import { type DiscResponse, fetchDiscsDetails } from './api.js'

async function findDiscsByAccountName(accountName: string) {
  const accounts = await findAccounts({ accountName })
  if (accounts?.length === 0) {
    throw new Error(`No account found with name: ${accountName}`)
  }
  return fetchDiscsDetails(accounts[0].id)
}

type DiscFilters = {
  brand?: string | string[]
  model?: string | string[]
  color?: string | string[]
  plastic?: string | string[]
  pdga?: string | string[]
  firstName?: string | string[]
  lastName?: string | string[]
}

function toArray(value?: string | string[]) {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value : [value]
}

function matchesFilter(value: string | null, filter?: string | string[]) {
  const list = toArray(filter)
  if (!list || list.length === 0) return true
  if (value === null) return false
  const lowerValue = value.toLowerCase()
  return list.some((entry) => entry.toLowerCase() === lowerValue)
}

function filterDiscs(discs: DiscResponse[], filters: DiscFilters = {}) {
  return discs.filter((disc) => {
    return (
      matchesFilter(disc.brand, filters.brand) &&
      matchesFilter(disc.model, filters.model) &&
      matchesFilter(disc.color, filters.color) &&
      matchesFilter(disc.plastic, filters.plastic) &&
      matchesFilter(disc.pdga, filters.pdga) &&
      matchesFilter(disc.firstName, filters.firstName) &&
      matchesFilter(disc.lastName, filters.lastName)
    )
  })
}

async function getDiscs(options: { accountName: string } & DiscFilters) {
  const { accountName, ...filters } = options
  const discs = await findDiscsByAccountName(accountName)
  return filterDiscs(discs, filters)
}

export { getDiscs, filterDiscs }
