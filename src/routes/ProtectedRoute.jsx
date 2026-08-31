import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { getRoleHome } from './RoleRedirect'

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-semibold text-tumbuh-green-dark">
          TUMBUH...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getRoleHome(user.role)}
        replace
      />
    )
  }

  return children
}