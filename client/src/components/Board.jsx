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
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex gap-6 items-start">

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

        <button
          onClick={addList}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          + Add List
        </button>

      </div>
    </div>
  )
}

export default Board