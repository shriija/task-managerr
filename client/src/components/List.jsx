import { useState, useRef, useEffect } from "react"
import { useBoardStore } from "../context/BoardContext"
import Card from "./Card"

function List({ list, onOpenModal }) {

  const addCard = useBoardStore(s => s.addCard)
  const deleteList = useBoardStore(s => s.deleteList)
  const updateListTitle = useBoardStore(s => s.updateListTitle)

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardText, setCardText] = useState("")
  const [cardError, setCardError] = useState("") // ← Add error state for card

  const titleRef = useRef(null)
  const addCardRef = useRef(null)

  useEffect(() => {
    if (editing) titleRef.current?.focus()
  }, [editing])

  useEffect(() => {
    if (showAddCard) addCardRef.current?.focus()
  }, [showAddCard])

  const handleTitleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      alert("List name required")
      setTitle(list.title)
      return
    }
    if (trimmed !== list.title) updateListTitle(list._id, trimmed)
    setEditing(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") handleTitleSave()
    if (e.key === "Escape") {
      setTitle(list.title)
      setEditing(false)
    }
  }

  const handleAddCard = () => {
    if (!cardText.trim()) {
      setCardError("Card name required") // ← Show error
      return
    }
    addCard(list._id, cardText.trim())
    setCardText("")
    setShowAddCard(false)
    setCardError("") // Clear error after successful add
  }

  const handleAddCardKeyDown = (e) => {
    if (e.key === "Enter") handleAddCard()
    if (e.key === "Escape") {
      setCardText("")
      setShowAddCard(false)
      setCardError("")
    }
  }

  const accentColors = [
    "from-primary-400 to-primary-500",
    "from-emerald-400 to-emerald-500",
    "from-amber-400 to-amber-500",
    "from-rose-400 to-rose-500",
    "from-cyan-400 to-cyan-500",
    "from-violet-400 to-violet-500"
  ]
  const accent = accentColors[(list.position || 0) % accentColors.length]

  return (
    <div className="w-full flex-shrink-0 flex flex-col max-h-[82vh]
                    bg-white/85 backdrop-blur-xl border border-white/50
                    rounded-2xl shadow-lg overflow-hidden">

      {/* Colored accent bar */}
      <div className={`h-1 bg-gradient-to-r ${accent}`} />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        {editing ? (
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="text-sm font-bold flex-1 outline-none bg-transparent
                       border-b-2 border-primary-300 pb-0.5 text-gray-900"
          />
        ) : (
          <h3
            onClick={() => setEditing(true)}
            className="text-sm font-bold text-gray-800 cursor-pointer
                       hover:text-primary-600 transition-colors"
          >
            {list.title}
          </h3>
        )}

        <div className="flex items-center gap-2 ml-3">
          <span className="text-[10px] font-semibold bg-gray-100 text-gray-500
                           px-2 py-0.5 rounded-full min-w-[22px] text-center">
            {list.cards?.length || 0}
          </span>

          <button
            onClick={() => deleteList(list._id)}
            className="text-gray-400 hover:text-red-500
                       transition-all duration-200 text-sm cursor-pointer
                       hover:bg-red-50 w-6 h-6 rounded-lg
                       flex items-center justify-center"
            title="Delete list"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Cards container */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-2.5
                      [&::-webkit-scrollbar]:w-1.5
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-gray-300/40
                      [&::-webkit-scrollbar-thumb]:rounded-full">
        {list.cards?.map((card) => (
          <Card
            key={card._id}
            card={card}
            listId={list._id}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>

      {/* Add Card area */}
      <div className="px-3 pb-3 pt-1">
        {showAddCard ? (
          <div>
            <input
              ref={addCardRef}
              value={cardText}
              onChange={(e) => { setCardText(e.target.value); setCardError("") }} // clear error as user types
              onKeyDown={handleAddCardKeyDown}
              placeholder="Enter card title..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         placeholder-gray-400 text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-primary-200
                         focus:border-primary-300 transition-all mb-1"
            />

            {cardError && (
              <p className="text-red-500 text-xs mb-1">{cardError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="flex-1 text-sm font-semibold text-white
                           bg-gradient-to-r from-primary-500 to-primary-600
                           hover:from-primary-600 hover:to-primary-700
                           py-2 rounded-xl shadow-sm
                           hover:shadow transition-all duration-200 cursor-pointer"
              >
                Add Card
              </button>
              <button
                onClick={() => { setCardText(""); setShowAddCard(false); setCardError("") }}
                className="text-sm text-gray-400 hover:text-gray-600
                           px-3 py-2 rounded-xl hover:bg-gray-100
                           transition-all duration-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full text-sm text-gray-400 font-medium
                       hover:text-primary-600 hover:bg-primary-50
                       py-2.5 rounded-xl
                       transition-all duration-200 cursor-pointer
                       flex items-center justify-center gap-1.5"
          >
            <span className="text-lg leading-none">+</span>
            Add Card
          </button>
        )}
      </div>

    </div>
  )
}

export default List