import type { Query } from '../constants/query.js'

function buildQueryParams(params: Query) {
  const queryParams = new URLSearchParams()

  if (params.query) {
    queryParams.append('query', params.query)
  }

  if (params.latitude !== undefined) {
    queryParams.append('latitude', params.latitude.toString())
  }

  if (params.longitude !== undefined) {
    queryParams.append('longitude', params.longitude.toString())
  }

  if (params.searchRadius !== undefined) {
    queryParams.append('searchRadius', params.searchRadius.toString())
  }

  if (params.quickFilter) {
    queryParams.append('quickFilter', params.quickFilter)
  }

  if (params.type) {
    for (const type of params.type) {
      queryParams.append('type', type)
    }
  }

  if (params.tag) {
    for (const tag of params.tag) {
      queryParams.append('tag', tag)
    }
  }

  if (params.handicapScoring) {
    queryParams.append('handicapScoring', '1')
  }

  if (params.dates) {
    queryParams.append('dates', params.dates)
  }
  if (params.dateDuration) {
    queryParams.append('dateDuration', params.dateDuration)
  }
  if (params.endsOnOrAfter) {
    queryParams.append('endsOnOrAfter', params.endsOnOrAfter)
  }
  if (params.startsOnOrBefore) {
    queryParams.append('startsOnOrBefore', params.startsOnOrBefore)
  }

  return queryParams.toString()
}

export { buildQueryParams }
