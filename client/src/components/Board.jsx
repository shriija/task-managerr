import { useState } from "react"
import { useBoardStore } from "../context/BoardContext"
import List from "./List"
import Modal from "./Modal"

/**
 * Board Component
 * 
 * Renders the main workspace for a specific board. It retrieves the lists and board 
 * metadata from the Zustand global store (`useBoardStore`), and displays them in a responsive grid.
 * It also manages the state for the Card Detail Modal and handles adding new lists.
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Text used to filter cards globally across all lists.
 * @param {boolean} props.filterByMe - Flag indicating whether to only show cards assigned to the current user.
 */
function Board({ searchQuery, filterByMe }) {

  // Retrieve state and actions from the Zustand store
  const lists = useBoardStore(s => s.lists)
  const board = useBoardStore(s => s.board)
  const addList = useBoardStore(s => s.addList)

  // ── Modal State ─────────────────────────────────────────
  // Controls which card is currently open in the detailed modal view
  const [modalCard, setModalCard] = useState(null)
  const [modalListId, setModalListId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("") 

  /**
   * Opens the Card Detail Modal for a specific card.
   * Passed down as a prop to the List component.
   */
  const handleOpenModal = (card, listId) => {
    setModalCard(card)
    setModalListId(listId)
  }

  /** Closes the Card Detail Modal */
  const handleCloseModal = () => {
    setModalCard(null)
    setModalListId(null)
  }

  /**
   * Handles adding a new list to the board.
   * Validates that the last created list has a title before allowing another one to be added
   * to prevent users from spamming empty lists.
   */
  const handleAddList = () => {
    const boardId = board?._id || "local"

    // Check if the last list has an empty title
    const lastList = lists[lists.length - 1]
    if (lastList && (!lastList.title || lastList.title.trim() === "")) {
      setErrorMessage("List name required")
      return
    }

    addList(boardId, "New List")
    setErrorMessage("") // clear error when a list is successfully added
  }

  return (
    <>
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        {/* Add List button */}
        <button
          onClick={handleAddList}
          className="w-full h-24 border-2 border-dashed border-gray-200
                     rounded-2xl text-gray-400 font-medium text-sm
                     hover:border-primary-300 hover:text-primary-500
                     hover:bg-primary-50/50
                     transition-all duration-300 cursor-pointer
                     flex items-center justify-center gap-2
                     hover:shadow-sm mb-5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add List
        </button>

        {/* Error message */}
        {errorMessage && (
          <p className="mt-2 text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        {/* Grid layout for lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {lists.map((list) => (
            <List
              key={list._id}
              list={list}
              onOpenModal={handleOpenModal}
              searchQuery={searchQuery}
              filterByMe={filterByMe}
            />
          ))}
        </div>
      </div>

      {/* Card Detail Modal - Rendered globally over the board when active */}
      {modalCard && (
        <Modal
          card={modalCard}
          listId={modalListId}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default Board