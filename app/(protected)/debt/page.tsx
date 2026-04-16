"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Wallet, CreditCard, Check } from "lucide-react"

import {
  useDebts,
  useCreateDebt,
  useUpdateDebt,
  useMarkDebtPaid,
} from "@/lib/api/hooks/useDebts"
import { useProfile } from "@/lib/api/hooks/useUser"

const PAGE_SIZE = 7

function toDateInputValue(value: string) {
  if (!value) return ""
  if (value.includes("T")) return value.slice(0, 10)
  return value.length >= 10 ? value.slice(0, 10) : value
}

function getCurrencySymbol(currencyCode: string) {
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).formatToParts(0)
    return parts.find((p) => p.type === "currency")?.value ?? currencyCode
  } catch {
    return currencyCode
  }
}

type Debt = {
  id: string
  name: string
  dueDate: string
  status: "PENDING" | "PAID" |"OVERDUE"
  amount: number
  type: "owe" | "owed"
}

export default function DebtPage() {
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [actionError, setActionError] = useState("")
  const [page, setPage] = useState(1)

  /** API */
  const { data: profile } = useProfile()
  const currencyCode = profile?.default_currency ?? "USD"
  const currencySymbol = getCurrencySymbol(currencyCode)
  const { data: debts = [] } = useDebts()
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const markDebtPaid = useMarkDebtPaid()

  /** MAP API → UI */
  const mappedDebts: Debt[] = debts.map((d: any) => ({
    id: d.id,
    name: d.peer_name,
    dueDate: toDateInputValue(String(d.due_date ?? "")),
    status:
      d.status === "paid"
        ? "PAID"
        : d.status === "overdue"
        ? "OVERDUE"
        : "PENDING",    
    amount: d.amount,
    type: d.type === "lent" ? "owed" : "owe",
  }))

  /** STATE */
  const [showAdd, setShowAdd] = useState(false)
  const [tab, setTab] = useState<"owe" | "owed">("owe")

  const [newDebt, setNewDebt] = useState({
    name: "",
    dueDate: "",
    amount: "",
  })

  /** CALCULATIONS */
  const totalLent = mappedDebts
    .filter((d) => d.type === "owed" && d.status !== "PAID")
    .reduce((s, d) => s + d.amount, 0)

  const totalBorrowed = mappedDebts
    .filter((d) => d.type === "owe" && d.status !== "PAID")
    .reduce((s, d) => s + d.amount, 0)

  const peopleOweYou = mappedDebts.filter((d) => d.type === "owed" && d.status !== "PAID").length
  const youOwe = mappedDebts.filter((d) => d.type === "owe" && d.status !== "PAID").length

  const filteredDebts = mappedDebts.filter((d) => d.type === tab)
  const totalPages = Math.max(1, Math.ceil(filteredDebts.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredDebts.slice(start, start + PAGE_SIZE)
  }, [filteredDebts, safePage])
  const rangeStart = filteredDebts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filteredDebts.length)

 
  /** ACTIONS */

  async function handleSaveEdit() {
    if (!editingDebt) return
    if (!editingDebt.name.trim()) {
      setActionError("Name is required.")
      return
    }
    if (!editingDebt.dueDate) {
      setActionError("Due date is required.")
      return
    }
    if (!editingDebt.amount || editingDebt.amount <= 0) {
      setActionError("Amount must be greater than zero.")
      return
    }

    try {
      setActionError("")
      await updateDebt.mutateAsync({
        id: editingDebt.id,
        data: {
          type: editingDebt.type === "owed" ? "lent" : "borrowed",
          peer_name: editingDebt.name.trim(),
          amount: Number(editingDebt.amount),
          due_date: toDateInputValue(editingDebt.dueDate),
          reminder_enabled: false,
        }
      })

      setEditingDebt(null)
    } catch (error: any) {
      const message = error?.response?.data?.errors?.[0] || error?.response?.data?.message || "Could not update debt."
      setActionError(message)
    }
  }

  function handleOpenEdit(debt: Debt) {
    setActionError("")
    setEditingDebt({
      ...debt,
      dueDate: toDateInputValue(debt.dueDate),
      amount: Number(debt.amount),
      name: debt.name ?? "",
    })
  }

  function handleCloseEdit() {
    setActionError("")
    setEditingDebt(null)
  }

  function handleCloseAdd() {
    setActionError("")
    setShowAdd(false)
  }

  function handleAddDebt() {
    if (!newDebt.name.trim() || !newDebt.amount || !newDebt.dueDate) return

    setActionError("")
    createDebt.mutate({
      peer_name: newDebt.name,
      amount: Number(newDebt.amount),
      due_date: toDateInputValue(newDebt.dueDate),
      type: tab === "owed" ? "lent" : "borrowed",
      reminder_enabled: false,
    }, {
      onSuccess: () => {
        setNewDebt({ name: "", dueDate: "", amount: "" })
        setShowAdd(false)
      },
      onError: (error: any) => {
        const message = error?.response?.data?.errors?.[0] || error?.response?.data?.message || "Could not create debt."
        setActionError(message)
      }
    })
  }

  async function handleMarkPaid(id: string) {
    try {
      setActionError("")
      await markDebtPaid.mutateAsync(id)
    } catch (error: any) {
      const message = error?.response?.data?.errors?.[0] || error?.response?.data?.message || "Could not mark debt as paid."
      setActionError(message)
    }
  }

  return (
    <div className="pt-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Debt Tracker</h1>
        <p className="mt-1 text-secondary text-sm">
          Keep track of money lent or borrowed between friends
        </p>
      </div>

      {/* CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
              <Wallet size={16} className="text-green-600"/>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
              {peopleOweYou} people owe you
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Total Lent</p>
            <h2 className="text-2xl font-bold text-gray-900">${totalLent.toFixed(2)}</h2>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
              <CreditCard size={16} className="text-red-500"/>
            </div>
            <span className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full">
              You owe {youOwe} people
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Total Borrowed</p>
            <h2 className="text-2xl font-bold text-gray-900">${totalBorrowed.toFixed(2)}</h2>
          </div>
        </div>

      </div>

      {/* TABS + ACTIONS */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">

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
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent/95"
          >
            <Plus size={16}/>
            Add Debt
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {actionError && (
          <div className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {actionError}
          </div>
        )}
      <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/90 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="w-32 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageSlice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No debts for this tab yet.
                  </td>
                </tr>
              ) : (
                pageSlice.map((d) => (
                  <tr key={d.id} className="text-gray-800 transition-colors hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3 text-gray-500">{d.dueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          d.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : d.status === "OVERDUE"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">${d.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(d)}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                          aria-label={`Edit ${d.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleMarkPaid(d.id)}
                          disabled={d.status === "PAID"}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40"
                          aria-label={`Mark ${d.name} as paid`}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {rangeStart}-{rangeEnd} of {filteredDebts.length}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">{safePage}</span>
            <span className="text-gray-500">of {totalPages}</span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
{/* ADD MODAL */}
{showAdd && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleAddDebt()
      }}
      className="relative w-full max-w-md space-y-5 overflow-hidden rounded-xl bg-white p-6 shadow-2xl"
    >

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Record New Debt</h2>

        <button
          type="button"
          onClick={handleCloseAdd}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      {/* Toggle */}
      <div className="mb-1 flex gap-3 text-sm">

        <button
          type="button"
          onClick={() => setTab("owe")}
          className={`flex-1 py-1 rounded-md ${
            tab === "owe"
              ? "rounded-lg bg-pink-500 py-2 font-semibold text-white shadow-md shadow-pink-500/20"
              : "rounded-lg bg-gray-100 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-200"
          }`}
        >
          I Owe
        </button>

        <button
          type="button"
          onClick={() => setTab("owed")}
          className={`flex-1 py-1 rounded-md ${
            tab === "owed"
              ? "rounded-lg bg-blue-500 py-2 font-semibold text-white shadow-md shadow-blue-500/20"
              : "rounded-lg bg-gray-100 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-200"
          }`}
        >
          Owed To Me
        </button>

      </div>

      {/* Person Name */}
      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Person Name</p>

        <input
          type="text"
          placeholder={tab === "owe" ? "Who is owed?" : "Who owes me?"}
          value={newDebt.name}
          onChange={(e)=>setNewDebt({...newDebt,name:e.target.value})}
          className="w-full rounded-lg border border-gray-200 p-2 outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Amount */}
      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">
          Total Amount ({currencyCode})
        </p>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder={`${currencySymbol} 0.00`}
          value={newDebt.amount}
          onChange={(e)=>setNewDebt({...newDebt,amount:e.target.value})}
          className="w-full rounded-lg border border-gray-200 p-2 outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Date */}
      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Due Date</p>

        <input
          type="date"
          value={newDebt.dueDate}
          onChange={(e)=>setNewDebt({...newDebt,dueDate:e.target.value})}
          className="w-full rounded-lg border border-gray-200 p-2 outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Notes */}
      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Note</p>

        <textarea
          placeholder="Add some details about this debt..."
          className="h-20 w-full resize-none rounded-lg border border-gray-200 p-2 outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Add Button */}
      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-accent py-3 font-bold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/95"
      >
        + Add Debt
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={handleCloseAdd}
        className="w-full rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
      >
        Cancel
      </button>

    </form>
  </div>
)}
      {/* EDIT MODAL */}
      {editingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
            className="relative w-full max-w-lg rounded-[1.75rem] bg-white p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleCloseEdit}
              className="absolute right-6 top-6 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <span className="text-lg leading-none">×</span>
            </button>

            <h2 className="pr-10 text-2xl font-bold tracking-tight text-gray-900">Edit Debt</h2>
            <p className="mt-1 text-sm text-gray-500">Update this debt record.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Person Name</label>
                <input
                  value={editingDebt.name}
                  onChange={(e)=>setEditingDebt({...editingDebt,name:e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-gray-900 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Amount</label>
                  <input
                    type="number"
                    value={editingDebt.amount}
                    onChange={(e)=>setEditingDebt({...editingDebt,amount:Number(e.target.value)})}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-gray-900 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Due Date</label>
                  <input
                    type="date"
                    value={editingDebt.dueDate}
                    onChange={(e)=>setEditingDebt({...editingDebt,dueDate:e.target.value})}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-gray-900 outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={handleCloseEdit}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-center text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent/95"
              >
                Save changes
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  )
}