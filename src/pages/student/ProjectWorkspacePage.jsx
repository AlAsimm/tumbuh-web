import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Store,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  formatDate,
  formatRupiah,
  projectProgress,
  projectStatusLabel,
} from '../../lib/formatters'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import ProjectChatTab
  from '../../components/student/ProjectChatTab'

import ProjectSubmissionTab
  from '../../components/student/ProjectSubmissionTab'


function unwrapWorkspace(data) {
  if (data?.workspace) {
    return data.workspace
  }

  if (data?.data) {
    return data.data
  }

  return data
}


const tabs = [
  {
    label: 'Detail',
    value: 'detail',
  },
  {
    label: 'Timeline',
    value: 'timeline',
  },
  {
    label: 'Chat',
    value: 'chat',
  },
  {
    label: 'Hasil Kerja',
    value: 'submission',
  },
]


export default function ProjectWorkspacePage() {
  const {
    projectId,
  } = useParams()

  const navigate =
    useNavigate()

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()


  const [
    workspace,
    setWorkspace,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  const activeTab =
    searchParams.get('tab') ??
    'detail'


  const setActiveTab = (tab) => {
    setSearchParams({
      tab,
    })
  }


  const loadWorkspace =
  useCallback(async () => {

    setLoading(true)
    setError('')

    try {
      const response =
        await api.get(
          `/projects/${projectId}/workspace`
        )

      setWorkspace(
        unwrapWorkspace(
          response.data
        )
      )

    } catch (err) {
      console.error(err)

      setError(
        err.response
          ?.data
          ?.message ??
        'Workspace belum dapat dimuat.'
      )

    } finally {
      setLoading(false)
    }

  }, [projectId])


useEffect(() => {
  loadWorkspace()
}, [loadWorkspace])


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
            Membuka workspace...
          </p>
        </div>
      </StudentAppShell>
    )
  }


  if (
    error ||
    !workspace
  ) {
    return (
      <StudentAppShell>

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
          "
        >
          <ArrowLeft size={20} />
        </button>


        <div
          className="
            mt-10
            rounded-3xl
            bg-red-50
            p-6
            text-sm
            text-red-600
          "
        >
          {error ||
            'Workspace tidak tersedia.'}
        </div>

      </StudentAppShell>
    )
  }


  const project =
    workspace.project ??
    workspace


  const submissions =
    workspace.submissions ??
    project.submissions ??
    []


  const progress =
    projectProgress(
      project.status
    )


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
            navigate(
              '/student/projects'
            )
          }

          className="
            flex
            h-10
            w-10
            shrink-0
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
              text-lg
              font-semibold
            "
          >
            Ruang Kerja Proyek
          </h1>

          <p
            className="
              text-[10px]
              text-gray-400
            "
          >
            Kelola pengerjaan proyek
          </p>

        </div>

      </header>


      {/* PROJECT SUMMARY */}

      <section
        className="
          mt-5
          rounded-[28px]
          bg-white
          p-4
          shadow-[0_10px_35px_rgba(0,0,0,0.03)]
        "
      >

        <div
          className="
            flex
            gap-3
          "
        >

          <div
            className="
              flex
              h-20
              w-20
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-green-100
            "
          >
            <img
              src="/assets/logo-tumbuh.png"
              alt=""
              className="
                h-12
                w-12
                object-contain
              "
            />
          </div>


          <div className="min-w-0 flex-1">

            <h2
              className="
                line-clamp-2
                text-sm
                font-semibold
              "
            >
              {project.judul}
            </h2>


            <p
              className="
                mt-1
                text-[10px]
                text-gray-500
              "
            >
              {project.umkm
                ?.nama_toko ??
                project.umkm
                  ?.user
                  ?.name ??
                'UMKM TUMBUH'}
            </p>


            <div
              className="
                mt-2
                flex
                flex-wrap
                gap-1.5
              "
            >

              <span
                className="
                  rounded-full
                  bg-cyan-100
                  px-2
                  py-1
                  text-[9px]
                  text-blue-500
                "
              >
                {
                  project.kategori_jurusan
                }
              </span>


              <span
                className="
                  rounded-full
                  bg-red-50
                  px-2
                  py-1
                  text-[9px]
                  text-red-500
                "
              >
                {projectStatusLabel(
                  project.status
                )}
              </span>

            </div>

          </div>

        </div>


        <div className="mt-4">

          <div
            className="
              flex
              items-end
              gap-2
            "
          >
            <strong
              className="
                text-xl
                text-tumbuh-green-dark
              "
            >
              {progress}%
            </strong>

            <span
              className="
                pb-1
                text-[9px]
                text-gray-500
              "
            >
              {projectStatusLabel(
                project.status
              )}
            </span>
          </div>


          <div
            className="
              mt-1
              h-1.5
              overflow-hidden
              rounded-full
              bg-gray-200
            "
          >
            <div
              className="
                h-full
                bg-tumbuh-green-dark
              "
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>

        </div>

      </section>


      {/* TAB BAR */}

      <nav
        className="
          mt-6
          flex
          overflow-x-auto
          border-b
          border-gray-200
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
                relative
                shrink-0
                px-4
                pb-3
                pt-1
                text-[11px]
                font-medium

                ${
                  active
                    ? 'text-tumbuh-green-dark'
                    : 'text-gray-400'
                }
              `}
            >
              {tab.label}

              {active && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    rounded-full
                    bg-tumbuh-green-dark
                  "
                />
              )}
            </button>
          )
        })}

      </nav>


      {/* TAB CONTENT */}

      {activeTab === 'detail' && (
        <DetailTab
          project={project}
        />
      )}


      {activeTab === 'timeline' && (
        <TimelineTab
          project={project}
        />
      )}


      {activeTab === 'chat' && (
  <ProjectChatTab
    projectId={project.id}
    projectStatus={project.status}
  />
)}


      {activeTab === 'submission' && (
  <ProjectSubmissionTab
    projectId={project.id}
    projectStatus={project.status}
    submissions={submissions}
    onSubmitted={loadWorkspace}
  />
)}

    </StudentAppShell>

    
  )

  function DetailTab({
  project,
}) {
  const checklist =
    Array.isArray(
      project.checklist
    )
      ? project.checklist
      : []


  return (
    <section className="mt-6">

      <h2
        className="
          text-base
          font-semibold
        "
      >
        Deskripsi Proyek
      </h2>


      <p
        className="
          mt-3
          whitespace-pre-line
          text-xs
          leading-6
          text-gray-600
        "
      >
        {project.deskripsi_brief}
      </p>


      <div
        className="
          mt-7
          grid
          grid-cols-2
          gap-3
        "
      >

        <WorkspaceInfo
          icon={Store}
          label="Anggaran"
          value={
            formatRupiah(
              project.anggaran
            )
          }
        />

        <WorkspaceInfo
          icon={CalendarDays}
          label="Deadline"
          value={
            formatDate(
              project.deadline
            ) ?? '-'
          }
        />

      </div>


      <h2
        className="
          mt-8
          text-base
          font-semibold
        "
      >
        Tugas Proyek
      </h2>


      {checklist.length > 0 ? (

        <div
          className="
            mt-4
            space-y-3
          "
        >

          {checklist.map(
            (task, index) => (

              <div
                key={`${task}-${index}`}

                className="
                  flex
                  items-start
                  gap-3

                  rounded-2xl

                  bg-white
                  p-4
                "
              >

                <div
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    bg-green-100

                    text-tumbuh-green-dark
                  "
                >
                  <CheckCircle2
                    size={14}
                  />
                </div>


                <span
                  className="
                    text-[11px]
                    leading-5
                    text-gray-600
                  "
                >
                  {task}
                </span>

              </div>

            )
          )}

        </div>

      ) : (

        <p
          className="
            mt-4
            rounded-2xl
            bg-white
            p-4
            text-xs
            text-gray-400
          "
        >
          Belum ada checklist proyek.
        </p>

      )}

    </section>
  )
}

function TimelineTab({
  project,
}) {
  const status =
    project.status


  const steps = [
    {
      title:
        'Proyek Dimulai',

      description:
        'Siswa telah dipilih oleh UMKM dan pengerjaan proyek dimulai.',

      completed: true,
    },

    {
      title:
        'Pengerjaan',

      description:
        'Siswa mengerjakan proyek sesuai brief dan checklist.',

      completed:
        [
          'teacher_review',
          'umkm_review',
          'mediation',
          'completed',
        ].includes(status),

      active:
        status ===
        'in_progress',
    },

    {
      title:
        'Validasi Guru',

      description:
        'Guru pembimbing memeriksa hasil kerja siswa.',

      completed:
        [
          'umkm_review',
          'mediation',
          'completed',
        ].includes(status),

      active:
        status ===
        'teacher_review',
    },

    {
      title:
        'Review UMKM',

      description:
        'UMKM mengevaluasi hasil akhir proyek.',

      completed:
        status ===
        'completed',

      active:
        [
          'umkm_review',
          'mediation',
        ].includes(status),
    },

    {
      title:
        'Selesai',

      description:
        'Proyek selesai dan masuk ke portofolio terverifikasi.',

      completed:
        status ===
        'completed',

      active:
        false,
    },
  ]


  return (
    <section className="mt-7">

      <h2
        className="
          text-base
          font-semibold
        "
      >
        Progress Proyek
      </h2>


      <div className="mt-6">

        {steps.map(
          (
            step,
            index
          ) => (

            <div
              key={step.title}
              className="
                relative
                flex
                gap-4
                pb-8
              "
            >

              {/* LINE */}

              {index <
                steps.length - 1 && (
                <div
                  className="
                    absolute
                    left-[11px]
                    top-6
                    h-full
                    w-[2px]
                    bg-gray-200
                  "
                />
              )}


              {/* DOT */}

              <div
                className={`
                  relative
                  z-10

                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  ${
                    step.completed
                      ? `
                        bg-tumbuh-green
                        text-white
                      `
                      : step.active
                        ? `
                          border-2
                          border-tumbuh-green
                          bg-white
                        `
                        : `
                          border-2
                          border-gray-300
                          bg-white
                        `
                  }
                `}
              >

                {step.completed ? (
                  <CheckCircle2
                    size={14}
                  />
                ) : (
                  <Circle
                    size={9}
                  />
                )}

              </div>


              <div>

                <h3
                  className={`
                    text-xs
                    font-semibold

                    ${
                      step.completed ||
                      step.active
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.title}
                </h3>


                <p
                  className="
                    mt-1
                    max-w-sm
                    text-[10px]
                    leading-4
                    text-gray-400
                  "
                >
                  {step.description}
                </p>

              </div>

            </div>

          )
        )}

      </div>

    </section>
  )
}

function WorkspaceInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-4
      "
    >

      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center

          rounded-xl

          bg-green-50

          text-tumbuh-green-dark
        "
      >
        <Icon size={16} />
      </div>


      <p
        className="
          mt-3
          text-[9px]
          text-gray-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-0.5
          text-[11px]
          font-semibold
        "
      >
        {value}
      </p>

    </div>
  )
}


function ComingSoonTab({
  icon: Icon,
  title,
  description,
}) {
  return (
    <section
      className="
        mt-8

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
          h-14
          w-14

          items-center
          justify-center

          rounded-full

          bg-green-50

          text-tumbuh-green-dark
        "
      >
        <Icon size={23} />
      </div>


      <h2
        className="
          mt-4
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

    </section>
  )
}
}