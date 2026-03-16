import { useState } from "react"
import List from "../components/List"

function Board() {

  const [lists, setLists] = useState([
    {
      id: 1,
      title: "Todo",
      cards: [
        { id: 1, text: "Create login page" },
        { id: 2, text: "Setup backend auth" }
      ]
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        { id: 3, text: "Build dashboard UI" }
      ]
    }
  ])

  const addList = () => {
    const newList = {
      id: Date.now(),
      title: "New List",
      cards: []
    }

    setLists([...lists, newList])
  }

  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId))
  }

  const updateListTitle = (listId, newTitle) => {
    setLists(
      lists.map(list =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    )
  }

  const addCard = (listId, text) => {
    setLists(
      lists.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, { id: Date.now(), text }] }
          : list
      )
    )
  }

  const moveCard = (listId, cardIndex, direction) => {

    setLists(lists.map(list => {

      if (list.id !== listId) return list

      const cards = [...list.cards]
      const newIndex = cardIndex + direction

      if (newIndex < 0 || newIndex >= cards.length) return list

      const temp = cards[cardIndex]
      cards[cardIndex] = cards[newIndex]
      cards[newIndex] = temp

      return { ...list, cards }

    }))
  }

  return (
  <div className="h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 overflow-x-auto">

    <div className="flex gap-5 p-6 min-w-max items-start">

      {lists.map(list => (
        <List
          key={list.id}
          list={list}
          deleteList={deleteList}
          updateListTitle={updateListTitle}
          addCard={addCard}
          moveCard={moveCard}
        />
      ))}

      {/* Add List Card */}
      <div
        onClick={addList}
        className="w-72 h-fit bg-white/60 backdrop-blur-md 
                   border border-white/40 shadow-lg 
                   rounded-2xl p-4 cursor-pointer 
                   hover:bg-white/80 transition"
      >
        <p className="text-gray-700 font-semibold">
          + Add another list
        </p>
      </div>

    </div>

  </div>
)
}

export default Board