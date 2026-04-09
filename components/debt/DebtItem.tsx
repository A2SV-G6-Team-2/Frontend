interface Props {
  name: string
  dueDate: string
  status: "PENDING" | "PAID"
  amount: number
}

export default function DebtItem({ name, dueDate, status, amount }: Props) {
  return (
    <tr className="border-b">
      <td className="py-3">{name}</td>
      <td>{dueDate}</td>

      <td>
        <span
          className={
            status === "PAID"
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {status}
        </span>
      </td>

      <td>${amount.toFixed(2)}</td>
    </tr>
  )
}