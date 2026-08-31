import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const {
    user,
    logout,
  } = useAuth()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Halo, {user?.name}
      </h1>

      <p className="mt-2 text-tumbuh-muted">
        Dashboard Admin TUMBUH
      </p>

      <button
        onClick={logout}
        className="mt-6 rounded-xl bg-tumbuh-green px-5 py-3 font-semibold text-white"
      >
        Logout
      </button>
    </main>
  )
}