import { BASE_URL } from './constants.js'

const ACCOUNT_ENDPOINT = 'account'
const DISC_ENDPOINT = 'disc'

async function fetchApi(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching API: ${response.statusText}`)
    }
    return response
  } catch (error) {
    throw new Error(`Network error: ${(error as Error).message}`)
  }
}

async function fetchEndpoint(endpoint: string) {
  const url = `${BASE_URL}/${endpoint}`
  const response = await fetchApi(url)
  return response
}

async function fetchAccounts() {
  const response = await fetchEndpoint(ACCOUNT_ENDPOINT)
  if (!response.ok) {
    throw new Error(`Error fetching accounts: ${response.statusText}`)
  }
  return response.json()
}

async function fetchAccountDetails(accountId: string) {
  const response = await fetchEndpoint(`${ACCOUNT_ENDPOINT}/${accountId}`)
  return response.json()
}

async function fetchDiscsDetails(accountId: string) {
  const response = await fetchEndpoint(`${DISC_ENDPOINT}/${accountId}`)
  return response.json()
}

export { fetchAccounts, fetchAccountDetails, fetchDiscsDetails }
