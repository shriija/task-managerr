import { useState } from "react";
import { useNavigate } from "react-router";

function UserDashboard() {

  const navigate = useNavigate()

  const [boards, setBoards] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Marketing Plan" },
    { id: 3, name: "Personal Tasks" }
  ])

  return (
    <div className="min-h-screen flex bg-background-light">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 hidden lg:block">
        <h2 className="font-bold text-xl mb-6">TaskHub</h2>

        <button
          onClick={() => navigate("/create-board")}
          className="w-full bg-primary text-white py-2 rounded-lg mb-6"
        >
          + Create Board
        </button>

        <p className="text-sm text-gray-500 mb-2">Boards</p>

        {boards.map((b) => (
          <div key={b.id} onClick={()=> navigate(`/board/${b.id}`)} className="p-2 rounded hover:bg-gray-100 cursor-pointer">
            {b.name}
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        <h1 className="text-3xl font-black mb-8 mt-23">My Boards</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Create New Board Card */}
          <div
            onClick={() => navigate("/create-board")}
            className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
          >
            <span className="text-4xl">+</span>
            <p className="font-bold mt-2">Create Board</p>
          </div>

          {/* Dynamic Boards */}
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={()=>navigate(`/board/${board.id}`)}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer"
            >
              <h3 className="font-bold text-lg">{board.name}</h3>
              <p className="text-xs text-gray-400 mt-2">Updated just now</p>
            </div>
          ))}

        </div>

      </main>

    </div>
  )
}

export default UserDashboard;