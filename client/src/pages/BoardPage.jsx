import { useParams } from "react-router"
import { useState } from "react"

function BoardPage() {

  const { id } = useParams()

  const [board] = useState({
    title: "Marketing Launch Q4",
    members: [
      "https://i.pravatar.cc/40?img=1",
      "https://i.pravatar.cc/40?img=2",
      "https://i.pravatar.cc/40?img=3"
    ]
  })

  const [lists, setLists] = useState([
    {
      _id: 1,
      title: "To Do",
      cards: [
        { _id: 11, title: "Design System Update", priority: "High" },
        { _id: 12, title: "Content Strategy Q4" }
      ]
    },
    {
      _id: 2,
      title: "In Progress",
      cards: [
        { _id: 21, title: "User Interview Synthesis" }
      ]
    }
  ])

  const addList = () => {
    const newList = {
      _id: Date.now(),
      title: "New List",
      cards: []
    }
    setLists([...lists, newList])
  }

  return (
    <div className="flex h-screen bg-background-light">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col p-6">
        <h1 className="font-bold text-xl mb-8">TaskHub</h1>

        <nav className="space-y-2 text-sm">
          <p className="text-primary font-semibold">Boards</p>
          <p className="text-gray-500">My Tasks</p>
          <p className="text-gray-500">Calendar</p>
        </nav>

        <button className="mt-auto bg-primary text-white py-2 rounded-lg">
          + New Project
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">

          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg">{board.title}</h2>

            <div className="flex -space-x-2">
              {board.members.map((m, i) => (
                <img
                  key={i}
                  src={m}
                  className="w-8 h-8 rounded-full border"
                />
              ))}
            </div>
          </div>

          <input
            placeholder="Search tasks..."
            className="border rounded-lg px-3 py-1"
          />

        </header>

        {/* BOARD CANVAS */}
        <div className="flex-1 overflow-x-auto p-8">

          <div className="flex gap-6 items-start min-w-max">

            {lists.map(list => (
              <div
                key={list._id}
                className="w-80 bg-white rounded-xl shadow p-4 flex flex-col max-h-[80vh]"
              >

                {/* LIST HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{list.title}</h3>
                  <span className="text-xs bg-gray-200 px-2 rounded-full">
                    {list.cards.length}
                  </span>
                </div>

                {/* CARDS */}
                <div className="flex-1 overflow-y-auto space-y-3">

                  {list.cards.map(card => (
                    <div
                      key={card._id}
                      className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow"
                    >
                      {card.priority && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {card.priority}
                        </span>
                      )}

                      <p className="font-medium mt-1">{card.title}</p>
                    </div>
                  ))}

                </div>

                {/* ADD CARD */}
                <button className="mt-3 text-sm text-primary">
                  + Add Card
                </button>

              </div>
            ))}

            {/* ADD LIST */}
            <button
              onClick={addList}
              className="w-80 h-20 border-2 border-dashed rounded-xl text-gray-500 hover:border-primary hover:text-primary"
            >
              + Add Column
            </button>

          </div>

        </div>

      </main>

    </div>
  )
}

export default BoardPage