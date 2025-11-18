import { getEvents, getLatestEvent } from './events.js'

describe('getEvents', () => {
  it('should parse events from HTML', () => {
    const html = `
      <a class="group flex w-full flex-col items-center gap-2 text-left hover:no-underline md:flex-row md:gap-8 py-8" type="button" href="/events/2025-wdgc-sunday-IRjyLb??quickFilter=league&amp;latitude=42.973550944206856&amp;longitude=-81.24985445182531&amp;searchRadius=80.45&amp;dates=past" data-discover="true"><div class="hidden aspect-[2/1] min-h-[100px] w-full flex-row items-center rounded-2xl bg-center bg-cover p-3 px-4 md:flex md:max-w-[280px]" style="background-image: url(&quot;https://udisc-parse.s3.amazonaws.com/league-cover-photo_efe40bf6-6d35-4092-9059-b12e01c6fba7&quot;);"></div><div class="flex w-full flex-row font-normal text-base"><div class="mt-2 flex w-full flex-col gap-y-1"><div class="flex flex-row items-center justify-between gap-x-2"><div class="flex flex-col font-bold text-text leading-tight"><div>2025 WDGC Sunday</div></div><div class="text-primary self-start whitespace-nowrap">League</div></div><div class="flex space-x-2 text-sm text-subtle md:text-base"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" class="svg-inline--fa fa-location-dot w-[16px] flex-none self-center" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg><div><div class="font-normal leading-tight">Pittock Conservation Area • Woodstock, ON, Canada</div></div></div><div class="flex items-center space-x-2 text-subtle"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock w-[16px] self-center" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg><div class="text-sm text-subtle md:text-base"><time datetime="2025-11-09">Nov 9, 2025</time></div></div><div class="mt-2 flex flex-row justify-between gap-x-2"><div class="h-fit w-fit rounded-full bg-bg-accent1 px-2 py-[2px] font-bold text-link">Sun</div><div class="flex items-center gap-x-2"><div class="flex flex-nowrap items-center gap-x-1"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-arrow" class="svg-inline--fa fa-location-arrow " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"></path></svg><div class="whitespace-nowrap">28 mi</div></div><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></div></div></div></div></a>
      <a class="group flex w-full flex-col items-center gap-2 text-left hover:no-underline md:flex-row md:gap-8 py-8" type="button" href="/events/ldga-weekend-league-ldga-weekend-league-finals-OkaV4J??quickFilter=league&amp;latitude=42.973550944206856&amp;longitude=-81.24985445182531&amp;searchRadius=80.45&amp;dates=past" data-discover="true"><div class="hidden aspect-[2/1] min-h-[100px] w-full flex-row items-center rounded-2xl bg-center bg-cover p-3 px-4 md:flex md:max-w-[280px]" style="background-image: url(&quot;https://udisc-parse.s3.amazonaws.com/league/c_94912f3b-4109-4d4d-916b-ea3ea41aa7fe_98C49DD8-0EF9-43EB-A534-685FFCFDB1B0.jpeg&quot;);"></div><div class="flex w-full flex-row font-normal text-base"><div class="mt-2 flex w-full flex-col gap-y-1"><div class="flex flex-row items-center justify-between gap-x-2"><div class="flex flex-col font-bold text-text leading-tight"><div class="font-normal text-sm text-subtle">LDGA Weekend League</div><div>LDGA Weekend League Finals</div></div><div class="text-primary self-start whitespace-nowrap">League</div></div><div class="flex space-x-2 text-sm text-subtle md:text-base"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" class="svg-inline--fa fa-location-dot w-[16px] flex-none self-center" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg><div><div class="font-normal leading-tight">River's Edge at St. Julien's Park • London, ON, Canada</div></div></div><div class="flex items-center space-x-2 text-subtle"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock w-[16px] self-center" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg><div class="text-sm text-subtle md:text-base"><time datetime="2025-11-08">Nov 8, 2025</time></div></div><div class="mt-2 flex flex-row justify-between gap-x-2"><div class="h-fit w-fit rounded-full bg-bg-accent1 px-2 py-[2px] font-bold text-link">Sat</div><div class="flex items-center gap-x-2"><div class="flex flex-nowrap items-center gap-x-1"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-arrow" class="svg-inline--fa fa-location-arrow " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"></path></svg><div class="whitespace-nowrap">2 mi</div></div><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg></div></div></div></div></a>
    `

    const events = getEvents(html)
    expect(events).toHaveLength(2)
    expect(events).toEqual([
      {
        date: '2025-11-09',
        day: 'sun',
        exportUrl:
          'https://udisc.com/events/2025-wdgc-sunday-IRjyLb/leaderboard/export',
        pageUrl: 'https://udisc.com/events/2025-wdgc-sunday-IRjyLb/leaderboard',
        name: '2025 WDGC Sunday',
        courseName: 'Pittock Conservation Area',
        location: 'Woodstock, ON, Canada',
      },
      {
        date: '2025-11-08',
        day: 'sat',
        exportUrl:
          'https://udisc.com/events/ldga-weekend-league-ldga-weekend-league-finals-OkaV4J/leaderboard/export',
        pageUrl:
          'https://udisc.com/events/ldga-weekend-league-ldga-weekend-league-finals-OkaV4J/leaderboard',
        name: 'LDGA Weekend League Finals',
        courseName: "River's Edge at St. Julien's Park",
        location: 'London, ON, Canada',
      },
    ])
  })
})

describe('getLatestEvent', () => {
  it('should return the latest event', () => {
    const events = [
      {
        name: 'Event 1',
        date: '2023-01-01',
        day: 'sun',
        exportUrl: null,
        pageUrl: null,
        courseName: null,
        location: null,
      },
      {
        name: 'Event 2',
        date: '2023-02-15',
        day: 'wed',
        exportUrl: null,
        pageUrl: null,
        courseName: null,
        location: null,
      },
      {
        name: 'Event 3',
        date: '2022-12-31',
        day: 'sat',
        exportUrl: null,
        pageUrl: null,
        courseName: null,
        location: null,
      },
    ]

    const latestEvent = getLatestEvent(events)
    expect(latestEvent).toEqual(events[1])
  })

  it('should return null for empty event list', () => {
    const latestEvent = getLatestEvent([])
    expect(latestEvent).toBeNull()
  })
})
