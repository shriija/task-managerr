import { useState } from "react";

function UserDashboard() {

  const [boards, setBoards] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Marketing Plan" },
    { id: 3, name: "Personal Tasks" }
  ])

  const createBoard = () => {
    const boardName = prompt("Enter board name:")

    if (!boardName) return;

    const newBoard = {
      id: Date.now(),
      name: boardName
    }

    setBoards([...boards, newBoard]);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <button
        onClick={createBoard}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-8"
      >
        + Create Board
      </button>

      <div className="grid grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-white shadow-md p-6 rounded-xl cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{board.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserDashboard;