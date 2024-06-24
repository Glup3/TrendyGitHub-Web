'use client'

import React from 'react'
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const StarDistributionChart = ({ data }: { data: { name: string; count: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} margin={{ right: 5, left: 5, bottom: 20 }}>
        <XAxis dataKey="name" reversed={true}>
          <Label value="Stars Range" position="bottom" />
        </XAxis>
        <YAxis dataKey="count" />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="count" fill="#8884d8">
          <LabelList dataKey="count" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
