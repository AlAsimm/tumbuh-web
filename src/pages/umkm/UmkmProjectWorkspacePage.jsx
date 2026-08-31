import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
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

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import UmkmProjectChatTab
  from '../../components/umkm/UmkmProjectChatTab'


function unwrapWorkspace(data) {
  return {
    project:
      data?.project ??
      null,

    selectedMember:
      data?.selected_member ??
      data?.selectedMember ??
      null,

    submissions:
      Array.isArray(
        data?.submissions
      )
        ? data.submissions
        : [],
  }
}


const tabs = [
  {
    value: 'detail',
    label: 'Detail',
  },

  {
    value: 'timeline',
    label: 'Timeline',
  },

  {
    value: 'chat',
    label: 'Chat',
  },

  {
    value: 'result',
    label: 'Hasil Kerja',
  },
]


export default function UmkmProjectWorkspacePage() {
  const navigate =
    useNavigate()

  const {
    projectId,
  } = useParams()

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


  const loadWorkspace =
    useCallback(
      async () => {

        setLoading(true)
        setError('')


        try {
          const response =
            await api.get(
              `/umkm/projects/${projectId}/workspace`
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

      },
      [projectId]
    )


  useEffect(() => {
    loadWorkspace()
  }, [loadWorkspace])


  if (loading) {
    return (
      <UmkmAppShell>

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
              text-sm
              font-semibold
              text-green-700
            "
          >
            Memuat workspace...
          </p>
        </div>

      </UmkmAppShell>
    )
  }


  if (
    error ||
    !workspace?.project
  ) {
    return (
      <UmkmAppShell>

        <button
          type="button"

          onClick={() =>
            navigate(
              '/umkm/projects'
            )
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
          <ArrowLeft size={18} />
        </button>


        <div
          className="
            mt-6
            rounded-3xl
            bg-red-50
            p-5
            text-xs
            text-red-600
          "
        >
          {error ||
            'Workspace tidak ditemukan.'}
        </div>

      </UmkmAppShell>
    )
  }


  const {
    project,
    selectedMember,
    submissions,
  } = workspace


  const student =
    selectedMember?.siswa ??
    selectedMember?.student ??
    {}


  const profile =
    student.smk_profile ??
    student.smkProfile ??
    {}


  const progress =
    projectProgress(
      project.status
    )


  const changeTab = (
    tab
  ) => {
    setSearchParams({
      tab,
    })
  }


  return (
    <UmkmAppShell>

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
              '/umkm/projects'
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
          <ArrowLeft size={19} />
        </button>


        <div className="min-w-0">

          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-widest
              text-green-600
            "
          >
            Workspace
          </p>


          <h1
            className="
              mt-1
              truncate
              text-xl
              font-semibold
            "
          >
            {project.judul}
          </h1>

        </div>

      </header>


      {/* SUMMARY */}

      <section
        className="
          mt-6

          rounded-[28px]

          bg-[#67D987]

          p-5
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div>
            <p
              className="
                text-[9px]
                text-green-950/60
              "
            >
              Status Proyek
            </p>

            <h2
              className="
                mt-1
                text-sm
                font-semibold
                text-green-950
              "
            >
              {projectStatusLabel(
                project.status
              )}
            </h2>
          </div>


          <div
            className="
              rounded-full

              bg-white/80

              px-3
              py-1.5

              text-[8px]
              font-semibold
              text-green-800
            "
          >
            {progress}%
          </div>

        </div>


        <div
          className="
            mt-4

            h-1.5

            overflow-hidden

            rounded-full

            bg-white/70
          "
        >
          <div
            className="
              h-full

              rounded-full

              bg-blue-500
            "

            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>


        {/* STUDENT */}

        <div
          className="
            mt-5

            flex
            items-center
            gap-3

            rounded-[20px]

            bg-white/40

            p-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0

              items-center
              justify-center

              rounded-full

              bg-white

              text-[10px]
              font-semibold
            "
          >
            {(student.name ??
              'ST')
              .split(' ')
              .map(
                (part) =>
                  part.charAt(0)
              )
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>


          <div className="min-w-0">

            <p
              className="
                text-[8px]
                text-green-950/60
              "
            >
              Dikerjakan oleh
            </p>

            <p
              className="
                truncate
                text-[10px]
                font-semibold
                text-green-950
              "
            >
              {student.name ??
                'Siswa TUMBUH'}
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[8px]
                text-green-950/60
              "
            >
              {[
                profile.nama_sekolah,
                profile.jurusan,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>

          </div>

        </div>

      </section>


      {/* TABS */}

      <nav
        className="
          mt-6

          grid
          grid-cols-4

          rounded-[20px]

          bg-white

          p-1
        "
      >

        {tabs.map(
          (tab) => {

            const active =
              activeTab ===
              tab.value


            return (
              <button
                key={tab.value}

                type="button"

                onClick={() =>
                  changeTab(
                    tab.value
                  )
                }

                className={`
                  rounded-[16px]

                  px-1
                  py-3

                  text-[8px]
                  font-semibold

                  transition

                  ${
                    active
                      ? `
                        bg-green-100
                        text-green-700
                      `
                      : `
                        text-gray-400
                      `
                  }
                `}
              >
                {tab.label}
              </button>
            )
          }
        )}

      </nav>


      {/* CONTENT */}

      <section className="mt-5">

        {activeTab ===
          'detail' && (

          <DetailTab
            project={
              project
            }

            student={
              student
            }

            profile={
              profile
            }
          />

        )}


        {activeTab ===
          'timeline' && (

          <TimelineTab
            status={
              project.status
            }
          />

        )}


        {activeTab ===
          'chat' && (

          <UmkmProjectChatTab
            projectId={
              project.id
            }

            projectStatus={
              project.status
            }
          />

        )}


        {activeTab ===
          'result' && (

          <WorkResultTab
            project={
              project
            }

            submissions={
              submissions
            }

            onReview={() =>
              navigate(
                `/umkm/projects/${project.id}/review`
              )
            }
          />

        )}

      </section>

    </UmkmAppShell>
  )

  function DetailTab({
  project,
  student,
  profile,
}) {
  const checklist =
    Array.isArray(
      project.checklist
    )
      ? project.checklist
      : []


  return (
    <div
      className="
        space-y-4
      "
    >

      {/* PROJECT */}

      <section
        className="
          rounded-[24px]
          bg-white
          p-5
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Tentang Proyek
        </h2>


        <p
          className="
            mt-3

            whitespace-pre-wrap

            text-[10px]
            leading-5
            text-gray-500
          "
        >
          {project.deskripsi_brief}
        </p>


        <div
          className="
            mt-5

            grid
            grid-cols-2
            gap-3
          "
        >

          <DetailInfo
            icon={Store}
            label="Anggaran"
            value={
              formatRupiah(
                project.anggaran
              )
            }
          />


          <DetailInfo
            icon={CalendarDays}
            label="Deadline"
            value={
              formatDate(
                project.deadline
              )
            }
          />

        </div>

      </section>


      {/* STUDENT */}

      <section
        className="
          rounded-[24px]
          bg-white
          p-5
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Siswa Terpilih
        </h2>


        <div
          className="
            mt-4

            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              bg-blue-100

              text-[10px]
              font-semibold
              text-blue-600
            "
          >
            {(student.name ??
              'ST')
              .split(' ')
              .map(
                (part) =>
                  part.charAt(0)
              )
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>


          <div>
            <p
              className="
                text-xs
                font-semibold
              "
            >
              {student.name ??
                'Siswa TUMBUH'}
            </p>

            <p
              className="
                mt-1
                text-[9px]
                text-gray-400
              "
            >
              {profile.nama_sekolah ??
                '-'}
            </p>

            <p
              className="
                mt-1
                text-[8px]
                font-medium
                text-green-700
              "
            >
              {[
                profile.jurusan,
                profile.tingkat_kelas
                  ? `Kelas ${profile.tingkat_kelas}`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>

        </div>

      </section>


      {/* CHECKLIST */}

      {checklist.length > 0 && (
        <section
          className="
            rounded-[24px]
            bg-white
            p-5
          "
        >

          <h2
            className="
              text-sm
              font-semibold
            "
          >
            Target Hasil Kerja
          </h2>


          <div
            className="
              mt-4
              space-y-3
            "
          >

            {checklist.map(
              (item, index) => (

                <div
                  key={index}

                  className="
                    flex
                    items-start
                    gap-3
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

                      text-[8px]
                      font-semibold
                      text-green-700
                    "
                  >
                    {index + 1}
                  </div>


                  <p
                    className="
                      pt-1
                      text-[9px]
                      leading-4
                      text-gray-500
                    "
                  >
                    {item}
                  </p>

                </div>

              )
            )}

          </div>

        </section>
      )}

    </div>
  )
}


function DetailInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-[18px]
        bg-gray-50
        p-4
      "
    >
      <Icon
        size={16}
        className="
          text-green-700
        "
      />

      <p
        className="
          mt-2
          text-[8px]
          text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-[9px]
          font-semibold
        "
      >
        {value || '-'}
      </p>
    </div>
  )
}

function TimelineTab({
  status,
}) {
  const steps = [
    {
      status: 'in_progress',
      title: 'Pengerjaan Proyek',
      description:
        'Siswa sedang mengerjakan proyek.',
    },

    {
      status: 'teacher_review',
      title: 'Validasi Guru',
      description:
        'Guru memeriksa hasil kerja siswa.',
    },

    {
      status: 'umkm_review',
      title: 'Review UMKM',
      description:
        'UMKM memeriksa hasil akhir proyek.',
    },

    {
      status: 'completed',
      title: 'Proyek Selesai',
      description:
        'Hasil telah diterima dan diverifikasi.',
    },
  ]


  const order = {
    in_progress: 1,
    teacher_review: 2,
    umkm_review: 3,
    mediation: 3,
    completed: 4,
  }


  const current =
    order[status] ?? 0


  return (
    <section
      className="
        rounded-[24px]
        bg-white
        p-5
      "
    >

      <h2
        className="
          text-sm
          font-semibold
        "
      >
        Timeline Proyek
      </h2>


      <div
        className="
          mt-6
          space-y-0
        "
      >

        {steps.map(
          (step, index) => {

            const stepNumber =
              index + 1

            const completed =
              current >
              stepNumber

            const active =
              current ===
              stepNumber


            return (
              <div
                key={
                  step.status
                }

                className="
                  flex
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    items-center
                  "
                >

                  <div
                    className={`
                      flex
                      h-8
                      w-8

                      items-center
                      justify-center

                      rounded-full

                      ${
                        completed
                          ? `
                            bg-green-600
                            text-white
                          `
                          : active
                            ? `
                              bg-green-100
                              text-green-700
                            `
                            : `
                              bg-gray-100
                              text-gray-400
                            `
                      }
                    `}
                  >
                    {completed ? (
                      <CheckCircle2
                        size={15}
                      />
                    ) : (
                      <Clock3
                        size={14}
                      />
                    )}
                  </div>


                  {index <
                    steps.length -
                      1 && (

                    <div
                      className={`
                        h-14
                        w-px

                        ${
                          completed
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }
                      `}
                    />

                  )}

                </div>


                <div
                  className="
                    pb-8
                  "
                >

                  <p
                    className={`
                      text-[10px]
                      font-semibold

                      ${
                        active ||
                        completed
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.title}
                  </p>


                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-4
                      text-gray-400
                    "
                  >
                    {step.description}
                  </p>

                </div>

              </div>
            )
          }
        )}

      </div>

    </section>
  )
}
function WorkResultTab({
  project,
  submissions,
  onReview,
}) {
  const latest =
    submissions?.[0]


  if (!latest) {
    return (
      <section
        className="
          rounded-[24px]

          border
          border-dashed
          border-gray-300

          bg-white/70

          px-6
          py-12

          text-center
        "
      >
        <FileText
          size={30}
          className="
            mx-auto
            text-gray-300
          "
        />

        <h2
          className="
            mt-4
            text-sm
            font-semibold
          "
        >
          Belum ada hasil kerja
        </h2>

        <p
          className="
            mx-auto
            mt-2
            max-w-xs
            text-[9px]
            leading-4
            text-gray-400
          "
        >
          Submission dari siswa akan
          muncul setelah hasil kerja
          dikirim.
        </p>
      </section>
    )
  }


  return (
    <div
      className="
        space-y-4
      "
    >

      <section
        className="
          rounded-[24px]
          bg-white
          p-5
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                text-[8px]
                uppercase
                tracking-wide
                text-gray-400
              "
            >
              Submission Terbaru
            </p>

            <h2
              className="
                mt-1
                text-sm
                font-semibold
              "
            >
              Versi {latest.versi}
            </h2>

          </div>


          <span
            className="
              rounded-full

              bg-purple-100

              px-3
              py-1.5

              text-[8px]
              font-semibold
              text-purple-600
            "
          >
            {project.status ===
            'teacher_review'
              ? 'Validasi Guru'
              : project.status ===
                  'umkm_review'
                ? 'Siap Direview'
                : projectStatusLabel(
                    project.status
                  )}
          </span>

        </div>


        {latest.catatan && (
          <div
            className="
              mt-4

              rounded-[18px]

              bg-gray-50

              p-4
            "
          >
            <p
              className="
                text-[8px]
                text-gray-400
              "
            >
              Catatan Siswa
            </p>

            <p
              className="
                mt-1
                text-[9px]
                leading-4
                text-gray-600
              "
            >
              {latest.catatan}
            </p>
          </div>
        )}


        {latest.repository_url && (
          <a
            href={
              latest.repository_url
            }

            target="_blank"
            rel="noreferrer"

            className="
              mt-4

              flex
              h-11

              items-center
              justify-center
              gap-2

              rounded-2xl

              border
              border-gray-200

              text-[9px]
              font-semibold
            "
          >
            <FileText size={14} />

            Lihat Repository
          </a>
        )}

      </section>


      {project.status ===
        'teacher_review' && (

        <div
          className="
            rounded-[20px]

            bg-purple-50

            px-4
            py-4
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              text-purple-700
            "
          >
            Menunggu Validasi Guru
          </p>

          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-gray-500
            "
          >
            Hasil kerja belum dapat
            Anda terima sebelum guru
            pembimbing melakukan
            validasi.
          </p>
        </div>

      )}


      {project.status ===
        'umkm_review' && (

        <button
          type="button"

          onClick={
            onReview
          }

          className="
            flex
            h-13
            w-full

            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-orange-500

            text-[10px]
            font-semibold
            text-white
          "
        >
          <CheckCircle2
            size={15}
          />

          Review Hasil Akhir
        </button>

      )}

    </div>
  )
}

}