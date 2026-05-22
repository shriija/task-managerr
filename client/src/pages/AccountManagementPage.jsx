import React, { useState } from "react"
import { useAuthStore } from "../context/AuthContext"
import { GoogleLogin } from "@react-oauth/google"
import toast from "react-hot-toast"

/**
 * AccountManagementPage Component
 * 
 * Placeholder page for future account management features (e.g., updating profile, changing password).
 * Currently displays an "under construction" message.
 */
function AccountManagementPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const changePassword = useAuthStore((state) => state.changePassword)
  const loading = useAuthStore((state) => state.loading)

  // Username States
  const [username, setUsername] = useState(currentUser?.name || "")
  const [isEditingUsername, setIsEditingUsername] = useState(false)

  // Password States
  const [passwordMode, setPasswordMode] = useState("credentials") // "credentials" or "google"
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [googleVerifyToken, setGoogleVerifyToken] = useState(null)

  // General Security settings
  const isGoogleUser = currentUser?.isGoogleUser || false
  const hasPasswordSet = currentUser?.hasPasswordSet !== false

  // Handle Username update
  const handleUsernameUpdate = async (e) => {
    e.preventDefault()
    if (username.trim().length < 2) {
      toast.error("Name must be at least 2 characters long")
      return
    }

    const result = await updateProfile(username)
    if (result.success) {
      toast.success("Profile username updated successfully!")
      setIsEditingUsername(false)
    } else {
      toast.error(result.error || "Failed to update profile username")
    }
  }

  // Handle Password creation/change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    const payload = {
      newPassword,
    }

    if (!hasPasswordSet || passwordMode === "google") {
      if (!googleVerifyToken) {
        toast.error("Please authenticate with Google first")
        return
      }
      payload.googleToken = googleVerifyToken
    } else {
      if (!oldPassword) {
        toast.error("Please enter your current password")
        return
      }
      payload.oldPassword = oldPassword
    }

    const result = await changePassword(payload)
    if (result.success) {
      toast.success("Password changed successfully!")
      // Clear fields
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setGoogleVerifyToken(null)
    } else {
      toast.error(result.error || "Failed to update password")
    }
  }

  // Helper to decode JWT on the frontend
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Failed to decode JWT:", error)
      return null
    }
  }

  // Handle Google authentication in settings
  const onGoogleVerifySuccess = (credentialResponse) => {
    const decoded = decodeJwt(credentialResponse.credential)
    if (!decoded || !decoded.email) {
      toast.error("Failed to read email from verified Google account.")
      return
    }

    if (decoded.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      toast.error(`Verification failed: Verified Google email (${decoded.email}) does not match your registered account email (${currentUser.email}).`)
      return
    }

    setGoogleVerifyToken(credentialResponse.credential)
    toast.success("Google account verified successfully! Enter your new password below.")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your identity, profile information, and account security.</p>
        </div>

        {/* Section 1: Profile Profile Details */}
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-8">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-xl font-bold text-white shadow-md uppercase">
                {currentUser?.name?.[0]}
              </div>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-slate-800">Profile Information</h2>
              <p className="text-slate-400 text-xs mt-0.5">Your email address and public display name.</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Email Address (ReadOnly) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">{currentUser?.email}</span>
                {isGoogleUser && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.997 0-.746-.08-1.32-.176-1.886H12.24z"/>
                    </svg>
                    Google Linked
                  </span>
                )}
              </div>
            </div>

            {/* Username display / Edit form */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username / Display Name</label>
              {isEditingUsername ? (
                <form onSubmit={handleUsernameUpdate} className="flex gap-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername(currentUser?.name || "")
                      setIsEditingUsername(false)
                    }}
                    className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl">
                  <span className="text-sm font-semibold text-slate-800">{currentUser?.name}</span>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    Change Name
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Account Security / Password Management */}
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-8">
          <div className="pb-6 border-b border-slate-100">
            <h2 className="font-display text-lg font-bold text-slate-800">Password & Security</h2>
            <p className="text-slate-400 text-xs mt-0.5">Secure your account credentials and manage access.</p>
          </div>

          <div className="mt-6 space-y-6">
            
            {/* Dynamic UI Case 1: Google login only (no password set yet) */}
            {!hasPasswordSet && (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                    You currently log in via <strong className="text-slate-900">Google Authentication</strong> and do not have an email/password credential configured.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    You can set an account password below to enable signing in using your email address and password alongside Google.
                  </p>
                </div>

                {!googleVerifyToken ? (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1: Authenticate with Google</label>
                    <div className="flex justify-start">
                      <GoogleLogin
                        onSuccess={onGoogleVerifySuccess}
                        onError={() => toast.error("Google authentication failed")}
                        theme="outline"
                        text="continue_with"
                        size="medium"
                      />
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200/50 rounded-xl">
                      <span className="text-xs text-green-700 font-semibold">Google Identity Verified! Create your password below.</span>
                      <button 
                        type="button" 
                        onClick={() => setGoogleVerifyToken(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showPasswords} 
                          onChange={() => setShowPasswords(!showPasswords)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                        />
                        Show Passwords
                      </label>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 shadow-md shadow-primary-500/10 cursor-pointer transition-all"
                      >
                        {loading ? "Saving..." : "Create Account Password"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Dynamic UI Case 2: User has a password set */}
            {hasPasswordSet && (
              <div className="space-y-6">
                
                {/* Method Toggles */}
                <div className="flex border-b border-slate-100 pb-px">
                  <button
                    onClick={() => {
                      setPasswordMode("credentials")
                      setGoogleVerifyToken(null)
                    }}
                    className={`pb-3 text-sm font-bold border-b-2 px-4 cursor-pointer transition-all ${
                      passwordMode === "credentials" 
                        ? "border-primary-600 text-primary-600" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Verify via Password
                  </button>
                  <button
                    onClick={() => setPasswordMode("google")}
                    className={`pb-3 text-sm font-bold border-b-2 px-4 cursor-pointer transition-all ${
                      passwordMode === "google" 
                        ? "border-primary-600 text-primary-600" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Verify via Google Account
                  </button>
                </div>

                {passwordMode === "credentials" ? (
                  /* Option A: Old password verification form */
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full sm:w-2/3 bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showPasswords} 
                          onChange={() => setShowPasswords(!showPasswords)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                        />
                        Show Passwords
                      </label>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 shadow-md shadow-primary-500/10 cursor-pointer transition-all"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Option B: Google authentication verification */
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Instead of entering your current password, you can verify your identity instantly by connecting with your Google account.
                    </p>

                    {!googleVerifyToken ? (
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1: Authenticate with Google</label>
                        <div className="flex justify-start">
                          <GoogleLogin
                            onSuccess={onGoogleVerifySuccess}
                            onError={() => toast.error("Google authentication failed")}
                            theme="outline"
                            text="continue_with"
                            size="medium"
                          />
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200/50 rounded-xl">
                          <span className="text-xs text-green-700 font-semibold">Google Identity Verified! Change your password below.</span>
                          <button 
                            type="button" 
                            onClick={() => setGoogleVerifyToken(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Password */}
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                            <input
                              type={showPasswords ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="At least 6 characters"
                              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                          {/* Confirm Password */}
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                            <input
                              type={showPasswords ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={showPasswords} 
                              onChange={() => setShowPasswords(!showPasswords)}
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                            />
                            Show Passwords
                          </label>
                          
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 shadow-md shadow-primary-500/10 cursor-pointer transition-all"
                          >
                            {loading ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default AccountManagementPage
