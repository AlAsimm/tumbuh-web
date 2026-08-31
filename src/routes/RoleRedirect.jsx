import { Navigate } from 'react-router-dom'

export function getRoleHome(role) {
  switch (role) {
    case 'siswa':
      return '/student'

    case 'umkm':
      return '/umkm'

    case 'guru':
      return '/teacher'

    case 'admin':
      return '/admin'

    default:
      return '/login'
  }
}

export default function RoleRedirect({ user }) {
  return (
    <Navigate
      to={getRoleHome(user?.role)}
      replace
    />
  )
}