export default function AvatarUpload({
  avatarPreview,
  avatarUploading,
  fileInputRef,
  handleAvatarSelect,
  removeAvatar
}) {
  return (
    <div className="flex flex-col items-center mb-2">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Profile Picture (Optional)</label>
      <div className="relative group">
        <div
          onClick={() => !avatarUploading && fileInputRef.current?.click()}
          className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200
            ${avatarPreview
              ? "border-primary-300 bg-primary-50"
              : "border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50"
            } ${avatarUploading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
          )}
          {avatarUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {avatarPreview && !avatarUploading && (
          <button
            type="button"
            onClick={removeAvatar}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
            title="Remove avatar"
          >
            ✕
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarSelect}
        className="hidden"
      />
      <p className="text-[10px] text-slate-400 mt-2">Click to upload • Max 5MB</p>
    </div>
  )
}
