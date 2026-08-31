import {
  useState,
} from 'react'

import {
  Eye,
  EyeOff,
} from 'lucide-react'

import {
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { getRoleHome } from '../../routes/RoleRedirect'

import TumbuhLogo from '../../components/common/TumbuhLogo'


export default function LoginPage() {
  const navigate = useNavigate()

  const {
    user,
    login,
  } = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)


  if (user) {
    return (
      <Navigate
        to={getRoleHome(user.role)}
        replace
      />
    )
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const loggedUser =
        await login(
          email,
          password
        )

      navigate(
        getRoleHome(loggedUser.role),
        {
          replace: true,
        }
      )

    } catch (err) {
      setError(
        err.response?.data?.message ??
        'Email atau password tidak sesuai.'
      )

    } finally {
      setLoading(false)
    }
  }


  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-tumbuh-bg
        to-cyan-50

        sm:flex
        sm:items-center
        sm:justify-center
        sm:px-6
        sm:py-10
      "
    >

      <section
        className="
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[430px]
          flex-col
          justify-center
          px-6
          py-10

          sm:min-h-0
          sm:max-w-[460px]
          sm:rounded-[36px]
          sm:bg-white
          sm:px-10
          sm:py-12
          sm:shadow-[0_20px_70px_rgba(39,122,67,0.10)]
        "
      >

        {/* BRAND */}
        <div
          className="
            mb-10
            flex
            flex-col
            items-center
            text-center
          "
        >

          <TumbuhLogo
            size="lg"
            className="mb-5"
          />

          <h1
            className="
              text-[28px]
              font-semibold
              tracking-tight
              text-tumbuh-text

              sm:text-[32px]
            "
          >
            Selamat datang!
          </h1>

          <p
            className="
              mt-2
              max-w-[310px]
              text-sm
              leading-6
              text-tumbuh-muted
            "
          >
            Masuk untuk mulai belajar,
            berkolaborasi, dan tumbuh
            bersama proyek nyata.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"

              value={email}

              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }

              placeholder="nama@email.com"

              className="
                h-14
                w-full
                rounded-2xl
                border
                border-tumbuh-border
                bg-white
                px-4
                text-sm
                outline-none
                transition

                placeholder:text-gray-400

                focus:border-tumbuh-green
                focus:ring-4
                focus:ring-tumbuh-green/15
              "
            />
          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Password
            </label>

            <div className="relative">

              <input
                id="password"

                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                required
                autoComplete="current-password"

                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }

                placeholder="Masukkan password"

                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-tumbuh-border
                  bg-white
                  px-4
                  pr-12
                  text-sm
                  outline-none
                  transition

                  placeholder:text-gray-400

                  focus:border-tumbuh-green
                  focus:ring-4
                  focus:ring-tumbuh-green/15
                "
              />


              <button
                type="button"

                aria-label={
                  showPassword
                    ? 'Sembunyikan password'
                    : 'Tampilkan password'
                }

                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }

                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-tumbuh-muted
                "
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50
                px-4
                py-3
                text-sm
                leading-5
                text-red-600
              "
            >
              {error}
            </div>
          )}


          {/* LOGIN */}

          <button
            type="submit"
            disabled={loading}

            className="
              flex
              h-14
              w-full
              items-center
              justify-center

              rounded-2xl

              bg-tumbuh-green

              font-semibold
              text-white

              shadow-[0_8px_22px_rgba(108,216,135,0.30)]

              transition

              hover:bg-tumbuh-green-dark

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? 'Memproses...'
              : 'Masuk'}
          </button>

        </form>


        {/* FOOTER */}

        <p
          className="
            mt-8
            text-center
            text-xs
            leading-5
            text-tumbuh-muted
          "
        >
          Satu ruang untuk siswa,
          UMKM, dan pembimbing tumbuh
          bersama.
        </p>

      </section>

    </main>
  )
}