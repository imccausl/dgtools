import { EventsQuery } from './events.js'

it.todo('fetches events and latest event correctly', async () => {
  const query = new EventsQuery({
    query: 'championship',
    latitude: 34.0522,
    longitude: -118.2437,
    searchRadius: 100,
  })

  const events = await query.events()
  expect(Array.isArray(events)).toBe(true)
  expect('length' in events && events.length).toBeGreaterThan(0)

  const latestEvent = await query.latestEvent()
  expect(latestEvent).toBeDefined()
  expect(latestEvent?.name).toContain('championship')
})
