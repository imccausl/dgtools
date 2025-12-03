# @dgtools/disc-defender

Lightweight client for the Disc Defender API. It fetches public Disc Defender account and disc data and gives you a small query builder to filter discs in-process.

## Installation

```bash
npm install @dgtools/disc-defender
# or
yarn add @dgtools/disc-defender
```

Requires a runtime with `fetch` available (Node 18+, modern browsers).

## Quick start

```ts
import {
  findAccounts,
  findAccountDetails,
  getDiscs,
} from '@dgtools/disc-defender'

// Find matching accounts by name
const accounts = await findAccounts({ accountName: 'maple hill' })

// Fetch full details for every matching account
const details = await findAccountDetails('maple hill')

// Fetch discs for the first matching account and filter in-memory
const discs = await getDiscs({
  accountName: 'maple hill',
  brand: 'Innova',
  color: 'Pink',
})
```

## API

All functions are async and hit `https://discdefender.com/api`.

- `findAccounts(filters?: { accountName?: string | string[]; id?: string | string[]; createdAt?: string | string[] }) => Promise<AccountResponse[]>`
  - Returns account summaries that match all provided fields (exact match; arrays allow multiple acceptable values).
- `findAccountDetails(accountName: string) => Promise<AccountDetailsResponse[]>`
  - Looks up matching accounts, then fetches full details for each. Throws if no account is found.
- `getDiscs(options: { accountName: string } & { brand?: string | string[]; model?: string | string[]; color?: string | string[]; plastic?: string | string[]; pdga?: string | string[]; firstName?: string | string[]; lastName?: string | string[] }) => Promise<DiscResponse[]>`
  - Fetches discs for the first matching account and filters in-memory. String matches are case-insensitive; filters accept single values or arrays.

### Types

Type definitions ship with the package. Key shapes:

- `AccountResponse`: `{ id, accountName, createdAt, accountPath }`
- `AccountDetailsResponse`: includes contact info, settings, stats, user list, and activity metrics.
- `DiscResponse`: disc metadata such as owner name, PDGA, status, color/brand/model/plastic, notes, and timestamps.

## Error handling

- Network failures or non-2xx responses throw an error.
- `findAccountDetails` and `getDiscs` throw if no account matches the provided name.

## Development

- Build: `yarn workspace @dgtools/disc-defender build`
- Tests: `yarn workspace @dgtools/disc-defender test`
