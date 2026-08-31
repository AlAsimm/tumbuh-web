import {
  Bell,
  BadgeCheck,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  formatCompactRupiah,
} from '../../lib/formatters'

import {
  useAuth,
} from '../../context/AuthContext'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import StatCard
  from '../../components/student/StatCard'

import StudentProjectCard
  from '../../components/student/StudentProjectCard'


function unwrapList(
  data,
  keys = []
) {
  if (Array.isArray(data)) {
    return data
  }

  for (const key of keys) {
    if (
      Array.isArray(
        data?.[key]
      )
    ) {
      return data[key]
    }
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


export default function StudentDashboard() {
  const {
    user,
  } = useAuth()

  const navigate =
    useNavigate()


  const [
    applications,
    setApplications,
  ] = useState([])

  const [
    projects,
    setProjects,
  ] = useState([])

  const [
    portfolios,
    setPortfolios,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const loadDashboard =
      async () => {

        setLoading(true)
        setError('')

        try {
          const [
            applicationsResponse,
            projectsResponse,
            portfoliosResponse,
          ] =
            await Promise.all([
              api.get(
                '/my-applications'
              ),

              api.get(
                '/projects'
              ),

              api.get(
                '/my-portfolios'
              ),
            ])


          setApplications(
            unwrapList(
              applicationsResponse.data,
              ['applications']
            )
          )


          setProjects(
            unwrapList(
              projectsResponse.data,
              ['projects']
            )
          )


          setPortfolios(
            unwrapList(
              portfoliosResponse.data,
              ['portfolios']
            )
          )

        } catch (err) {
          console.error(err)

          setError(
            'Dashboard belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }


    loadDashboard()
  }, [])


  const normalizedApplications =
    useMemo(() => {

      return applications.map(
        (application) => ({
          ...application,

          project:
            application.project ??
            application.proyek ??
            null,
        })
      )

    }, [applications])


  const selectedApplications =
    normalizedApplications.filter(
      (application) =>
        application
          .status_lamaran ===
        'dipilih'
    )


  const activeProjects =
    selectedApplications
      .map(
        (application) =>
          application.project
      )
      .filter(Boolean)
      .filter(
        (project) =>
          ![
            'completed',
            'cancelled',
          ].includes(
            project.status
          )
      )


  const completedProjects =
    selectedApplications
      .map(
        (application) =>
          application.project
      )
      .filter(Boolean)
      .filter(
        (project) =>
          project.status ===
          'completed'
      )


  const totalProjectValue =
    completedProjects.reduce(
      (total, project) =>
        total +
        Number(
          project.anggaran ??
          0
        ),
      0
    )


  const appliedProjectIds =
    new Set(
      normalizedApplications
        .map(
          (application) =>
            application
              .project
              ?.id
        )
        .filter(Boolean)
    )


  const recommendations =
    projects
      .filter(
        (project) =>
          project.status ===
          'open'
      )
      .filter(
        (project) =>
          !appliedProjectIds.has(
            project.id
          )
      )
      .slice(0, 3)


  const firstName =
    user?.name
      ?.split(' ')
      ?.[0] ??
    'Siswa'


  const openActiveProject =
    (projectId) => {

      navigate(
        `/student/projects/${projectId}/workspace`
      )
    }


  const openRecommendedProject =
    (projectId) => {

      navigate(
        `/student/projects/${projectId}`
      )
    }


  if (loading) {
    return (
      <StudentAppShell>

        <div
          className="
            flex
            min-h-[70vh]
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
            Memuat TUMBUH...
          </p>
        </div>

      </StudentAppShell>
    )
  }


  return (
    <StudentAppShell>

      {/* HEADER */}

      <header
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-14
              w-14

              items-center
              justify-center

              rounded-full

              bg-blue-100

              text-xl
              font-semibold
              text-blue-600
            "
          >
            {firstName
              .charAt(0)
              .toUpperCase()}
          </div>


          <div>

            <div
              className="
                flex
                items-center
                gap-2

                text-[10px]
                font-semibold
                uppercase
                tracking-widest
                text-green-500
              "
            >
              ☀
              Good Morning
            </div>


            <h1
              className="
                mt-1

                text-[24px]
                font-semibold
                leading-tight
              "
            >
              Halo, {firstName}!
            </h1>

          </div>

        </div>


        <button
          type="button"

          className="
            relative

            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-full

            bg-tumbuh-green-soft

            text-tumbuh-green-dark
          "
        >
          <Bell size={19} />


          <span
            className="
              absolute
              right-2.5
              top-2

              h-2
              w-2

              rounded-full

              bg-green-500
            "
          />

        </button>

      </header>


      {/* STATS */}

      <section
        className="
          mt-7

          grid
          grid-cols-3
          gap-3
        "
      >

        <StatCard
          label="Lamaran"
          value={
            applications.length
          }
          caption="terkirim"
          accent="blue"
        />


        <StatCard
          label="Proyek"
          value={
            completedProjects.length
          }
          caption="selesai"
          accent="dark"
        />


        <StatCard
          label="Total Nilai"
          value={
            formatCompactRupiah(
              totalProjectValue
            )
          }
          caption="proyek selesai"
        />

      </section>


      {/* PORTFOLIO */}

      <Link
        to="/student/portfolio"

        className="
          mt-5

          flex
          h-12

          items-center
          justify-center
          gap-2

          rounded-2xl

          bg-tumbuh-green

          font-semibold
          text-white

          shadow-[0_8px_25px_rgba(108,216,135,0.25)]
        "
      >
        <BadgeCheck size={20} />

        Portofolio Anda


        {portfolios.length >
          0 && (

          <span
            className="
              rounded-full

              bg-white/20

              px-2
              py-0.5

              text-xs
            "
          >
            {portfolios.length}
          </span>

        )}

      </Link>


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


      {/* RESPONSIVE CONTENT */}

      <div
        className="
          md:grid
          md:grid-cols-2
          md:gap-7
        "
      >

        {/* ACTIVE PROJECT */}

        <section className="mt-8">

          <div
            className="
              mb-4

              flex
              items-center
              justify-between
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                text-tumbuh-green-dark
              "
            >
              Tugas yang aktif
            </h2>


            <Link
              to="/student/projects"

              className="
                text-xs
                font-semibold
                text-tumbuh-green-dark
              "
            >
              See all
            </Link>

          </div>


          <div className="space-y-3">

            {activeProjects.length >
            0 ? (

              activeProjects
                .slice(0, 2)
                .map(
                  (project) => (

                    <div
                      key={
                        project.id
                      }

                      role="button"

                      tabIndex={0}

                      onClickCapture={() =>
                        openActiveProject(
                          project.id
                        )
                      }

                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            'Enter' ||
                          event.key ===
                            ' '
                        ) {
                          event.preventDefault()

                          openActiveProject(
                            project.id
                          )
                        }
                      }}

                      className="
                        cursor-pointer
                        rounded-[24px]

                        outline-none

                        transition

                        hover:-translate-y-0.5

                        focus-visible:ring-4
                        focus-visible:ring-green-100
                      "
                    >
                      <StudentProjectCard
                        project={
                          project
                        }
                      />
                    </div>

                  )
                )

            ) : (

              <div
                className="
                  rounded-[24px]

                  border
                  border-dashed
                  border-gray-300

                  bg-white/70

                  px-6
                  py-8

                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  Belum ada proyek aktif.
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  Yuk cari proyek yang
                  sesuai keahlianmu.
                </p>
              </div>

            )}

          </div>

        </section>


        {/* RECOMMENDATIONS */}

        <section
          className="
            mt-8

            rounded-[32px]

            bg-white/80

            p-4

            md:p-5
          "
        >

          <div
            className="
              mb-4

              flex
              items-center
              justify-between
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Rekomendasi Proyek
            </h2>


            <Link
              to="/student/explore"

              className="
                text-xs
                font-semibold
                text-tumbuh-green-dark
              "
            >
              See all
            </Link>

          </div>


          <div className="space-y-3">

            {recommendations.length >
            0 ? (

              recommendations.map(
                (project) => (

                  <div
                    key={
                      project.id
                    }

                    role="button"

                    tabIndex={0}

                    onClickCapture={() =>
                      openRecommendedProject(
                        project.id
                      )
                    }

                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          'Enter' ||
                        event.key ===
                          ' '
                      ) {
                        event.preventDefault()

                        openRecommendedProject(
                          project.id
                        )
                      }
                    }}

                    className="
                      cursor-pointer
                      rounded-[24px]

                      outline-none

                      transition

                      hover:-translate-y-0.5

                      focus-visible:ring-4
                      focus-visible:ring-green-100
                    "
                  >
                    <StudentProjectCard
                      project={
                        project
                      }

                      compact
                    />
                  </div>

                )
              )

            ) : (

              <p
                className="
                  py-6

                  text-center
                  text-sm
                  text-gray-400
                "
              >
                Belum ada rekomendasi
                proyek baru.
              </p>

            )}

          </div>

        </section>

      </div>

    </StudentAppShell>
  )
}
