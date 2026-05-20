import { useState, useEffect, useRef, useMemo } from "react"
import { useBoardStore } from "../context/BoardContext"
import Modal from "./Modal"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"

function CalendarView() {
  const lists = useBoardStore(s => s.lists)
  const updateCard = useBoardStore(s => s.updateCard)

  const [modalCard, setModalCard] = useState(null)
  const [modalListId, setModalListId] = useState(null)

  // Day tasks modal state
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateTasks, setSelectedDateTasks] = useState([])
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)

  const externalEventsRef = useRef(null)

  // Initialize Draggable for external events (Unscheduled tasks)
  useEffect(() => {
    let draggable = null
    if (externalEventsRef.current) {
      draggable = new Draggable(externalEventsRef.current, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          const cardId = eventEl.getAttribute("data-card-id")
          const listId = eventEl.getAttribute("data-list-id")
          
          return {
            id: cardId,
            title: eventEl.innerText,
            create: true,
            extendedProps: { listId }
          }
        }
      })
    }
    return () => {
      if (draggable) draggable.destroy()
    }
  }, [])

  // Split cards into scheduled and unscheduled
  const { scheduledCards, unscheduledCards } = useMemo(() => {
    const scheduled = []
    const unscheduled = []

    lists.forEach(list => {
      ;(list.cards || []).forEach(card => {
        if (card.dueDate) {
          scheduled.push({ card, listId: list._id })
        } else {
          unscheduled.push({ card, listId: list._id })
        }
      })
    })
    return { scheduledCards: scheduled, unscheduledCards: unscheduled }
  }, [lists])

  // Handlers
  const handleEventReceive = (info) => {
    const cardId = info.event.id
    const listId = info.event.extendedProps.listId
    const newDate = info.event.start

    // Update the card due date which triggers a re-render pulling from lists state
    updateCard(cardId, listId, { dueDate: newDate.toISOString() })
    
    // Revert the local drop so React state is the single source of truth
    // and since we hide pills, this ensures FullCalendar doesn't leave a dummy pill behind.
    info.revert()
  }

  const handleOpenModal = (card, listId) => {
    setModalCard(card)
    setModalListId(listId)
  }

  const handleCloseModal = () => {
    setModalCard(null)
    setModalListId(null)
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-50/30">
      
      {/* Sidebar: Unscheduled Tasks */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col hidden lg:flex flex-shrink-0">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Unscheduled
          </h3>
          <p className="text-xs text-gray-500 mt-1">Drag tasks to the calendar to schedule them.</p>
        </div>
        
        <div 
          ref={externalEventsRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        >
          {unscheduledCards.length === 0 ? (
            <div className="text-center p-4 text-sm text-gray-400">
              No unscheduled tasks found.
            </div>
          ) : (
            unscheduledCards.map(({ card, listId }) => (
              <div
                key={card._id}
                data-card-id={card._id}
                data-list-id={listId}
                className="fc-event group relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex gap-1.5 mb-1.5 flex-wrap">
                  {card.labels?.map((label, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-6 rounded-full"
                      style={{ backgroundColor: label }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-700 leading-snug">{card.title}</p>
                {card.priority && (
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {card.priority}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col bg-white relative">
        <style>{`
          .fc {
            --fc-border-color: #f3f4f6;
            --fc-button-text-color: #4b5563;
            --fc-button-bg-color: #ffffff;
            --fc-button-border-color: #e5e7eb;
            --fc-button-hover-bg-color: #f9fafb;
            --fc-button-hover-border-color: #d1d5db;
            --fc-button-active-bg-color: #f3f4f6;
            --fc-button-active-border-color: #d1d5db;
            --fc-today-bg-color: #eff6ff;
            font-family: inherit;
          }
          .fc-theme-standard th {
            padding: 12px 0;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            color: #6b7280;
            background-color: #f9fafb;
          }
          .fc-daygrid-day-number {
            font-weight: 500;
            padding: 8px !important;
            color: #374151;
          }
          .fc-day-today .fc-daygrid-day-number {
            color: #2563eb;
            font-weight: 700;
          }
          .fc-toolbar-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937;
          }
          .fc .fc-button {
            border-radius: 8px;
            font-weight: 500;
            padding: 0.4rem 1rem;
            text-transform: capitalize;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .fc .fc-button-primary:not(:disabled).fc-button-active,
          .fc .fc-button-primary:not(:disabled):active {
            background-color: #e5e7eb;
            border-color: #d1d5db;
            color: #111827;
          }
          
          /* Custom hover & selection styles for day cells */
          .fc-daygrid-day {
            transition: background-color 0.2s ease;
          }
          .fc-daygrid-day.cursor-pointer:hover {
            background-color: #f8fafc;
          }
        `}</style>
        
        <div className="flex-1 h-full w-full custom-calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek"
            }}
            droppable={true}
            drop={handleEventReceive}
            height="100%"
            // Hide event pills by not passing `events={...}` at all.
            dayCellClassNames={(arg) => {
              const dayTasks = scheduledCards.filter(({ card }) => {
                const d = new Date(card.dueDate)
                return d.getDate() === arg.date.getDate() && 
                       d.getMonth() === arg.date.getMonth() && 
                       d.getFullYear() === arg.date.getFullYear()
              })
              
              if (dayTasks.length === 0) return "cursor-pointer"
              
              const hasOverdue = dayTasks.some(({ card }) => 
                card.status !== "completed" && new Date(card.dueDate) < new Date()
              )
              
              return hasOverdue 
                ? "bg-red-100 cursor-pointer hover:bg-red-200 transition-colors" 
                : "bg-violet-300 cursor-pointer hover:bg-primary-100/50 transition-colors"
            }}
            dateClick={(info) => {
              const clickedDate = info.date
              const tasks = scheduledCards.filter(({ card }) => {
                const d = new Date(card.dueDate)
                return d.getDate() === clickedDate.getDate() && 
                       d.getMonth() === clickedDate.getMonth() && 
                       d.getFullYear() === clickedDate.getFullYear()
              })
              
              setSelectedDate(clickedDate)
              setSelectedDateTasks(tasks)
              setIsDayModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* Day Tasks Modal */}
      {isDayModalOpen && selectedDate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Tasks for {selectedDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
              </h3>
              <button 
                onClick={() => setIsDayModalOpen(false)}
                className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  No tasks scheduled for this day.
                </div>
              ) : (
                selectedDateTasks.map(({ card, listId }) => {
                  const isOverdue = card.dueDate && card.status !== 'completed' && new Date(card.dueDate) < new Date();
                  return (
                    <div 
                      key={card._id}
                      onClick={() => {
                        setIsDayModalOpen(false)
                        handleOpenModal(card, listId)
                      }}
                      className={`flex items-start p-3 border rounded-xl cursor-pointer hover:shadow-sm transition-all group ${
                        isOverdue ? 'bg-red-50 border-red-100 hover:border-red-300' :
                        card.status === 'completed' ? 'bg-emerald-50 border-emerald-100/60 hover:border-emerald-300' :
                        card.status === 'in progress' ? 'bg-amber-50 border-amber-100/60 hover:border-amber-300' :
                        'bg-blue-50 border-blue-100/60 hover:border-blue-300'
                      }`}
                    >
                       <div className="flex-1">
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600">{card.title}</p>
                           {isOverdue && (
                             <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-600 border border-red-200 animate-pulse uppercase tracking-wider">
                               Overdue
                             </span>
                           )}
                         </div>
                         {card.description && <p className="text-xs text-gray-500 line-clamp-1 mt-1">{card.description}</p>}
                       </div>
                       {card.priority && (
                         <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ml-3 flex-shrink-0
                          ${card.priority === 'High' ? 'bg-red-50 text-red-600' : 
                            card.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                            'bg-green-50 text-green-600'}`}>
                           {card.priority}
                         </span>
                       )}
                    </div>
                  )
                })
              )}
            </div>
            
            <div className="p-4 border-t border-gray-50 bg-gray-50/50 text-center">
              <button 
                onClick={() => setIsDayModalOpen(false)}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Task Edit Modal */}
      {modalCard && (
        <Modal
          card={modalCard}
          listId={modalListId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CalendarView
