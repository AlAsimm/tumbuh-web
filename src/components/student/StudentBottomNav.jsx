import {
  House,
  Search,
  Sparkles,
  Send,
  UserRound,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const menus = [
  {
    label: 'Home',
    path: '/student',
    icon: House,
    end: true,
  },
  {
    label: 'Explore',
    path: '/student/explore',
    icon: Search,
  },
  {
    label: 'Lamaran',
    path: '/student/applications',
    icon: Sparkles,
  },
  {
    label: 'Proyek Anda',
    path: '/student/projects',
    icon: Send,
  },
  {
    label: 'Profile',
    path: '/student/profile',
    icon: UserRound,
  },
]

export default function StudentBottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        w-full

        border-t
        border-gray-100

        bg-white/95

        shadow-[0_-8px_30px_rgba(0,0,0,0.04)]

        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[430px]
          grid-cols-5

          px-3
          pb-[max(10px,env(safe-area-inset-bottom))]
          pt-2

          md:max-w-4xl
          md:px-8
        "
      >
        {menus.map((menu) => {
          const Icon = menu.icon

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.end}
              className={({ isActive }) =>
                `
                  flex
                  min-h-[58px]
                  flex-col
                  items-center
                  justify-center
                  gap-1

                  rounded-2xl

                  text-[10px]

                  transition-all
                  duration-200

                  ${
                    isActive
                      ? 'font-semibold text-tumbuh-green-dark'
                      : 'text-gray-400 hover:text-gray-600'
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`
                      flex
                      h-8
                      w-10
                      items-center
                      justify-center
                      rounded-full

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? 'bg-tumbuh-green/15'
                          : ''
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      strokeWidth={
                        isActive
                          ? 2.4
                          : 1.8
                      }
                    />
                  </div>

                  <span>
                    {menu.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}