"use client"

import { useState ,  useRef, useEffect } from "react"
import { Bell, Plus, Pencil, Trash2, Wallet, CreditCard } from "lucide-react"

import {
  useDebts,
  useCreateDebt,
  useUpdateDebt,
  useDeleteDebt
} from "@/lib/api/hooks/useDebts"

type Debt = {
  id: string
  name: string
  dueDate: string
  status: "PENDING" | "PAID" |"OVERDUE"
  amount: number
  type: "owe" | "owed"
  reminder?: boolean
}

export default function DebtPage() {
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  /** API */
  const { data: debts = [] } = useDebts()
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const deleteDebt = useDeleteDebt()

  /** MAP API → UI */
  const mappedDebts: Debt[] = debts.map((d: any) => ({
    id: d.id,
    name: d.peer_name,
    dueDate: d.due_date,
    status:
      d.status === "paid"
        ? "PAID"
        : d.status === "overdue"
        ? "OVERDUE"
        : "PENDING",    
    amount: d.amount,
    type: d.type === "lent" ? "owed" : "owe",
    reminder: d.reminder_enabled
  }))

const reminderNotifications = mappedDebts
  .filter(d => {
    if (!d.reminder) return false

    const today = new Date()
    const due = new Date(d.dueDate)

    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

    return diff <= 1 && d.status !== "PAID"
  })
  .map(d => ({
    message: `${d.name} debt is due ${d.dueDate}`,
    read: false
  }))
  
  /** STATE */
  const [showAdd, setShowAdd] = useState(false)
  const [tab, setTab] = useState<"owe" | "owed">("owe")

  type Notification = {
    message: string
    read: boolean
  }

const notifications = reminderNotifications
const unreadCount = notifications.length
const [showNotif, setShowNotif] = useState(false)

  const [newDebt, setNewDebt] = useState({
    name: "",
    dueDate: "",
    amount: "",
    reminder: false
  })

  const notifRef = useRef<HTMLDivElement | null>(null)

  /** CLICK OUTSIDE */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /** CALCULATIONS */
  const totalLent = mappedDebts
    .filter(d => d.type === "owed")
    .reduce((s, d) => s + d.amount, 0)

  const totalBorrowed = mappedDebts
    .filter(d => d.type === "owe")
    .reduce((s, d) => s + d.amount, 0)

  const peopleOweYou = mappedDebts.filter(d => d.type === "owed").length
  const youOwe = mappedDebts.filter(d => d.type === "owe").length

  const filteredDebts = mappedDebts.filter(d => d.type === tab)

 
  /** ACTIONS */

  function handleDelete(id: string) {
    const person = mappedDebts.find(d => d.id === id)?.name || "Unknown"
    deleteDebt.mutate(id)
  }

  function handleSaveEdit() {
    if (!editingDebt) return

    updateDebt.mutate({
      id: editingDebt.id,
      data: {
        peer_name: editingDebt.name,
        amount: editingDebt.amount,
        due_date: editingDebt.dueDate
      }
    })

    setEditingDebt(null)
  }

  function handleAddDebt() {
    if (!newDebt.name.trim() || !newDebt.amount) return

    const personName = newDebt.name

    createDebt.mutate({
      peer_name: newDebt.name,
      amount: Number(newDebt.amount),
      due_date: newDebt.dueDate,
      type: tab === "owed" ? "lent" : "borrowed",
      reminder_enabled: newDebt.reminder
    })

    setNewDebt({ name: "", dueDate: "", amount: "", reminder: false })
    setShowAdd(false)
  }

  function markAsPaid(id: string) {
    updateDebt.mutate({
      id,
      data: { status: "paid" } as any
    })
  }

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Debt Tracker</h1>
        <p className="text-gray-500 text-sm">
          Keep track of money lent or borrowed between friends
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
              <Wallet size={16} className="text-green-600"/>
            </div>
            <p className="text-gray-500 text-sm">Total Lent</p>
            <h2 className="text-xl font-semibold">${totalLent.toFixed(2)}</h2>
          </div>

          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
            {peopleOweYou} people owe you
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
              <CreditCard size={16} className="text-red-500"/>
            </div>
            <p className="text-gray-500 text-sm">Total Borrowed</p>
            <h2 className="text-xl font-semibold">${totalBorrowed.toFixed(2)}</h2>
          </div>

          <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full">
            You owe {youOwe} people
          </span>
        </div>

      </div>

      {/* TABS + ACTIONS */}
      <div className="flex justify-between items-center">

        <div className="flex gap-6 text-sm">

          <button
            onClick={() => setTab("owe")}
            className={`pb-2 font-medium ${
              tab === "owe"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400"
            }`}
          >
            YOU OWE
          </button>

          <button
            onClick={() => setTab("owed")}
            className={`pb-2 font-medium ${
              tab === "owed"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400"
            }`}
          >
            OWED TO YOU
          </button>

        </div>

        <div className="flex gap-3 items-center">

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(prev => !prev)}
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              <Bell size={16}/>
            </button>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}

            {showNotif && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl p-3 z-50">
                <p className="text-xs text-gray-400 mb-2">Notifications</p>

                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="text-sm py-1 border-b last:border-none">
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#3C12E7] text-white px-4 py-2 rounded-full"
          >
            <Plus size={16}/>
            Add Debt
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {filteredDebts.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">

                <td className="p-4">{d.name}</td>
                <td>{d.dueDate}</td>
                <td>{d.status}</td>
                <td>${d.amount.toFixed(2)}</td>

                <td className="flex gap-4 items-center">
                  <button onClick={() => setEditingDebt(d)}>
                    <Pencil size={16}/>
                  </button>

                  <button onClick={() => handleDelete(d.id)}>
                    <Trash2 size={16}/>
                  </button>

                  <button onClick={() => markAsPaid(d.id)}>
                    ✅
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
{/* ADD MODAL */}
{showAdd && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleAddDebt()
      }}
      className="bg-white w-[420px] rounded-2xl p-6 space-y-5"
    >

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Record New Debt</h2>

        <button
          type="button"
          onClick={() => setShowAdd(false)}
          className="text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* Toggle */}
      <div className="bg-gray-100 rounded-lg flex text-sm p-1">

        <button
          type="button"
          onClick={() => setTab("owe")}
          className={`flex-1 py-1 rounded-md ${
            tab === "owe"
              ? "bg-white shadow text-red-500"
              : "text-gray-500"
          }`}
        >
          I Owe
        </button>

        <button
          type="button"
          onClick={() => setTab("owed")}
          className={`flex-1 py-1 rounded-md ${
            tab === "owed"
              ? "bg-white shadow text-red-500"
              : "text-gray-500"
          }`}
        >
          Owed To Me
        </button>

      </div>

      {/* Person Name */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Persons Name</p>

        <input
          type="text"
          placeholder={tab === "owe" ? "Who is owed?" : "Who owes me?"}
          value={newDebt.name}
          onChange={(e)=>setNewDebt({...newDebt,name:e.target.value})}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#3C12E7]"
        />
      </div>

      {/* Amount */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Total Amount</p>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="$ 0.00"
          value={newDebt.amount}
          onChange={(e)=>setNewDebt({...newDebt,amount:e.target.value})}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#3C12E7]"
        />
      </div>

      {/* Date */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Due Date</p>

        <input
          type="date"
          value={newDebt.dueDate}
          onChange={(e)=>setNewDebt({...newDebt,dueDate:e.target.value})}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#3C12E7]"
        />
      </div>

      {/* Notes */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Notes</p>

        <textarea
          placeholder="Add some details about this debt..."
          className="w-full border rounded-lg p-2 h-20 resize-none outline-none focus:ring-2 focus:ring-[#3C12E7]"
        />
      </div>

      {/* ✅ Reminder (ONLY addition, properly placed) */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newDebt.reminder}
          onChange={(e)=>setNewDebt({...newDebt, reminder:e.target.checked})}
          className="accent-[#3C12E7]"
        />
        <span className="text-sm text-gray-600">Enable Reminder</span>
      </div>

      {/* Add Button */}
      <button
        type="submit"
        className="w-full bg-[#3C12E7] text-white py-2 rounded-lg font-medium shadow-md"
      >
        + Add Debt
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={() => setShowAdd(false)}
        className="w-full text-gray-500 text-sm"
      >
        Cancel
      </button>

    </form>
  </div>
)}
      {/* EDIT MODAL */}
      {editingDebt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveEdit()
            }}
            className="bg-white p-6 rounded-xl w-[400px] space-y-4"
          >

            <input
              value={editingDebt.name}
              onChange={(e)=>setEditingDebt({...editingDebt,name:e.target.value})}
              className="border p-2 w-full rounded"
            />

            <input
              type="date"
              value={editingDebt.dueDate}
              onChange={(e)=>setEditingDebt({...editingDebt,dueDate:e.target.value})}
              className="border p-2 w-full rounded"
            />

            <input
              type="number"
              value={editingDebt.amount}
              onChange={(e)=>setEditingDebt({...editingDebt,amount:Number(e.target.value)})}
              className="border p-2 w-full rounded"
            />

            <div className="flex gap-3">
              <button className="bg-[#3C12E7] text-white px-4 py-2 rounded">
                Save
              </button>

              <button type="button" onClick={()=>setEditingDebt(null)}>
                Cancel
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  )
}