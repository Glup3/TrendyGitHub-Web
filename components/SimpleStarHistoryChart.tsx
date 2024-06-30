'use client'

import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

export const SimpleStarHistoryChart = ({ data }: { data: { starCount: number; date: Date }[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} style={{ cursor: 'pointer' }}>
        <YAxis hide={true} scale="pow" />
        <Line type="monotone" dataKey="starCount" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
