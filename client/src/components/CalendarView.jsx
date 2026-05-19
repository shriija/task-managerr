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

  // Map to FullCalendar events format
  const events = useMemo(() => {
    return scheduledCards.map(({ card, listId }) => {
      let color = "#3b82f6" // blue
      let borderColor = "#2563eb"

      if (card.status === "completed") {
        color = "#10b981" // emerald
        borderColor = "#059669"
      } else if (card.status === "in progress") {
        color = "#f59e0b" // amber
        borderColor = "#d97706"
      } else if (card.status === "to do") {
        color = "#ef4444" // red
        borderColor = "#dc2626"
      }

      return {
        id: card._id,
        title: card.title,
        start: card.dueDate,
        allDay: true, 
        backgroundColor: color,
        borderColor: borderColor,
        extendedProps: { listId, card }
      }
    })
  }, [scheduledCards])

  // Handlers
  const handleEventDrop = (info) => {
    const cardId = info.event.id
    const listId = info.event.extendedProps.listId
    const newDate = info.event.start

    updateCard(cardId, listId, { dueDate: newDate.toISOString() })
  }

  const handleEventReceive = (info) => {
    const cardId = info.event.id
    const listId = info.event.extendedProps.listId
    const newDate = info.event.start

    // Update the card due date which triggers a re-render pulling from lists state
    updateCard(cardId, listId, { dueDate: newDate.toISOString() })
    
    // Revert the local drop so React state is the single source of truth
    info.revert()
  }

  const handleEventClick = (info) => {
    // Check if the event came from state (has full card obj)
    if (info.event.extendedProps.card) {
      setModalCard(info.event.extendedProps.card)
      setModalListId(info.event.extendedProps.listId)
    }
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
      <div className="flex-1 p-6 overflow-hidden flex flex-col bg-white">
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
            --fc-event-bg-color: #3b82f6;
            --fc-event-border-color: #2563eb;
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
          .fc-event {
            cursor: pointer;
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 0.75rem;
            font-weight: 500;
            border: 1px solid transparent;
            transition: opacity 0.2s;
          }
          .fc-event:hover {
            opacity: 0.9;
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
        `}</style>
        
        <div className="flex-1 h-full w-full custom-calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            editable={true}
            droppable={true}
            events={events}
            drop={handleEventReceive}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            height="100%"
            dayMaxEvents={true}
          />
        </div>
      </div>

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
