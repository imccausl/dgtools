import { BASE_URL } from './constants.js'

const ACCOUNT_ENDPOINT = 'account'
const DISC_ENDPOINT = 'disc'

export type AccountResponse = {
  id: string
  accountName: string
  createdAt: string
  accountPath: `/${string}`
}

type Since = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

type Settings = {
  accountPath: `/${string}`
  timezone: string
  smsTemplate: string
  businessName: string
  phone: string
  state: string
  zipCode: string
  city: string
  address: string
  title: string
  accountName: string
  metaDescription: string
  gracePeriodInDays: string
  customInstructions: string
}

type Stats = {
  discsCount: number
  discsActive: number
  discsDeleted: number
  discsReturned: number
  discsSold: number
}

type User = {
  id: string
  email: string
  verified: boolean
  lastActive: string | null
  sessionStart: string | null
}

type AccountActivity = {
  discsCreatedInLastMonth: number
  discsCreatedInLastTwoWeeks: number
}

export type AccountDetailsResponse = {
  primaryEmail: string
  id: number
  accountName: string
  createdAt: string
  lastActive: string
  since: Since
  accountPath: `/${string}`
  settings: Settings
  stats: Stats
  users: User[]
  accountActivity: AccountActivity
  isActive: boolean
}

export type DiscResponse = {
  id: string
  firstName: string
  lastName: string
  phone: string
  pdga: string
  description: string | null
  createdAt: string
  accountId: string
  status: 'active' | 'returned' | 'sold' | 'deleted'
  location: string | null
  notes: string | null
  updatedAt: string
  brand: string | null
  model: string | null
  color: string | null
  plastic: string | null
  lastNotified: string | null
  binLocation: string | null
  smsStatus: 'pending' | 'delivered' | 'failed' | 'no-phone'
  contactStatus: string | null
  contactStatusNotes: string | null
  allowReminder: boolean
  isPastGracePeriod: boolean
  daysLeftToPickup: number
  days: number
  searchField: string
}

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
  return response.json() as Promise<AccountResponse[]>
}

async function fetchAccountDetails(accountId: string) {
  const response = await fetchEndpoint(`${ACCOUNT_ENDPOINT}/${accountId}`)
  return response.json() as Promise<AccountDetailsResponse>
}

async function fetchDiscsDetails(accountId: string) {
  const response = await fetchEndpoint(`${DISC_ENDPOINT}/${accountId}`)
  return response.json() as Promise<DiscResponse[]>
}

export { fetchAccounts, fetchAccountDetails, fetchDiscsDetails }
