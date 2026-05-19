import { useState, useEffect } from "react"
import { useBoardStore } from "../context/BoardContext"

function TrashView({ boardId }) {
  const fetchDeletedListsAndCards = useBoardStore(s => s.fetchDeletedListsAndCards)
  const deletedLists = useBoardStore(s => s.deletedLists)
  const deletedCards = useBoardStore(s => s.deletedCards)
  const restoreList = useBoardStore(s => s.restoreList)
  const permanentDeleteList = useBoardStore(s => s.permanentDeleteList)
  const restoreCard = useBoardStore(s => s.restoreCard)
  const permanentDeleteCard = useBoardStore(s => s.permanentDeleteCard)

  const [activeTab, setActiveTab] = useState("cards")

  useEffect(() => {
    if (boardId) {
      fetchDeletedListsAndCards(boardId)
    }
  }, [boardId, fetchDeletedListsAndCards])

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("cards")}
            className={`pb-3 font-semibold transition-colors ${activeTab === "cards" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Deleted Cards
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`pb-3 font-semibold transition-colors ${activeTab === "lists" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Deleted Lists
          </button>
        </div>

        {/* Content */}
        {activeTab === "cards" && (
          <div className="space-y-4">
            {deletedCards.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No deleted cards found.</p>
            ) : (
              deletedCards.map(card => (
                <div key={card._id} className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                  <div>
                    <h4 className="font-semibold text-gray-800 line-through decoration-red-300">{card.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">Deleted on {new Date(card.deletedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => restoreCard(card._id, boardId)} className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">Restore</button>
                    <button onClick={() => permanentDeleteCard(card._id)} className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete Forever</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "lists" && (
          <div className="space-y-4">
            {deletedLists.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No deleted lists found.</p>
            ) : (
              deletedLists.map(list => (
                <div key={list._id} className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                  <div>
                    <h4 className="font-semibold text-gray-800 line-through decoration-red-300">{list.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">Deleted on {new Date(list.deletedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => restoreList(list._id, boardId)} className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">Restore</button>
                    <button onClick={() => permanentDeleteList(list._id)} className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete Forever</button>
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
