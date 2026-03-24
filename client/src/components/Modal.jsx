import { useState, useEffect, useRef } from "react"
import { useBoardStore } from "../context/BoardContext"

function Modal({ card, listId, onClose }) {

  const updateCard = useBoardStore(s => s.updateCard)
  const deleteCard = useBoardStore(s => s.deleteCard)

  const [title, setTitle] = useState(card?.title || "")
  const [description, setDescription] = useState(card?.description || "")
  const [dueDate, setDueDate] = useState(
    card?.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""
  )
  const [priority, setPriority] = useState(card?.priority || "")

  const backdropRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  const handleSave = () => {
    updateCard(card._id, listId, {
      title: title.trim() || card.title,
      description: description,
      dueDate: dueDate || null,
      priority: priority || ""
    })
    onClose()
  }

  const handleDelete = () => {
    deleteCard(card._id, listId)
    onClose()
  }

  if (!card) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4
                      overflow-hidden">

        {/* Header accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

        <div className="p-6">

          {/* Title */}
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            className="text-xl font-bold w-full outline-none border-none
                       text-gray-900 placeholder-gray-300
                       pb-3 border-b border-gray-100
                       focus:border-primary-300 transition-colors"
          />

          <div className="border-t border-gray-100 my-4" />

          {/* Description */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add a detailed description..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm
                         text-gray-700 placeholder-gray-300
                         focus:outline-none focus:ring-2 focus:ring-primary-200
                         focus:border-primary-300 transition-all resize-none"
            />
          </div>

          {/* Due Date & Priority Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700 bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all cursor-pointer"
              >
                <option value="">None</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">

            <button
              onClick={handleDelete}
              className="text-sm font-medium text-red-500 hover:text-red-600
                         hover:bg-red-50 px-4 py-2 rounded-lg
                         transition-all duration-200 cursor-pointer"
            >
              Delete Card
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="text-sm font-medium text-gray-500 hover:text-gray-700
                           hover:bg-gray-100 px-5 py-2.5 rounded-xl
                           transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-sm font-semibold text-white
                           bg-gradient-to-r from-primary-500 to-primary-600
                           hover:from-primary-600 hover:to-primary-700
                           px-5 py-2.5 rounded-xl shadow-sm
                           hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Modal
