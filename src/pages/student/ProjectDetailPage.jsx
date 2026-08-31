import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Store,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  daysUntil,
  formatDate,
  formatRupiah,
} from '../../lib/formatters'

import StudentAppShell
  from '../../components/student/StudentAppShell'


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


function unwrapProject(data) {
  if (data?.project) {
    return data.project
  }

  if (data?.data) {
    return data.data
  }

  return data
}


export default function ProjectDetailPage() {
  const {
    projectId,
  } = useParams()

  const navigate = useNavigate()

  const [project, setProject] =
    useState(null)

  const [applications, setApplications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [applying, setApplying] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')


  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [
        projectResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get(`/projects/${projectId}`),

        api.get('/my-applications'),
      ])

      setProject(
        unwrapProject(
          projectResponse.data
        )
      )

      setApplications(
        unwrapApplications(
          applicationsResponse.data
        )
      )

    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ??
        'Detail project belum dapat dimuat.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadData()
  }, [projectId])


  const currentApplication =
    useMemo(() => {
      return applications.find(
        (application) => {

          const applicationProjectId =
            application.project_id ??
            application.project?.id

          return (
            Number(applicationProjectId) ===
            Number(projectId)
          )
        }
      )
    }, [
      applications,
      projectId,
    ])


  const handleApply = async () => {
    if (!project) {
      return
    }

    setApplying(true)
    setError('')
    setSuccess('')

    try {
      const response =
        await api.post(
          `/projects/${project.id}/apply`
        )

      setSuccess(
        response.data?.message ??
        'Lamaran berhasil dikirim.'
      )

      const applicationsResponse =
        await api.get(
          '/my-applications'
        )

      setApplications(
        unwrapApplications(
          applicationsResponse.data
        )
      )

    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ??
        'Lamaran belum berhasil dikirim.'
      )

    } finally {
      setApplying(false)
    }
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
            Memuat project...
          </p>
        </div>
      </StudentAppShell>
    )
  }


  if (!project) {
    return (
      <StudentAppShell>

        <button
          type="button"
          onClick={() => navigate(-1)}
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
            mt-12
            rounded-3xl
            bg-white
            p-8
            text-center
          "
        >
          <p className="font-semibold">
            Project tidak ditemukan.
          </p>
        </div>

      </StudentAppShell>
    )
  }


  const businessName =
    project.umkm?.nama_toko ??
    project.umkm_profile?.nama_toko ??
    project.umkm?.user?.name ??
    'UMKM TUMBUH'


  const ownerName =
    project.umkm?.user?.name ??
    null


  const remainingDays =
    daysUntil(project.deadline)


  const checklist =
    Array.isArray(project.checklist)
      ? project.checklist
      : []


  const applicationStatus =
    currentApplication
      ?.status_lamaran


  const canApply =
    project.status === 'open' &&
    !currentApplication


  return (
    <StudentAppShell>

      {/* TOP BAR */}
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

        <span
          className="
            text-sm
            font-medium
            text-gray-500
          "
        >
          Detail Proyek
        </span>
      </header>


      {/* HERO */}
      <section
        className="
          relative
          mt-5
          overflow-hidden
          rounded-[30px]

          bg-gradient-to-b
          from-green-50
          to-[#71DB91]

          px-6
          pb-5
          pt-8
        "
      >

        <div
          className="
            flex
            min-h-[145px]
            items-center
            justify-center
          "
        >
          <img
            src="/assets/logo-tumbuh.png"
            alt=""
            className="
              h-28
              w-28
              object-contain
              drop-shadow-sm
            "
          />
        </div>


        <div
          className="
            absolute
            left-5
            top-5

            rounded-full
            bg-white/80
            px-3
            py-1.5

            text-[10px]
            font-semibold
            text-tumbuh-green-dark

            backdrop-blur
          "
        >
          {project.status === 'open'
            ? 'Open Project'
            : project.status}
        </div>

      </section>


      {/* PROJECT BASIC INFO */}
      <section className="mt-5">

        <h1
          className="
            text-[22px]
            font-semibold
            leading-7
            tracking-tight
          "
        >
          {project.judul}
        </h1>


        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          "
        >
          <Store size={15} />

          <span>
            {businessName}
          </span>
        </div>


        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >

          {project.kategori_jurusan && (
            <span
              className="
                rounded-full
                bg-cyan-100
                px-3
                py-1.5
                text-[10px]
                font-medium
                text-blue-500
              "
            >
              {project.kategori_jurusan}
            </span>
          )}


          <span
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-gray-300
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-medium
            "
          >
            <CircleDollarSign
              size={13}
            />

            {formatRupiah(
              project.anggaran
            )}
          </span>


          {project.deadline && (
            <span
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                bg-red-50
                px-3
                py-1.5
                text-[10px]
                font-medium
                text-red-500
              "
            >
              <CalendarDays
                size={13}
              />

              {formatDate(
                project.deadline
              )}
            </span>
          )}

        </div>

      </section>


      {/* RESPONSIVE BODY */}
      <div
        className="
          md:grid
          md:grid-cols-[1.5fr_0.8fr]
          md:gap-7
        "
      >

        <div>

          {/* DESCRIPTION */}
          <section className="mt-8">

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Deskripsi Proyek
            </h2>


            <p
              className="
                mt-3
                whitespace-pre-line
                text-[12px]
                leading-6
                text-gray-600
              "
            >
              {project.deskripsi_brief}
            </p>

          </section>


          {/* TASK CHECKLIST */}
          <section className="mt-8">

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Tugas yang Dikerjakan
            </h2>


            {checklist.length > 0 ? (
              <ul
                className="
                  mt-4
                  space-y-3
                "
              >
                {checklist.map(
                  (task, index) => (
                    <li
                      key={`${task}-${index}`}
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className="
                          mt-0.5
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-green-100
                          text-tumbuh-green-dark
                        "
                      >
                        <Check size={12} />
                      </div>

                      <span
                        className="
                          text-[12px]
                          leading-5
                          text-gray-600
                        "
                      >
                        {task}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <div
                className="
                  mt-4
                  rounded-2xl
                  bg-gray-50
                  p-4
                  text-xs
                  leading-5
                  text-gray-500
                "
              >
                UMKM belum menambahkan
                checklist tugas secara
                terpisah untuk proyek ini.
              </div>
            )}

          </section>


          {/* SKILLS */}
          <section className="mt-8">

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Skill yang Dibutuhkan
            </h2>


            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >

              {project.kategori_jurusan ? (
                <span
                  className="
                    rounded-full
                    bg-purple-100
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-purple-600
                  "
                >
                  {project.kategori_jurusan}
                </span>
              ) : (
                <span
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  Belum ada skill tag.
                </span>
              )}

            </div>

          </section>

        </div>


        {/* SIDE INFO */}
        <aside
          className="
            mt-8
            space-y-3

            md:sticky
            md:top-6
            md:self-start
          "
        >

          <div
            className="
              rounded-[24px]
              bg-white
              p-5
              shadow-[0_10px_35px_rgba(0,0,0,0.035)]
            "
          >

            <h3
              className="
                text-sm
                font-semibold
              "
            >
              Informasi Proyek
            </h3>


            <div
              className="
                mt-5
                space-y-4
              "
            >

              <InfoRow
                icon={BriefcaseBusiness}
                label="Status"
                value={
                  project.status === 'open'
                    ? 'Menerima pelamar'
                    : project.status
                }
              />


              <InfoRow
                icon={CalendarDays}
                label="Deadline"
                value={
                  formatDate(
                    project.deadline
                  ) ?? '-'
                }
              />


              <InfoRow
                icon={Clock3}
                label="Sisa waktu"
                value={
                  remainingDays === null
                    ? '-'
                    : remainingDays < 0
                      ? 'Deadline lewat'
                      : `${remainingDays} hari`
                }
              />


              <InfoRow
                icon={Store}
                label="Pemilik proyek"
                value={
                  ownerName ??
                  businessName
                }
              />

            </div>

          </div>

        </aside>

      </div>


      {/* MESSAGE */}
      {success && (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-green-100
            bg-green-50
            p-4
            text-sm
            text-green-700
          "
        >
          {success}
        </div>
      )}


      {error && (
        <div
          className="
            mt-8
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


      {/* APPLY CTA */}
      <section
        className="
          sticky
          bottom-[86px]
          z-30

          mt-10
          rounded-[24px]
          bg-white/95
          p-3

          shadow-[0_-6px_30px_rgba(0,0,0,0.06)]

          backdrop-blur

          md:static
          md:bg-transparent
          md:p-0
          md:shadow-none
        "
      >

        <ApplyButton
          project={project}
          applicationStatus={
            applicationStatus
          }
          canApply={canApply}
          applying={applying}
          onApply={handleApply}
        />

      </section>

    </StudentAppShell>
  )
}


function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-green-50
          text-tumbuh-green-dark
        "
      >
        <Icon size={17} />
      </div>


      <div className="min-w-0">

        <p
          className="
            text-[10px]
            text-gray-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            break-words
            text-xs
            font-medium
          "
        >
          {value}
        </p>

      </div>
    </div>
  )
}


function ApplyButton({
  project,
  applicationStatus,
  canApply,
  applying,
  onApply,
}) {
  if (applicationStatus === 'diajukan') {
    return (
      <Link
        to="/student/applications"

        className="
          flex
          h-14
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-blue-100
          font-semibold
          text-blue-600
        "
      >
        Lamaran Terkirim
      </Link>
    )
  }


  if (applicationStatus === 'dipilih') {
    return (
      <Link
        to="/student/projects"

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
        "
      >
        Buka Proyek Saya
      </Link>
    )
  }


  if (applicationStatus === 'ditolak') {
    return (
      <button
        type="button"
        disabled

        className="
          h-14
          w-full
          rounded-2xl
          bg-gray-200
          font-semibold
          text-gray-500
        "
      >
        Lamaran Tidak Dipilih
      </button>
    )
  }


  if (project.status !== 'open') {
    return (
      <button
        type="button"
        disabled

        className="
          h-14
          w-full
          rounded-2xl
          bg-gray-200
          font-semibold
          text-gray-500
        "
      >
        Project Tidak Menerima Lamaran
      </button>
    )
  }


  return (
    <button
      type="button"
      disabled={
        !canApply ||
        applying
      }

      onClick={onApply}

      className="
        h-14
        w-full
        rounded-2xl

        bg-tumbuh-green

        font-semibold
        text-white

        shadow-[0_8px_24px_rgba(108,216,135,0.28)]

        transition

        hover:bg-tumbuh-green-dark

        active:scale-[0.99]

        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {applying
        ? 'Mengirim Lamaran...'
        : 'Ajukan Lamaran'}
    </button>
  )
}