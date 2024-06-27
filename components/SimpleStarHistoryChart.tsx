'use client'

import { Line, LineChart, ResponsiveContainer } from 'recharts'

export const SimpleStarHistoryChart = ({ data }: { data: { starCount: number; date: Date }[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" stroke="#8884d8" dataKey="starCount" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
