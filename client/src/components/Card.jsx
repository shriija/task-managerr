import { useState } from "react";
import { useBoardStore } from "../context/BoardContext";

function Card({ card, listId, onOpenModal, onDragStart, onDragEnd }) {
  const board = useBoardStore(s => s.board);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const priorityStyles = {
    High: "bg-red-500/10 text-red-600",
    Medium: "bg-amber-500/10 text-amber-600",
    Low: "bg-green-500/10 text-green-600",
  };

  const statusBgStyles = {
    "to do": "bg-blue-50 border border-blue-100/60 hover:border-blue-300",
    "in progress": "bg-amber-50 border border-amber-100/60 hover:border-amber-300",
    "completed": "bg-emerald-50 border border-emerald-100/60 hover:border-emerald-300"
  };

  const hoverIndicatorColors = {
    "to do": "bg-blue-500",
    "in progress": "bg-amber-500",
    "completed": "bg-emerald-500"
  };

  const isOverdue = card.dueDate && card.status !== "completed" && new Date(card.dueDate) < new Date();

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        cardId: card._id,
        fromListId: listId,
      }),
    );
    // Add a slight delay for the drag image
    setTimeout(() => {
      e.target.style.opacity = "0.4";
    }, 0);
    onDragStart?.(card._id, listId);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.target.style.opacity = "1";
    onDragEnd?.();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onOpenModal?.(card, listId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-xl p-3.5 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing
                 ${statusBgStyles[card.status] || "bg-white border border-gray-100 hover:border-primary-200 hover:-translate-y-0.5"}
                 hover:shadow-md hover:-translate-y-0.5
                 ${isDragging ? "opacity-40 scale-95 ring-2 ring-primary-300" : ""}`}
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

      {/* Description indicator */}
      {card.description && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
          {card.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {/* Due status tag in red */}
        {isOverdue && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 animate-pulse uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Due
          </span>
        )}

        {/* Priority badge */}
        {card.priority && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                            ${priorityStyles[card.priority] || "bg-gray-100 text-gray-600"}`}
          >
            {card.priority}
          </span>
        )}

        {/* Due date */}
        {card.dueDate && (
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1
                            ${
                              isOverdue
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(card.dueDate)}
          </span>
        )}

        {/* Assignee Avatar(s) */}
        {!board?.allowMultipleAssignees ? (
          card.assignedTo && (
            <div 
              className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600
                         flex items-center justify-center text-white text-[9px] font-bold shadow-sm ml-auto flex-shrink-0"
              title={`Assigned to ${card.assignedTo.name}`}
            >
              {card.assignedTo.avatar ? (
                <img src={card.assignedTo.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                card.assignedTo.name?.charAt(0).toUpperCase() || "A"
              )}
            </div>
          )
        ) : (
          card.assignees && card.assignees.length > 0 && (
            <div className="flex -space-x-1.5 overflow-hidden ml-auto">
              {card.assignees.slice(0, 3).map((a, i) => (
                <div key={a._id || i} className="w-5 h-5 rounded-full border border-white
                              bg-gradient-to-br from-primary-400 to-primary-600
                              flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold shadow-sm"
                     title={`Assigned to ${a.name}`}>
                  {a.avatar ? (
                    <img src={a.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    a.name?.charAt(0).toUpperCase() || "A"
                  )}
                </div>
              ))}
              {card.assignees.length > 3 && (
                <div className="w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[9px] font-semibold text-gray-500 shadow-sm z-10">
                  +{card.assignees.length - 3}
                </div>
              )}
            </div>
          )
        )}

        {/* Drag handle indicator */}
        <svg
          className={`w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${(!board?.allowMultipleAssignees && !card.assignedTo) || (board?.allowMultipleAssignees && (!card.assignees || card.assignees.length === 0)) ? 'ml-auto' : 'ml-1.5'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </div>

      {/* Hover indicator */}
      <div
        className={`absolute top-0 left-0 w-0.5 h-full rounded-l-xl transition-opacity duration-200
                    ${isOverdue ? 'bg-red-500' : (hoverIndicatorColors[card.status] || 'bg-primary-500')}
                    ${isHovered ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default Card;