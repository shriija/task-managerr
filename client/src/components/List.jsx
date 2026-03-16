import { useState } from "react"

function List({ list, deleteList, updateListTitle, addCard, moveCard }) {

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [cardText, setCardText] = useState("")

  const handleTitleSave = () => {
    updateListTitle(list.id, title)
    setEditing(false)
  }

  const handleAddCard = () => {
    if (!cardText.trim()) return
    addCard(list.id, cardText)
    setCardText("")
  }

  return (
    <div className="bg-white w-72 p-4 rounded-lg shadow flex flex-col gap-3">

      {/* Title */}
      {editing ? (
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 flex-1"
          />
          <button onClick={handleTitleSave}>✔</button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">{list.title}</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)}>✏</button>
            <button
              onClick={() => deleteList(list.id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-2">

        {list.cards.map((card, index) => (
          <div
            key={card.id}
            className="bg-gray-100 p-2 rounded flex justify-between items-center"
          >

            <span>{card.text}</span>

            <div className="flex gap-1 text-xs">
              <button onClick={() => moveCard(list.id, index, -1)}>⬆</button>
              <button onClick={() => moveCard(list.id, index, 1)}>⬇</button>
            </div>

          </div>
        ))}

      </div>

      {/* Add Card */}
      <div className="flex gap-2 mt-2">
        <input
          value={cardText}
          onChange={(e) => setCardText(e.target.value)}
          placeholder="New card"
          className="border p-1 flex-1"
        />
        <button
          onClick={handleAddCard}
          className="bg-black text-white px-2 rounded"
        >
          +
        </button>
      </div>

    </div>
  )
}

export default List