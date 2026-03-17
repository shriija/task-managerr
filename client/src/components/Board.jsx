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
      <div className="flex-1 overflow-x-auto p-6 custom-scrollbar">

        <div className="flex gap-5 items-start min-w-max">

          {lists.map((list, index) => (
            <div
              key={list._id}
              className="group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <List
                list={list}
                onOpenModal={handleOpenModal}
              />
            </div>
          ))}

          {/* Add Column Button */}
          <button
            onClick={handleAddList}
            className="w-80 flex-shrink-0 h-24
                       border-2 border-dashed border-gray-200
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