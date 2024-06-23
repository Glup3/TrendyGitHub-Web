import env from './env'
import dayjs from 'dayjs'

export type Timeframe = '24h' | '7d' | '30d'

export type PageStats = {
  pageviews: StatChange
  visitors: StatChange
  visits: StatChange
  bounces: StatChange
  totaltime: StatChange
}

type StatChange = {
  value: number
  change: number
}

export const getPageStats = async (timeframe: Timeframe): Promise<PageStats> => {
  const endAt = dayjs()
  let startAt: dayjs.Dayjs

  switch (timeframe) {
    case '24h':
      startAt = endAt.subtract(24, 'hour')
      break
    case '7d':
      startAt = endAt.subtract(7, 'day')
      break
    case '30d':
      startAt = endAt.subtract(30, 'day')
      break
  }

  const params = new URLSearchParams({
    startAt: startAt.valueOf().toString(),
    endAt: endAt.valueOf().toString(),
  })

  const url = `${env.UMAMI_URL}/api/websites/${env.UMAMI_WEBSITE_ID}/stats?${params.toString()}`
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.UMAMI_TOKEN}`,
    },
  })
  const data = await (resp.json() as Promise<PageStats>)

  return data
}
