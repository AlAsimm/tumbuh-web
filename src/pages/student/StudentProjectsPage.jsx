import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import api from '../../lib/api'

import {
  projectStage,
} from '../../lib/formatters'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import MyProjectCard
  from '../../components/student/MyProjectCard'


function unwrapApplications(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.applications)) {
    return data.applications
  }

  if (Array.isArray(data?.data)) {
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
    label: 'Berjalan',
    value: 'active',
  },
  {
    label: 'Review',
    value: 'review',
  },
  {
    label: 'Selesai',
    value: 'completed',
  },
]


export default function StudentProjectsPage() {
  const [
    applications,
    setApplications,
  ] = useState([])

  const [
    activeTab,
    setActiveTab,
  ] = useState('all')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const loadProjects = async () => {
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
          'Proyek kamu belum dapat dimuat.'
        )

      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])


  const selectedProjects =
    useMemo(() => {
      return applications
        .filter(
          (application) =>
            application
              .status_lamaran ===
            'dipilih'
        )
        .map(
          (application) =>
            application.project ??
            application.proyek
        )
        .filter(Boolean)
    }, [applications])


  const filteredProjects =
    useMemo(() => {

      if (activeTab === 'all') {
        return selectedProjects
      }

      return selectedProjects.filter(
        (project) =>
          projectStage(
            project.status
          ) === activeTab
      )

    }, [
      selectedProjects,
      activeTab,
    ])


  const counts =
    useMemo(() => ({
      all:
        selectedProjects.length,

      active:
        selectedProjects.filter(
          (project) =>
            projectStage(
              project.status
            ) === 'active'
        ).length,

      review:
        selectedProjects.filter(
          (project) =>
            projectStage(
              project.status
            ) === 'review'
        ).length,

      completed:
        selectedProjects.filter(
          (project) =>
            projectStage(
              project.status
            ) === 'completed'
        ).length,
    }), [selectedProjects])


  return (
    <StudentAppShell>

      {/* HEADER */}

      <header>

        <h1
          className="
            text-[28px]
            font-semibold
            tracking-tight
          "
        >
          Proyek Saya
        </h1>

        <p
          className="
            mt-1
            text-xs
            text-gray-400
          "
        >
          Kelola proyek yang sedang
          dan sudah kamu kerjakan.
        </p>

      </header>


      {/* TABS */}

      <section
        className="
          mt-6
          flex
          gap-2
          overflow-x-auto
          pb-1
          [&::-webkit-scrollbar]:hidden
        "
      >

        {tabs.map((tab) => {

          const active =
            activeTab === tab.value

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
                px-3
                py-2
                text-[10px]
                font-medium
                transition

                ${
                  active
                    ? `
                      bg-tumbuh-green
                      text-white
                    `
                    : `
                      border
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
                {counts[tab.value]}
              </span>
            </button>
          )
        })}

      </section>


      {error && (
        <div
          className="
            mt-6
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
            Memuat proyek...
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

          {filteredProjects.length > 0 ? (

            filteredProjects.map(
              (project, index) => (
                <MyProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              )
            )

          ) : (

            <EmptyProjects
              activeTab={activeTab}
            />

          )}

        </section>

      )}

    </StudentAppShell>
  )
}


function EmptyProjects({
  activeTab,
}) {
  const messages = {
    all: [
      'Belum ada proyek.',
      'Proyek yang memilih kamu akan muncul di sini.',
    ],

    active: [
      'Tidak ada proyek berjalan.',
      'Proyek yang sedang kamu kerjakan akan muncul di sini.',
    ],

    review: [
      'Tidak ada proyek dalam review.',
      'Submission yang sedang diperiksa akan muncul di sini.',
    ],

    completed: [
      'Belum ada proyek selesai.',
      'Project yang telah selesai akan tersimpan di sini.',
    ],
  }


  const [
    title,
    description,
  ] =
    messages[activeTab] ??
    messages.all


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

      <img
        src="/assets/logo-tumbuh.png"
        alt=""
        className="
          mx-auto
          h-14
          w-14
          object-contain
        "
      />


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