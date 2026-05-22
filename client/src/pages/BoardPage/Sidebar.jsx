import { useNavigate } from "react-router"

export default function Sidebar({ id, currentView, addList, board }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex-col p-6 hidden lg:flex">
      <nav className="space-y-1 text-sm">
        <button 
          onClick={() => navigate(`/board/${id}/board`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            currentView === "board" 
              ? "bg-primary-50 text-primary-600 font-semibold" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Lists
        </button>
        <button 
          onClick={() => navigate(`/board/${id}/my-tasks`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            currentView === "my-tasks"
              ? "bg-primary-50 text-primary-600 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          My Tasks
        </button>
        <button 
          onClick={() => navigate(`/board/${id}/calendar`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            currentView === "calendar"
              ? "bg-primary-50 text-primary-600 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Calendar
        </button>
        <button 
          onClick={() => navigate(`/board/${id}/activity`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            currentView === "activity"
              ? "bg-primary-50 text-primary-600 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activity Logs
        </button>
        <button 
          onClick={() => navigate(`/board/${id}/trash`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            currentView === "trash"
              ? "bg-red-50 text-red-600 font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Trash
        </button>
      </nav>
      <button
        onClick={() => addList(board?._id || "local", "New List")}
        className="mt-3.5 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="text-lg leading-none">+</span>
        New List
      </button>
    </aside>
  );
}
