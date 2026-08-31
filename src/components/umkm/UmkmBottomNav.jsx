import {
  Folder,
  House,
  Sparkles,
  UserRound,
} from 'lucide-react'

import {
  NavLink,
} from 'react-router-dom'


const menuItems = [
  {
    label: 'Home',
    to: '/umkm',
    icon: House,
    end: true,
  },

  {
    label: 'Imagine',
    to: '/umkm/project-builder',
    icon: Sparkles,
  },

  {
    label: 'Proyek Saya',
    to: '/umkm/projects',
    icon: Folder,
  },

  {
    label: 'Profile',
    to: '/umkm/profile',
    icon: UserRound,
  },
]


export default function UmkmBottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50

        border-t
        border-gray-100

        bg-white/95

        backdrop-blur-lg
      "
    >

      <div
        className="
          mx-auto

          grid
          w-full
          max-w-[430px]
          grid-cols-4

          px-3
          pb-[max(12px,env(safe-area-inset-bottom))]
          pt-2

          md:max-w-4xl
          md:px-10
        "
      >

        {menuItems.map(
          ({
            label,
            to,
            icon: Icon,
            end,
          }) => (

            <NavLink
              key={to}

              to={to}

              end={end}

              className={({
                isActive,
              }) => `
                flex
                flex-col
                items-center
                justify-center

                gap-1

                py-2

                text-[9px]

                transition

                ${
                  isActive
                    ? `
                      font-semibold
                      text-gray-900
                    `
                    : `
                      text-gray-400
                    `
                }
              `}
            >

              {({
                isActive,
              }) => (
                <>
                  <div
                    className={`
                      flex
                      h-8
                      w-10
                      items-center
                      justify-center

                      rounded-xl

                      ${
                        isActive
                          ? `
                            bg-green-50
                            text-tumbuh-green-dark
                          `
                          : ''
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      strokeWidth={
                        isActive
                          ? 2.3
                          : 1.8
                      }
                    />
                  </div>

                  <span>
                    {label}
                  </span>
                </>
              )}

            </NavLink>

          )
        )}

      </div>

    </nav>
  )
}