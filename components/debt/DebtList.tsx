import DebtItem from "./DebtItem"

export default function DebtList({ debts }: any) {
  return (
    <table className="w-full mt-6">

      <thead>
        <tr className="text-left text-gray-500 border-b">
          <th className="py-3">Name</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        {debts.map((debt: any, i: number) => (
          <DebtItem key={i} {...debt} />
        ))}
      </tbody>

    </table>
  )
}