import { useState } from "react"
import { useBoardStore } from "../context/BoardContext"
import List from "./List"
import Modal from "./Modal"

function Board() {

  const lists = useBoardStore(s => s.lists)
  const board = useBoardStore(s => s.board)
  const addList = useBoardStore(s => s.addList)

  // Modal state
  const [modalCard, setModalCard] = useState(null)
  const [modalListId, setModalListId] = useState(null)

  const handleOpenModal = (card, listId) => {
    setModalCard(card)
    setModalListId(listId)
  }

  const handleCloseModal = () => {
    setModalCard(null)
    setModalListId(null)
  }

  const handleAddList = () => {
    const boardId = board?._id || "local"
    addList(boardId, "New List")
  }

  return (
    <>
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        {/* Grid layout for lists */}
        {/* Add List button */}
          <button
            onClick={handleAddList}
            className="w-full h-24 border-2 border-dashed border-gray-200
                       rounded-2xl text-gray-400 font-medium text-sm
                       hover:border-primary-300 hover:text-primary-500
                       hover:bg-primary-50/50
                       transition-all duration-300 cursor-pointer
                       flex items-center justify-center gap-2
                       hover:shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add List
          </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Render existing lists */}
          {lists.map((list) => (
            <List
              key={list._id}
              list={list}
              onOpenModal={handleOpenModal}
            />
          ))}

        </div>
      </div>

      {/* Card Detail Modal */}
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