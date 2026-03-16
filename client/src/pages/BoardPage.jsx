import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router"

function BoardPage() {

  const { id } = useParams()

  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)

  const getBoard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4001/board-api/${id}`,
        {
          withCredentials: true
        }
      )

      setBoard(res.data.payload)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBoard()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading board...
      </div>
    )
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Board not found
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: board.background
      }}
    >

      {/* Board Header */}
      <div className="bg-white/80 backdrop-blur p-4 rounded-xl mb-6 flex justify-between items-center">

        <h1 className="text-2xl font-black">
          {board.title}
        </h1>

        <button className="bg-white px-4 py-2 rounded shadow">
          Invite
        </button>

      </div>

      {/* Lists Container (Future DragDrop Area) */}
      <div className="flex gap-4 overflow-x-auto">

        {/* Placeholder */}
        <div className="bg-white/70 rounded-xl p-4 w-72 h-40 flex items-center justify-center">
          No lists yet
        </div>

        {/* Add List Button */}
        <div className="bg-white/40 rounded-xl p-4 w-72 h-40 flex items-center justify-center cursor-pointer hover:bg-white/60">
          + Add List
        </div>

      </div>

    </div>
  )
}

export default BoardPage