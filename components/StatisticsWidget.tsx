export const StatisticsWidget = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 p-3 sm:p-4">
      <span>{title}</span>
      <span className="text-nowrap text-2xl sm:text-3xl">{value}</span>
    </div>
  )
}
