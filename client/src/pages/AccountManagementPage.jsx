import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "react-hot-toast"
import { useAuthStore } from "../context/AuthContext"

function AccountManagementPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const loading = useAuthStore((state) => state.loading)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const updatePassword = useAuthStore((state) => state.updatePassword)

  const profileForm = useForm({
    defaultValues: {
      name: "",
      username: ""
    }
  })

  const passwordForm = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    profileForm.reset({
      name: currentUser?.name || "",
      username: currentUser?.username || ""
    })
  }, [currentUser, profileForm])

  const onSaveProfile = async (values) => {
    const result = await updateProfile(values)
    if (result.success) {
      toast.success(result.message || "Profile updated")
    } else {
      toast.error(result.message || "Profile update failed")
    }
  }

  const onChangePassword = async (values) => {
    const result = await updatePassword(values)
    if (result.success) {
      toast.success(result.message || "Password updated")
      passwordForm.reset()
    } else {
      toast.error(result.message || "Password update failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Account</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Account Settings</h1>
            <p className="text-gray-500 mt-2">Update your profile details and keep your account information current.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Back to dashboard
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">Profile details</h2>
            <p className="text-sm text-gray-500 mt-1">Edit the name and username shown to your teammates.</p>

            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...profileForm.register("name")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  {...profileForm.register("username")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                  placeholder="Choose a username"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <p className="text-xs text-gray-400">Email: {currentUser?.email || "—"}</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">Change password</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a new password for your account.</p>

            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                <input
                  type="password"
                  {...passwordForm.register("oldPassword")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                  type="password"
                  {...passwordForm.register("newPassword")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                  placeholder="Enter a new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                <input
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                  placeholder="Repeat the new password"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AccountManagementPage
