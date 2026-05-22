import { useState, useRef } from "react"
import axios from "axios"
import { API_URL } from "../services/api"
import toast from "react-hot-toast"

function AttachmentsSection({ card, canEdit, onCardUpdate }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const attachments = card?.attachments || []

  const formatSize = (bytes) => {
    if (!bytes) return ""
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileIcon = (type) => {
    if (!type) return "📄"
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📕"
    if (type.includes("word") || type.includes("document")) return "📘"
    if (type.includes("sheet") || type.includes("excel")) return "📊"
    if (type.includes("presentation") || type.includes("powerpoint")) return "📙"
    if (type.includes("zip") || type.includes("rar")) return "📦"
    return "📄"
  }

  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    if (files.length > 5) { toast.error("Max 5 files at a time"); return }

    const formData = new FormData()
    for (const f of files) formData.append("files", f)

    try {
      setUploading(true)
      const res = await axios.post(
        `${API_URL}/card-api/attachments/${card._id}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      onCardUpdate(res.data.payload)
      toast.success("Files uploaded!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const handleDelete = async (attachmentId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/card-api/attachments/${card._id}/${attachmentId}`,
        { withCredentials: true }
      )
      onCardUpdate(res.data.payload)
      toast.success("Attachment removed")
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  if (attachments.length === 0 && !canEdit) return null

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
          Attachments ({attachments.length})
        </label>
        {canEdit && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Add Files"}
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" multiple onChange={handleUpload} className="hidden" />

      {attachments.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {attachments.map((att) => (
            <div key={att._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
              <span className="text-sm shrink-0">{getFileIcon(att.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{att.name}</p>
                <p className="text-[10px] text-gray-400">{formatSize(att.size)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a href={att.url} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-medium text-primary-600 hover:text-primary-700 px-1.5 py-0.5 rounded hover:bg-primary-50 transition-colors"
                  onClick={(e) => e.stopPropagation()}>View</a>
                <a href={att.url} download={att.name} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-medium text-gray-500 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}>↓</a>
                {canEdit && (
                  <button onClick={() => handleDelete(att._id)}
                    className="text-gray-300 hover:text-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-primary-50 rounded-xl">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-primary-600 font-medium">Uploading files...</span>
        </div>
      )}
    </div>
  )
}

export default AttachmentsSection
