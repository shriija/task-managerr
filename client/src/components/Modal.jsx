import { useState, useEffect, useRef } from "react"
import { useBoardStore } from "../context/BoardContext"
import { useAuthStore } from "../context/AuthContext"
import { API_URL } from "../services/api"
import axios from "axios"
import AttachmentsSection from "./AttachmentsSection"
import RemarksSection from "./RemarksSection"

function Modal({ card, listId, onClose }) {

  const updateCard = useBoardStore(s => s.updateCard)
  const deleteCard = useBoardStore(s => s.deleteCard)
  const board = useBoardStore(s => s.board)

  const [title, setTitle] = useState(card?.title || "")
  const [description, setDescription] = useState(card?.description || "")
  const [dueDate, setDueDate] = useState(
    card?.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""
  )
  const [priority, setPriority] = useState(card?.priority || "")
  const [status, setStatus] = useState(card?.status || "to do")
  const [assignedTo, setAssignedTo] = useState(card?.assignedTo || null)
  const [assignees, setAssignees] = useState(card?.assignees || [])
  const [localCard, setLocalCard] = useState(card)

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const backdropRef = useRef(null)
  const titleRef = useRef(null)
  const assigneeRef = useRef(null)

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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (assigneeRef.current && !assigneeRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    window.addEventListener("mousedown", handleOutsideClick)
    return () => window.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // User search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await axios.get(`${API_URL}/user-api/search?q=${searchTerm.trim()}`, { withCredentials: true })
        setSearchResults(res.data.payload || [])
      } catch (err) {
        // Search error
      } finally {
        setSearchLoading(false)
      }
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  const handleSave = () => {
    updateCard(card._id, listId, {
      title: title.trim() || card.title,
      description: description,
      dueDate: dueDate || null,
      priority: priority || "",
      status: status || "to do",
      assignedTo: assignedTo || null,
      assignees: assignees || []
    })
    onClose()
  }

  const handleDelete = () => {
    deleteCard(card._id, listId)
    onClose()
  }

  // Get board owner and members for collaborated list
  const owner = board?.owner
  const members = board?.members || []
  let collaborators = []
  if (owner) collaborators.push(owner)
  members.forEach(m => {
    if (m && m._id && !collaborators.some(c => c._id === m._id)) {
      collaborators.push(m)
    }
  })

  const currentUser = useAuthStore(s => s.currentUser)
  const isBoardOwner = currentUser?._id === (board?.owner?._id || board?.owner)
  const isBoardAdmin = board?.admins?.some(a => (a._id || a) === currentUser?._id)
  const canAssignOthers = isBoardOwner || isBoardAdmin

  if (!canAssignOthers) {
    collaborators = collaborators.filter(c => c._id === currentUser?._id)
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
        <div className="h-1.5 bg-linear-to-r from-primary-400 via-primary-500 to-primary-600" />

        <div className="p-6">

          {/* Title */}
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canAssignOthers}
            placeholder="Card title"
            className={`text-xl font-bold w-full outline-none border-none
                       text-gray-900 placeholder-gray-300
                       pb-3 border-b border-gray-100
                       focus:border-primary-300 transition-colors ${!canAssignOthers ? "bg-transparent cursor-not-allowed" : ""}`}
          />

          <div className="border-t border-gray-100 my-4" />

          {/* Status & Assignee Row */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            
            {/* Status Select */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700 bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all cursor-pointer shadow-sm"
              >
                <option value="to do">📋 To Do</option>
                <option value="in progress">⚡ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            {/* Assignee Search Dropdown */}
            <div className="relative" ref={assigneeRef}>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                {board?.allowMultipleAssignees ? "Assignees" : "Assignee"}
              </label>
              
              <div 
                onClick={() => canAssignOthers && setDropdownOpen(!dropdownOpen)}
                className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700 bg-white flex items-center justify-between
                           hover:border-primary-300 transition-all shadow-sm min-h-11.5
                           ${canAssignOthers ? "cursor-pointer" : "cursor-not-allowed bg-gray-50/50"}`}
              >
                {!board?.allowMultipleAssignees ? (
                  assignedTo ? (
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary-400 to-primary-600
                                      flex items-center justify-center shrink-0 text-white text-[9px] font-bold">
                        {assignedTo.avatar ? (
                          <img src={assignedTo.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          assignedTo.name?.charAt(0).toUpperCase() || "A"
                        )}
                      </div>
                      <span className="truncate font-medium">{assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )
                ) : (
                  assignees.length > 0 ? (
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {assignees.slice(0, 4).map((a, i) => (
                        <div key={a._id || i} className="w-6 h-6 rounded-full border-2 border-white
                                      bg-linear-to-br from-primary-400 to-primary-600
                                      flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                             title={a.name}>
                          {a.avatar ? (
                            <img src={a.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            a.name?.charAt(0).toUpperCase() || "A"
                          )}
                        </div>
                      ))}
                      {assignees.length > 4 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500">
                          +{assignees.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )
                )}
                
                <div className="flex items-center gap-1.5 ml-2">
                  {canAssignOthers && ((!board?.allowMultipleAssignees && assignedTo) || (board?.allowMultipleAssignees && assignees.length > 0)) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (board?.allowMultipleAssignees) setAssignees([]);
                        else setAssignedTo(null);
                      }}
                      className="text-gray-400 hover:text-red-500 text-xs w-4 h-4 
                                 flex items-center justify-center rounded-full hover:bg-gray-100"
                      title="Clear All"
                    >
                      ✕
                    </button>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Dropdown Overlay */}
              {dropdownOpen && (
                <div className="absolute top-[102%] left-0 right-0 z-50 mt-1 bg-white border border-gray-100
                                rounded-2xl shadow-xl p-3 max-h-56 overflow-y-auto animate-fade-in-up">
                  {/* Search input */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search collaborators..."
                    className="w-full border border-gray-100 rounded-xl px-3 py-2 text-xs
                               focus:outline-none focus:ring-2 focus:ring-primary-200 bg-gray-50/50 mb-3"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* List header */}
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                    {searchTerm ? "Search Results" : "Collaborators"}
                  </div>

                  {/* List of collaborators/search results */}
                  <div className="space-y-1">
                    {searchLoading ? (
                      <div className="text-center py-4 text-xs text-gray-400 animate-pulse">Searching...</div>
                    ) : (searchTerm ? searchResults : collaborators).length === 0 ? (
                      <div className="text-center py-4 text-xs text-gray-400">No users found</div>
                    ) : (
                      (searchTerm ? searchResults : collaborators).map((user) => {
                        const isSelected = board?.allowMultipleAssignees 
                          ? assignees.some(a => a._id === user._id)
                          : assignedTo?._id === user._id;
                          
                        return (
                          <div
                            key={user._id}
                            onClick={() => {
                              if (board?.allowMultipleAssignees) {
                                if (isSelected) {
                                  setAssignees(assignees.filter(a => a._id !== user._id));
                                } else {
                                  setAssignees([...assignees, user]);
                                }
                              } else {
                                setAssignedTo(user);
                                setDropdownOpen(false);
                              }
                              setSearchTerm("");
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer
                                        transition-colors ${isSelected ? "bg-primary-50 text-primary-600 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary-300 to-primary-500
                                              flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {user.avatar ? (
                                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  user.name?.charAt(0).toUpperCase() || "U"
                                )}
                              </div>
                              <div className="truncate text-left">
                                <div className="truncate font-medium">{user.name}</div>
                                <div className="text-[9px] text-gray-400 truncate">{user.email}</div>
                              </div>
                            </div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canAssignOthers}
              rows={4}
              placeholder="Add a detailed description..."
              className={`w-full border border-gray-200 rounded-xl p-3 text-sm
                         text-gray-700 placeholder-gray-300
                         focus:outline-none focus:ring-2 focus:ring-primary-200
                         focus:border-primary-300 transition-all resize-none ${!canAssignOthers ? "bg-gray-50/50 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* Attachments */}
          <AttachmentsSection card={localCard} canEdit={canAssignOthers} onCardUpdate={setLocalCard} />

          {/* Remarks */}
          <RemarksSection card={localCard} canEdit={canAssignOthers} onCardUpdate={setLocalCard} />

          {/* Due Date & Priority Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={!canAssignOthers}
                className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all ${!canAssignOthers ? "bg-gray-50/50 cursor-not-allowed" : ""}`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={!canAssignOthers}
                className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                           text-gray-700 bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all ${canAssignOthers ? "cursor-pointer" : "cursor-not-allowed bg-gray-50/50"}`}
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

            {canAssignOthers ? (
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-red-500 hover:text-red-600
                           hover:bg-red-50 px-4 py-2 rounded-lg
                           transition-all duration-200 cursor-pointer"
              >
                Delete Card
              </button>
            ) : (
              <div />
            )}

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
                           bg-linear-to-r from-primary-500 to-primary-600
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
