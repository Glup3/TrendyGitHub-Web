'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import dayjs from 'dayjs'
import Image from 'next/image'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  count: {
    label: 'Stars',
  },
} satisfies ChartConfig

export function StarLineChart(props: {
  lineColor: string
  repositoryName: string
  data: { date: Date; count: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="mb-6 flex items-center gap-2">
            <Image
              src={`https://github.com/${props.repositoryName.split('/')[0]}.png`}
              alt={`GitHub User Logo ${props.repositoryName}`}
              width="0"
              height="0"
              className="size-8 rounded"
              unoptimized
            />

            <a
              href={`https://github.com/${props.repositoryName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-semibold text-primary hover:underline"
            >
              <h3 className="text-2xl font-bold">{props.repositoryName}</h3>
            </a>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={props.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) => dayjs(date as unknown as Date).format('MMM YYYY')}
            />
            <YAxis dataKey="count" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={true}
              content={({ payload, label }) => {
                return (
                  <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{dayjs(label as unknown as Date).format('MMM D, YYYY')}</div>

                    <div className="grid gap-1.5">
                      <div className="flex w-full items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground">
                        <div
                          className={`h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]`}
                          style={
                            { '--color-border': props.lineColor, '--color-bg': props.lineColor } as React.CSSProperties
                          }
                        />
                        <div className={'flex flex-1 items-center justify-between leading-none'}>
                          <div className="grid gap-1.5">
                            <span className="text-muted-foreground">Stars</span>
                          </div>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {payload?.[0]?.value?.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Line dataKey="count" type="natural" stroke={props.lineColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
