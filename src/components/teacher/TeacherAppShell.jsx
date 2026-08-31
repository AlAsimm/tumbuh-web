import {
  Home,
  LogOut,
} from 'lucide-react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../../context/AuthContext'


export default function TeacherAppShell({
  children,
}) {
  const navigate =
    useNavigate()

  const {
    user,
    logout,
  } = useAuth()


  const handleLogout =
    async () => {
      try {
        await logout()
      } finally {
        navigate(
          '/login',
          {
            replace: true,
          }
        )
      }
    }


  return (
    <div
      className="
        min-h-screen
        bg-[#F9FCFB]
        text-[#252525]
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-screen
          max-w-[1600px]
        "
      >

        {/* DESKTOP SIDEBAR */}

        <aside
          className="
            hidden
            w-[240px]
            shrink-0
            border-r
            border-[#EAEFEC]
            bg-white
            px-8
            py-9
            lg:flex
            lg:flex-col
          "
        >

          <img
            src="/assets/logo-tumbuh.png"
            alt="TUMBUH"
            className="
              h-12
              w-auto
              object-contain
              object-left
            "
          />


          <nav
            className="
              mt-16
              space-y-3
            "
          >
            <TeacherNavItem
              to="/teacher"
              end
              icon={Home}
              label="Overview"
            />

            <TeacherDisabledItem
              label="Proyek saya"
            />

            <TeacherDisabledItem
              label="Mentee"
            />

            <TeacherDisabledItem
              label="Pesan"
            />

            <TeacherDisabledItem
              label="Setting"
            />
          </nav>


          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-auto
              flex
              items-center
              gap-3
              text-[15px]
              font-medium
              text-orange-500
            "
          >
            <LogOut size={18} />
            Log out
          </button>

        </aside>


        {/* MAIN */}

        <main
          className="
            min-w-0
            flex-1
          "
        >

          {/* MOBILE TOPBAR */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#EAEFEC]
              bg-white
              px-4
              py-4
              lg:hidden
            "
          >
            <img
              src="/assets/logo-tumbuh.png"
              alt="TUMBUH"
              className="
                h-9
                w-auto
              "
            />

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  hidden
                  text-[10px]
                  font-semibold
                  sm:block
                "
              >
                {user?.name ??
                  'Guru TUMBUH'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-red-500
                "
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>


          {children}

        </main>

      </div>
    </div>
  )
}


function TeacherNavItem({
  to,
  icon: Icon,
  label,
  end = false,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({
        isActive,
      }) => `
        flex
        items-center
        gap-4
        rounded-2xl
        px-3
        py-3
        text-[12px]
        font-medium
        transition

        ${
          isActive
            ? `
              text-[#65D98A]
            `
            : `
              text-gray-400
            `
        }
      `}
    >
      <Icon size={18} />

      <span className="flex-1">
        {label}
      </span>

      {label === 'Overview' && (
        <span
          className="
            h-2
            w-2
            rounded-full
            bg-[#65D98A]
          "
        />
      )}
    </NavLink>
  )
}


function TeacherDisabledItem({
  label,
}) {
  return (
    <button
      type="button"
      disabled
      className="
        flex
        w-full
        items-center
        gap-4
        rounded-2xl
        px-3
        py-3
        text-left
        text-[12px]
        font-medium
        text-gray-300
      "
    >
      <span
        className="
          h-[18px]
          w-[18px]
          rounded-md
          border
          border-gray-300
        "
      />

      {label}
    </button>
  )
}
