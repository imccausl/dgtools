import { fetchAccountDetails, fetchAccounts } from './api.js'

async function findAccounts(accountName: string | string[]) {
  const accounts = await fetchAccounts()
  const namesToFind = Array.isArray(accountName) ? accountName : [accountName]

  return accounts.filter((account) => namesToFind.includes(account.accountName))
}

async function findAccountDetails(accountName: string) {
  const foundAccounts = await findAccounts(accountName)
  if (foundAccounts?.length === 0) {
    throw new Error(`No account found with name: ${accountName}`)
  }
  const acccountDetailsPromises = foundAccounts.map((account) =>
    fetchAccountDetails(account.id),
  )
  return Promise.all(acccountDetailsPromises)
}

export { findAccounts, findAccountDetails }
