import { useState } from "react"

function CardPage() {

  const [title, setTitle] = useState("Build Dashboard UI")
  const [description, setDescription] = useState(
    "Create the dashboard layout and integrate board components."
  )
  const [dueDate, setDueDate] = useState("")

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Title */}
        <div className="mb-6">
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="text-2xl font-bold w-full border-b pb-2 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-8">

          <h3 className="font-semibold text-gray-700 mb-2">
            Description
          </h3>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Due Date */}
        <div className="mb-8">

          <h3 className="font-semibold text-gray-700 mb-2">
            Due Date
          </h3>

          <input
            type="date"
            value={dueDate}
            onChange={(e)=>setDueDate(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        {/* Activity Section */}
        <div>

          <h3 className="font-semibold text-gray-700 mb-3">
            Activity
          </h3>

          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
            No activity yet
          </div>

        </div>

      </div>

    </div>
  )
}

export default CardPage