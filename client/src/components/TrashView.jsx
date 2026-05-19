import { useState, useEffect } from "react"
import { useBoardStore } from "../context/BoardContext"

function TrashView({ boardId }) {
  const [activeTab, setActiveTab] = useState("cards")

  const deletedLists = useBoardStore(s => s.deletedLists)
  const deletedCards = useBoardStore(s => s.deletedCards)
  const fetchDeletedListsAndCards = useBoardStore(s => s.fetchDeletedListsAndCards)
  const restoreList = useBoardStore(s => s.restoreList)
  const permanentDeleteList = useBoardStore(s => s.permanentDeleteList)
  const restoreCard = useBoardStore(s => s.restoreCard)
  const permanentDeleteCard = useBoardStore(s => s.permanentDeleteCard)

  useEffect(() => {
    if (boardId) fetchDeletedListsAndCards(boardId)
  }, [boardId])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-gray-800 mb-1">Board Trash</h2>
        <p className="text-sm text-gray-500 mb-6">Deleted items can be restored or permanently removed.</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("cards")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "cards" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
          >
            Deleted Cards {deletedCards.length > 0 && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{deletedCards.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "lists" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
          >
            Deleted Lists {deletedLists.length > 0 && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{deletedLists.length}</span>}
          </button>
        </div>

        {/* Deleted Cards */}
        {activeTab === "cards" && (
          <div className="space-y-3">
            {deletedCards.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <p className="font-medium">No deleted cards</p>
              </div>
            ) : (
              deletedCards.map(card => (
                <div key={card._id} className="bg-white rounded-xl border border-red-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700 line-through decoration-red-300 truncate">{card.title}</p>
                    {card.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{card.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">Deleted {formatDate(card.deletedAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => restoreCard(card._id, boardId)}
                      className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >Restore</button>
                    <button
                      onClick={() => permanentDeleteCard(card._id)}
                      className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >Delete Forever</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Deleted Lists */}
        {activeTab === "lists" && (
          <div className="space-y-3">
            {deletedLists.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <p className="font-medium">No deleted lists</p>
              </div>
            ) : (
              deletedLists.map(list => (
                <div key={list._id} className="bg-white rounded-xl border border-red-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700 line-through decoration-red-300 truncate">{list.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Deleted {formatDate(list.deletedAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => restoreList(list._id, boardId)}
                      className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >Restore</button>
                    <button
                      onClick={() => permanentDeleteList(list._id)}
                      className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >Delete Forever</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrashView
