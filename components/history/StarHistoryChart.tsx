'use client'

import dayjs from 'dayjs'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ChartData = {
  date: number
  repo: number
}

export const StarHistoryChart = ({ data }: { data: ChartData[]; repoName: string }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={(v) => dayjs(v as unknown as number).format('MMM D, YYYY')} angle={280} />
        <YAxis />
        <Tooltip
          content={(props) => {
            return (
              <div className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
                <p>{props.payload?.[0]?.value?.toLocaleString('en-US')} stars</p>
                {dayjs(props.label as unknown as number).format('MMM D, YYYY')}
              </div>
            )
          }}
        />

        <Line dataKey="repo" type="monotone" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
