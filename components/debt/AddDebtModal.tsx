"use client"

import { useState } from "react"

export default function AddDebtModal({ onSubmit, onClose }: any) {

  const [name,setName] = useState("")
  const [amount,setAmount] = useState("")
  const [date,setDate] = useState("")

  const handleSubmit = () => {

    if(!name || !amount){
      alert("All fields required")
      return
    }

    onSubmit({
      name,
      amount:Number(amount),
      dueDate:date
    })

    onClose()
  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-96 space-y-4">

        <h2 className="text-lg font-semibold">
          Record New Debt
        </h2>

        <input
          type="text"
          placeholder="Person name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Add Debt
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  )
}