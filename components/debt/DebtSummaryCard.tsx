interface Props {
  title: string
  amount: number
}

export default function DebtSummaryCard({ title, amount }: Props) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">${amount.toFixed(2)}</h2>
    </div>
  )
}