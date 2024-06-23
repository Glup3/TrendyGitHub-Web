export const StatisticsWidget = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2 border-2 p-3 sm:p-4 rounded-xl">
      <span>{title}</span>
      <span className="text-2xl sm:text-3xl text-nowrap">{value}</span>
    </div>
  )
}
