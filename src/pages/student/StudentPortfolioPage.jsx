import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  QrCode,
  Star,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import PortfolioProjectCard
  from '../../components/student/PortfolioProjectCard'

import PortfolioQrModal
  from '../../components/student/PortfolioQrModal'


function unwrapPortfolios(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.portfolios
    )
  ) {
    return data.portfolios
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data
  }

  return []
}


export default function StudentPortfolioPage() {
  const navigate = useNavigate()

  const {
    user,
  } = useAuth()


  const [
    portfolios,
    setPortfolios,
  ] = useState([])

  const [
    selectedPortfolio,
    setSelectedPortfolio,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const loadPortfolios =
      async () => {

        setLoading(true)
        setError('')

        try {
          const response =
            await api.get(
              '/my-portfolios'
            )

          setPortfolios(
            unwrapPortfolios(
              response.data
            )
          )

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Portofolio belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }

    loadPortfolios()
  }, [])


  const reviews =
    useMemo(() => {
      return portfolios
        .map(
          (portfolio) =>
            portfolio.project
              ?.review ??
            portfolio.review
        )
        .filter(Boolean)
    }, [portfolios])


  const averageRating =
    useMemo(() => {

      const ratings =
        reviews
          .map(
            (review) =>
              Number(
                review.rating
              )
          )
          .filter(
            (rating) =>
              rating > 0
          )


      if (!ratings.length) {
        return null
      }


      return (
        ratings.reduce(
          (total, rating) =>
            total + rating,
          0
        ) /
        ratings.length
      ).toFixed(1)

    }, [reviews])


  const profile =
    user?.smk_profile ??
    user?.smkProfile


  const studentName =
    user?.name ??
    'Siswa TUMBUH'


  const initials =
    studentName
      .split(' ')
      .map((part) =>
        part.charAt(0)
      )
      .slice(0, 2)
      .join('')
      .toUpperCase()


  return (
    <StudentAppShell>

      {/* HEADER */}

      <header
        className="
          flex
          items-center
          gap-3
        "
      >

        <button
          type="button"

          onClick={() =>
            navigate(-1)
          }

          className="
            flex
            h-10
            w-10

            items-center
            justify-center

            rounded-full

            bg-white

            shadow-sm
          "
        >
          <ArrowLeft size={20} />
        </button>


        <div>

          <h1
            className="
              text-xl
              font-semibold
            "
          >
            Portofolio Digital
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              text-gray-400
            "
          >
            Rekam jejak proyek
            terverifikasi
          </p>

        </div>

      </header>


      {/* PROFILE */}

      <section
        className="
          mt-6

          rounded-[30px]

          bg-white

          p-5

          shadow-[0_10px_35px_rgba(0,0,0,0.035)]
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0

              items-center
              justify-center

              rounded-full

              bg-blue-100

              text-lg
              font-semibold
              text-blue-600
            "
          >
            {initials}
          </div>


          <div className="min-w-0">

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <h2
                className="
                  text-base
                  font-semibold
                "
              >
                {studentName}
              </h2>


              <BadgeCheck
                size={16}
                className="
                  fill-green-100
                  text-tumbuh-green-dark
                "
              />

            </div>


            <p
              className="
                mt-1
                text-[10px]
                text-gray-400
              "
            >
              {profile?.nama_sekolah ??
                'SMK TUMBUH'}
            </p>


            <div
              className="
                mt-2
                flex
                flex-wrap
                gap-1.5
              "
            >

              {profile?.jurusan && (
                <span
                  className="
                    rounded-full
                    bg-cyan-100

                    px-2
                    py-1

                    text-[8px]
                    font-medium
                    text-blue-500
                  "
                >
                  {profile.jurusan}
                </span>
              )}


              <span
                className="
                  rounded-full
                  bg-green-100

                  px-2
                  py-1

                  text-[8px]
                  font-medium
                  text-green-700
                "
              >
                Verified Profile
              </span>

            </div>

          </div>

        </div>


        {/* STATS */}

        <div
          className="
            mt-6
            grid
            grid-cols-3
            gap-3
          "
        >

          <PortfolioStat
            icon={BriefcaseBusiness}
            value={portfolios.length}
            label="Proyek"
          />


          <PortfolioStat
            icon={Star}
            value={
              averageRating ??
              '-'
            }
            label="Rating"
          />


          <PortfolioStat
            icon={QrCode}
            value={portfolios.length}
            label="Verified"
          />

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-5

            rounded-2xl

            bg-red-50

            p-4

            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* PROJECTS */}

      <section className="mt-8">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Proyek Terverifikasi
          </h2>


          <span
            className="
              text-xs
              font-semibold
              text-tumbuh-green-dark
            "
          >
            {portfolios.length}
          </span>

        </div>


        {loading ? (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >
            <p
              className="
                animate-pulse
                font-semibold
                text-tumbuh-green-dark
              "
            >
              Memuat portofolio...
            </p>
          </div>

        ) : portfolios.length > 0 ? (

          <div
            className="
              mt-5

              grid
              grid-cols-1

              gap-4

              md:grid-cols-2
            "
          >

            {portfolios.map(
              (portfolio) => (
                <PortfolioProjectCard
                  key={
                    portfolio.id
                  }

                  portfolio={
                    portfolio
                  }

                  onShowQr={
                    setSelectedPortfolio
                  }
                />
              )
            )}

          </div>

        ) : (

          <EmptyPortfolio />

        )}

      </section>


      {/* QR MODAL */}

      {selectedPortfolio && (
        <PortfolioQrModal
          portfolio={
            selectedPortfolio
          }

          studentName={
            studentName
          }

          onClose={() =>
            setSelectedPortfolio(
              null
            )
          }
        />
      )}

    </StudentAppShell>
  )
}


function PortfolioStat({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div
      className="
        rounded-2xl

        bg-tumbuh-bg

        px-2
        py-4

        text-center
      "
    >

      <Icon
        size={17}
        className="
          mx-auto
          text-tumbuh-green-dark
        "
      />


      <strong
        className="
          mt-2
          block
          text-lg
        "
      >
        {value}
      </strong>


      <span
        className="
          text-[8px]
          text-gray-400
        "
      >
        {label}
      </span>

    </div>
  )
}


function EmptyPortfolio() {
  return (
    <div
      className="
        mt-5

        rounded-[28px]

        border
        border-dashed
        border-gray-300

        bg-white/70

        px-6
        py-12

        text-center
      "
    >

      <img
        src="/assets/logo-tumbuh.png"
        alt=""
        className="
          mx-auto
          h-16
          w-16
          object-contain
          opacity-70
        "
      />


      <h3
        className="
          mt-5
          text-sm
          font-semibold
        "
      >
        Belum ada portofolio
      </h3>


      <p
        className="
          mx-auto
          mt-2
          max-w-xs

          text-xs
          leading-5
          text-gray-400
        "
      >
        Proyek yang selesai dan
        diterima UMKM akan otomatis
        masuk ke portofolio digitalmu.
      </p>

    </div>
  )
}