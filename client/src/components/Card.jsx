import { useState } from "react"

function Card({ card, listId, onOpenModal }) {

  const [isHovered, setIsHovered] = useState(false)

  const priorityStyles = {
    High: "bg-red-500/10 text-red-600",
    Medium: "bg-amber-500/10 text-amber-600",
    Low: "bg-green-500/10 text-green-600"
  }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div
      onClick={() => onOpenModal?.(card, listId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl p-3.5 shadow-sm
                 border border-gray-100
                 hover:shadow-md hover:border-primary-200
                 hover:-translate-y-0.5
                 transition-all duration-200 cursor-pointer"
    >

      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {card.labels.map((label, i) => (
            <span
              key={i}
              className="h-1.5 w-8 rounded-full"
              style={{ backgroundColor: label }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 leading-snug">
        {card.title}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">

        {/* Priority badge */}
        {card.priority && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                            ${priorityStyles[card.priority] || "bg-gray-100 text-gray-600"}`}>
            {card.priority}
          </span>
        )}

        {/* Due date */}
        {card.dueDate && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1
                            ${isOverdue
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(card.dueDate)}
          </span>
        )}

      </div>

      {/* Hover indicator */}
      <div className={`absolute top-0 left-0 w-0.5 h-full rounded-l-xl bg-primary-500
                        transition-opacity duration-200
                        ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

    </div>
  )
}

export default Card