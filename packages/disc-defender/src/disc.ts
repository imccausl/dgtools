import { findAccounts } from './account.js'
import { type DiscResponse, fetchDiscsDetails } from './api.js'
import { createQuery } from './queryBuilder.js'

async function findDiscsByAccountName(accountName: string) {
  const accounts = await findAccounts(accountName)
  if (accounts?.length === 0) {
    throw new Error(`No account found with name: ${accountName}`)
  }
  return fetchDiscsDetails(accounts[0].id)
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
] as const

const getDiscsFor = createQuery<DiscResponse, typeof filters, Params>({
  filters,
  queryFn: async (params) => {
    return findDiscsByAccountName(params.accountName)
  },
})

export { getDiscsFor }
