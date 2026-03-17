import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"

function CreateBoardPage() {

  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState("")

  const navigate = useNavigate()

  const createBoard = async () => {
    if (!title.trim()){ 
        setError("Board title is required") 
        return }

    try {
      setError("")
      setLoading(true)

      const res = await axios.post(
        "http://localhost:4001/board-api/addBoard",
        {
          title: title.trim(),
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

      setError(err?.response?.message || "Something went wrong while creating board")
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

        {error && (<p className="text-red-500 text-sm mb-2">{error}</p>)}

        <button
          disabled={loading}
          onClick={createBoard}
          className="p-2.5 rounded-xl hover:bg-primary-50 hover:text-primary-600
                       cursor-pointer text-sm text-gray-700 font-medium
                       transition-colors duration-150"
        >
          {loading ? "Creating..." : "Create Board"}
        </button>

      </div>

    </div>
  )
}

export default CreateBoardPage