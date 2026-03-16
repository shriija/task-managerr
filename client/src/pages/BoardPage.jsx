import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"

function BoardPage() {

  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const createBoard = async () => {
    if (!title.trim()) return

    try {
      setLoading(true)

      const res = await axios.post(
        "http://localhost:4001/board-api/create",
        {
          title,
          background:"#0052cc"
        },
        {
          withCredentials:true
        }
      )

      const board = res.data.payload

      // ⭐ navigate to board page
      navigate(`/board/${board._id}`)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h1 className="text-2xl font-bold mb-6">Create New Board</h1>

        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Board title"
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={createBoard}
          className="w-full bg-primary text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Board"}
        </button>

      </div>

    </div>
  )
}

export default BoardPage