import { useState, useEffect, useRef } from "react"
import { useBoardStore } from "../context/BoardContext"

function InviteModal({ boardId, onClose }) {
  const [tab, setTab] = useState("email") // "email" | "link"

  // ── Email tab state ──────────────────────────────────────────
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState(null) // { type: "success"|"error", msg }
  const [emailLoading, setEmailLoading] = useState(false)

  // ── Link tab state ───────────────────────────────────────────
  const [inviteLink, setInviteLink] = useState("")
  const [linkLoading, setLinkLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const { inviteByEmail, generateInviteLink } = useBoardStore()
  const emailRef = useRef(null)

  // Focus email input when modal opens
  useEffect(() => {
    if (tab === "email") emailRef.current?.focus()
  }, [tab])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // ── Handlers ────────────────────────────────────────────────
  const handleInviteByEmail = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setEmailLoading(true)
    setEmailStatus(null)
    try {
      const result = await inviteByEmail(boardId, email.trim())
      setEmailStatus({ type: "success", msg: result.message })
      setEmail("")
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong"
      setEmailStatus({ type: "error", msg })
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setLinkLoading(true)
    try {
      const data = await generateInviteLink(boardId)
      setInviteLink(data.link)
    } catch (err) {
      console.error(err)
    } finally {
      setLinkLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    // ── Backdrop ───────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Modal card ─────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
        style={{ animation: "fadeInUp 0.22s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">Invite to Board</h2>
              <p className="text-xs text-gray-400 mt-0.5">Add collaborators to this board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {[
            { id: "email", label: "Add by Email", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            )},
            { id: "link", label: "Share Link", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            )},
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-6 py-5">

          {/* ── Email Tab ─────────────────────────────────────── */}
          {tab === "email" && (
            <form onSubmit={handleInviteByEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Member's Login Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailStatus(null) }}
                  placeholder="colleague@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             placeholder-gray-400 focus:outline-none focus:ring-2
                             focus:ring-primary-200 focus:border-primary-400
                             transition-all bg-gray-50/50"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Enter the email they used to register an account.
                </p>
              </div>

              {/* Feedback banner */}
              {emailStatus && (
                <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
                  emailStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {emailStatus.type === "success" ? (
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  )}
                  <span>{emailStatus.msg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!email.trim() || emailLoading}
                className="w-full bg-linear-to-r from-primary-500 to-primary-600
                           hover:from-primary-600 hover:to-primary-700
                           disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                           text-white text-sm font-semibold py-3 rounded-xl
                           shadow-sm hover:shadow-md transition-all duration-200
                           flex items-center justify-center gap-2"
              >
                {emailLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    Add Member
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Link Tab ──────────────────────────────────────── */}
          {tab === "link" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Generate a link and share it with anyone who has an account. They'll be added as a member when they open it.
              </p>

              {!inviteLink ? (
                <button
                  onClick={handleGenerateLink}
                  disabled={linkLoading}
                  className="w-full bg-linear-to-r from-violet-500 to-indigo-600
                             hover:from-violet-600 hover:to-indigo-700
                             disabled:opacity-60 disabled:cursor-not-allowed
                             text-white text-sm font-semibold py-3 rounded-xl
                             shadow-sm hover:shadow-md transition-all duration-200
                             flex items-center justify-center gap-2"
                >
                  {linkLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      Generate Invite Link
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Link display box */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    <p className="text-xs text-gray-600 truncate flex-1 font-mono">{inviteLink}</p>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className={`w-full text-sm font-semibold py-3 rounded-xl transition-all duration-200
                      flex items-center justify-center gap-2
                      ${copied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-linear-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md"
                      }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Link expires in 7 days · anyone with an account can join
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InviteModal
