import { fetchAccountDetails, fetchAccounts } from './api.js'

type AccountFilters = {
  accountName?: string | string[]
  id?: string | string[]
  createdAt?: string | string[]
}

function toArray(value?: string | string[]) {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value : [value]
}

function matchesFilter(value: string, filter?: string | string[]) {
  const list = toArray(filter)
  if (!list || list.length === 0) return true
  return list.includes(value)
}

async function findAccounts(filters: AccountFilters = {}) {
  const accounts = await fetchAccounts()
  return accounts.filter((account) => {
    return (
      matchesFilter(account.accountName, filters.accountName) &&
      matchesFilter(account.id, filters.id) &&
      matchesFilter(account.createdAt, filters.createdAt)
    )
  })
}

async function findAccountDetails(accountName: string) {
  const foundAccounts = await findAccounts({ accountName })
  if (foundAccounts?.length === 0) {
    throw new Error(`No account found with name: ${accountName}`)
  }
  const acccountDetailsPromises = foundAccounts.map((account) =>
    fetchAccountDetails(account.id),
  )
  return Promise.all(acccountDetailsPromises)
}

export { findAccounts, findAccountDetails }
