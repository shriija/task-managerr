import { useState } from "react"

function Board() {

  const [lists, setLists] = useState([
    {
      id: 1,
      title: "Todo",
      cards: [
        { id: 1, text: "qwerfgikujh" },
        { id: 2, text: "aedfs" }
      ]
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        { id: 3, text: "esdfd" }
      ]
    }
  ])

  const [newListTitle, setNewListTitle] = useState("")

  const addList = () => {
    if (!newListTitle.trim()) return

    const newList = {
      id: Date.now(),
      title: newListTitle,
      cards: []
    }

    setLists([...lists, newList])
    setNewListTitle("")
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Task Board
      </h1>

      <div className="flex gap-6 items-start">

        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white w-72 p-4 rounded shadow"
          >

            <h2 className="font-semibold mb-4">
              {list.title}
            </h2>

            <div className="flex flex-col gap-3">

              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-100 p-3 rounded shadow-sm"
                >
                  {card.text}
                </div>
              ))}

            </div>

          </div>
        ))}

        {/* Add List Section */}
        <div className="bg-gray-200 w-72 p-4 rounded shadow flex flex-col gap-3">

          <input
            type="text"
            placeholder="New list title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className="p-2 border rounded"
          />

          <button
            onClick={addList}
            className="bg-black text-white py-2 rounded"
          >
            Add List
          </button>

        </div>

      </div>
    </div>
  )
}

export default Board