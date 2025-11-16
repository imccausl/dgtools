const EventTypes = {
  LEAGUE: 'league',
  CLINIC: 'clinic',
  CLEANUP: 'clean-up',
  NON_DG: 'non-dg',
} as const

const TagTypes = {
  GLOW: 'glow-round',
  ACE_POOL: 'ace-pool',
  CHARITY: 'charity',
  FEMALE_FRIENDLY: 'female-friendly',
  BEGINNER_FRIENDLY: 'beginner-friendly',
  JUNIOR_FRIENDLY: 'junior-friendly',
  BAG_TAGS: 'bag-tags',
} as const

const QuickFilters = {
  ALL: 'all',
  MY_EVENTS: 'my-events',
  TRENDING: 'trending',
  TOURNAMENT: 'tournament',
  LEAGUE: 'league',
  PDGA: 'pdga',
  CLEANUP: 'course-cleanup',
  GLOW: 'glow',
  CLINICS: 'clinics',
  WOMENS: 'women',
  CHARITY: 'charity',
} as const

type QuickFilters = (typeof QuickFilters)[keyof typeof QuickFilters]
type EventTypes = (typeof EventTypes)[keyof typeof EventTypes]
type TagTypes = (typeof TagTypes)[keyof typeof TagTypes]

// https://udisc.com/events?quickFilter=all&query=LDGA&latitude=42.973710821002705&longitude=-81.25013211646032&searchRadius=80.45&type=league&dates=custom&endsOnOrAfter=2025-11-08&startsOnOrBefore=2025-12-10
type BaseQuery = {
  query?: string
  latitude?: number
  longitude?: number
  searchRadius?: number
  quickFilter?: QuickFilters
  type?: EventTypes[]
  tag?: TagTypes[]
  handicapScoring?: boolean
  // 'upcoming' is implied by absence of dates
  // if dates is 'custom', dateDuration is not present
  // but endsOnOrAfter and startsOnOrBefore are required
  dates?: 'custom' | 'past'
  // 'all' is implied by absence of dateDuration
  // dateDuration is not present if dates is 'custom'
  dateDuration?: 'day' | 'week' | 'month'
  endsOnOrAfter?: string
  startsOnOrBefore?: string
}

type CustomDateQuery = BaseQuery & {
  dates: 'custom'
  endsOnOrAfter: string
  startsOnOrBefore: string
  dateDuration?: never
}

export type Query = BaseQuery | CustomDateQuery

export { QuickFilters, EventTypes, TagTypes }
