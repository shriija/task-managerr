import { useState, useRef } from "react"
import axios from "axios"
import { API_URL } from "../services/api"
import { useAuthStore } from "../context/AuthContext"
import toast from "react-hot-toast"

function RemarksSection({ card, canEdit, onCardUpdate }) {
  const [showRemarks, setShowRemarks] = useState(false)
  const [text, setText] = useState("")
  const [posting, setPosting] = useState(false)
  const fileRef = useRef(null)
  const [files, setFiles] = useState([])
  const currentUser = useAuthStore(s => s.currentUser)
  const remarks = card?.remarks || []

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length > 5) { toast.error("Max 5 files"); return }
    setFiles(selected)
  }

  const handlePost = async () => {
    if (!text.trim() && files.length === 0) return
    try {
      setPosting(true)
      const formData = new FormData()
      formData.append("text", text.trim())
      for (const f of files) formData.append("files", f)
      const res = await axios.post(
        `${API_URL}/card-api/remarks/${card._id}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      onCardUpdate(res.data.payload)
      setText("")
      setFiles([])
      if (fileRef.current) fileRef.current.value = ""
      toast.success("Remark added")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add remark")
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (remarkId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/card-api/remarks/${card._id}/${remarkId}`,
        { withCredentials: true }
      )
      onCardUpdate(res.data.payload)
      toast.success("Remark deleted")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete remark")
    }
  }

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setShowRemarks(!showRemarks)}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-primary-500 transition-colors cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Remarks ({remarks.length})
        <svg className={`w-3 h-3 transition-transform ${showRemarks ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showRemarks && (
        <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden">
          {/* Existing remarks */}
          {remarks.length > 0 && (
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
              {remarks.map((r) => (
                <div key={r._id} className="p-3 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                      {r.author?.avatar
                        ? <img src={r.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        : (r.author?.name?.charAt(0).toUpperCase() || "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">{r.author?.name || "Unknown"}</span>
                        <span className="text-[10px] text-gray-400">{timeAgo(r.createdAt)}</span>
                        {(r.author?._id === currentUser?._id || canEdit) && (
                          <button onClick={() => handleDelete(r._id)}
                            className="ml-auto text-gray-300 hover:text-red-500 text-[10px] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                            Delete
                          </button>
                        )}
                      </div>
                      {r.text && <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{r.text}</p>}
                      {r.attachments?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {r.attachments.map((att) => (
                            <a key={att._id} href={att.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg hover:bg-primary-100 transition-colors">
                              {att.type?.startsWith("image/") ? "🖼️" : "📎"} {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {remarks.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-400">No remarks yet</div>
          )}

          {/* Add remark form */}
          <div className="border-t border-gray-100 p-3 bg-gray-50/50">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a remark..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all resize-none bg-white"
            />
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {files.map((f, i) => (
                  <span key={i} className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{f.name}</span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="text-gray-400 hover:text-primary-500 transition-colors cursor-pointer" title="Attach files">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                </button>
                <input ref={fileRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
              </div>
              <button
                type="button"
                onClick={handlePost}
                disabled={posting || (!text.trim() && files.length === 0)}
                className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RemarksSection
