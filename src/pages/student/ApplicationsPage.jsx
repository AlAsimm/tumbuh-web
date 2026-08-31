import {
  ArrowLeft,
  Search,
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

import StudentAppShell
  from '../../components/student/StudentAppShell'

import ApplicationCard
  from '../../components/student/ApplicationCard'


function unwrapApplications(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.applications
    )
  ) {
    return data.applications
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


const tabs = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Pending',
    value: 'diajukan',
  },
  {
    label: 'Diterima',
    value: 'dipilih',
  },
  {
    label: 'Ditolak',
    value: 'ditolak',
  },
]


export default function ApplicationsPage() {
  const navigate = useNavigate()

  const [
    applications,
    setApplications,
  ] = useState([])

  const [
    activeTab,
    setActiveTab,
  ] = useState('all')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const loadApplications =
      async () => {
        setLoading(true)
        setError('')

        try {
          const response =
            await api.get(
              '/my-applications'
            )

          setApplications(
            unwrapApplications(
              response.data
            )
          )

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Lamaran belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }

    loadApplications()
  }, [])


  const filteredApplications =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase()

      return applications.filter(
        (application) => {

          /* STATUS FILTER */

          if (
            activeTab !== 'all' &&
            application
              .status_lamaran !==
              activeTab
          ) {
            return false
          }


          /* SEARCH FILTER */

          if (!keyword) {
            return true
          }


          const project =
            application.project ??
            application.proyek ??
            {}


          const businessName =
            project.umkm?.nama_toko ??
            project.umkm_profile
              ?.nama_toko ??
            project.umkm?.user?.name ??
            ''


          return (
            project.judul
              ?.toLowerCase()
              .includes(keyword) ||

            businessName
              .toLowerCase()
              .includes(keyword) ||

            project
              .kategori_jurusan
              ?.toLowerCase()
              .includes(keyword)
          )
        }
      )

    }, [
      applications,
      activeTab,
      search,
    ])


  const statusCounts =
    useMemo(() => {
      return {
        all:
          applications.length,

        diajukan:
          applications.filter(
            (application) =>
              application
                .status_lamaran ===
              'diajukan'
          ).length,

        dipilih:
          applications.filter(
            (application) =>
              application
                .status_lamaran ===
              'dipilih'
          ).length,

        ditolak:
          applications.filter(
            (application) =>
              application
                .status_lamaran ===
              'ditolak'
          ).length,
      }
    }, [applications])


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
              text-[22px]
              font-semibold
              tracking-tight
            "
          >
            Lamaran Saya
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              text-gray-400
            "
          >
            Pantau status lamaran proyekmu
          </p>

        </div>

      </header>


      {/* SEARCH */}

      <section className="mt-6">

        <div className="relative">

          <Search
            size={17}

            className="
              absolute
              left-4
              top-1/2

              -translate-y-1/2

              text-gray-400
            "
          />


          <input
            type="search"

            value={search}

            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }

            placeholder="Cari lamaran..."

            className="
              h-12
              w-full

              rounded-full

              border
              border-gray-200

              bg-white

              pl-11
              pr-4

              text-xs

              outline-none

              transition

              focus:border-tumbuh-green

              focus:ring-4
              focus:ring-tumbuh-green/10
            "
          />

        </div>

      </section>


      {/* TABS */}

      <section
        className="
          mt-4

          flex
          gap-2

          overflow-x-auto
          pb-1

          [&::-webkit-scrollbar]:hidden
        "
      >

        {tabs.map((tab) => {

          const active =
            activeTab ===
            tab.value

          return (
            <button
              key={tab.value}

              type="button"

              onClick={() =>
                setActiveTab(
                  tab.value
                )
              }

              className={`
                flex
                shrink-0
                items-center
                gap-1.5

                rounded-full

                border

                px-3
                py-2

                text-[10px]
                font-medium

                transition

                ${
                  active
                    ? `
                      border-tumbuh-green
                      bg-tumbuh-green
                      text-white
                    `
                    : `
                      border-gray-300
                      bg-white
                      text-gray-600
                    `
                }
              `}
            >
              {tab.label}

              <span
                className={`
                  flex
                  min-w-5
                  items-center
                  justify-center

                  rounded-full

                  px-1.5
                  py-0.5

                  text-[8px]

                  ${
                    active
                      ? 'bg-white/25'
                      : 'bg-gray-100'
                  }
                `}
              >
                {
                  statusCounts[
                    tab.value
                  ]
                }
              </span>
            </button>
          )
        })}

      </section>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-6

            rounded-2xl

            border
            border-red-100

            bg-red-50

            p-4

            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* CONTENT */}

      {loading ? (
        <div
          className="
            flex
            min-h-[55vh]
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
            Memuat lamaran...
          </p>
        </div>
      ) : (
        <section
          className="
            mt-6

            grid
            grid-cols-1

            gap-4

            md:grid-cols-2
          "
        >

          {filteredApplications
            .length > 0 ? (

            filteredApplications.map(
              (application) => (
                <ApplicationCard
                  key={
                    application.id
                  }
                  application={
                    application
                  }
                />
              )
            )

          ) : (

            <EmptyApplications
              activeTab={activeTab}
              search={search}
            />

          )}

        </section>
      )}

    </StudentAppShell>
  )
}


function EmptyApplications({
  activeTab,
  search,
}) {
  let title =
    'Belum ada lamaran.'

  let description =
    'Temukan proyek menarik di halaman Explore dan mulai melamar.'


  if (search) {
    title =
      'Lamaran tidak ditemukan.'

    description =
      'Coba gunakan kata kunci yang berbeda.'
  }


  if (
    !search &&
    activeTab === 'diajukan'
  ) {
    title =
      'Tidak ada lamaran pending.'

    description =
      'Lamaran yang masih menunggu keputusan akan muncul di sini.'
  }


  if (
    !search &&
    activeTab === 'dipilih'
  ) {
    title =
      'Belum ada lamaran diterima.'

    description =
      'Proyek yang memilih kamu akan muncul di sini.'
  }


  if (
    !search &&
    activeTab === 'ditolak'
  ) {
    title =
      'Tidak ada lamaran ditolak.'

    description =
      'Lamaran yang tidak dipilih akan muncul di sini.'
  }


  return (
    <div
      className="
        col-span-full

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

      <div
        className="
          mx-auto

          flex
          h-16
          w-16

          items-center
          justify-center

          rounded-full

          bg-green-50

          text-2xl
        "
      >
        🌱
      </div>


      <h2
        className="
          mt-5
          text-sm
          font-semibold
        "
      >
        {title}
      </h2>


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
        {description}
      </p>

    </div>
  )
}