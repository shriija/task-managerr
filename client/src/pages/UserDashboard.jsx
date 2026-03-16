import { useState } from "react";

function UserDashboard() {

  const [boards, setBoards] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Marketing Plan" },
    { id: 3, name: "Personal Tasks" }
  ])

  const [showModal, setShowModal] = useState(false)
  const [boardName, setBoardName] = useState("")

  const createBoard = () => {
    if (!boardName.trim()) return

    const newBoard = {
      id: Date.now(),
      name: boardName
    }

    setBoards([...boards, newBoard])
    setBoardName("")
    setShowModal(false)
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <button
        onClick={() => setShowModal(true)}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-4">Create Board</h2>

            <input
              type="text"
              placeholder="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={createBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserDashboard;