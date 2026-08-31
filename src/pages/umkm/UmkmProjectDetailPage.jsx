import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Store,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
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


function unwrapProjects(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.projects)) {
    return data.projects
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}


export default function UmkmProjectDetailPage() {
  const {
    projectId,
  } = useParams()

  const navigate =
    useNavigate()

  const [
    project,
    setProject,
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
    const loadProject =
      async () => {

        setLoading(true)
        setError('')

        try {
          /*
           * Gunakan /my-projects sebagai source of truth
           * agar halaman ini hanya membuka project milik
           * UMKM yang sedang login.
           */
          const response =
            await api.get(
              '/my-projects'
            )

          const projects =
            unwrapProjects(
              response.data
            )

          const currentProject =
            projects.find(
              (item) =>
                String(item.id) ===
                String(projectId)
            )

          if (!currentProject) {
            setError(
              'Proyek tidak ditemukan atau bukan milik UMKM ini.'
            )
            return
          }

          setProject(
            currentProject
          )

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Detail proyek belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }


    loadProject()
  }, [projectId])


  const selectedMember =
    useMemo(() => {

      if (!project) {
        return null
      }

      return (
        project.members?.find(
          (member) =>
            member.status_lamaran ===
            'dipilih'
        ) ??
        project.selected_member ??
        project.selectedMember ??
        null
      )

    }, [project])


  const student =
    selectedMember?.siswa ??
    selectedMember?.student ??
    null


  const studentProfile =
    student?.smk_profile ??
    student?.smkProfile ??
    {}


  const checklist =
    Array.isArray(
      project?.checklist
    )
      ? project.checklist
      : []


  const progress =
    project
      ? projectProgress(
          project.status
        )
      : 0


  const primaryAction =
    useMemo(() => {

      if (!project) {
        return null
      }


      if (
        project.status ===
        'open'
      ) {
        return {
          label:
            'Lihat Pelamar',
          icon:
            Users,
          path:
            `/umkm/projects/${project.id}/applicants`,
        }
      }


      if (
        [
          'in_progress',
          'teacher_review',
          'mediation',
        ].includes(
          project.status
        )
      ) {
        return {
          label:
            'Buka Workspace',
          icon:
            ChevronRight,
          path:
            `/umkm/projects/${project.id}/workspace`,
        }
      }


      if (
        project.status ===
        'umkm_review'
      ) {
        return {
          label:
            'Review Hasil',
          icon:
            ChevronRight,
          path:
            `/umkm/projects/${project.id}/review`,
        }
      }


      return null

    }, [project])


  const canOpenChat =
    [
      'in_progress',
      'teacher_review',
      'umkm_review',
      'mediation',
    ].includes(
      project?.status
    )


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
              text-tumbuh-green-dark
            "
          >
            Membuka proyek...
          </p>
        </div>

      </UmkmAppShell>
    )
  }


  if (
    error ||
    !project
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
            shadow-sm
          "
        >
          <ArrowLeft
            size={19}
          />
        </button>


        <div
          className="
            mt-8
            rounded-[26px]
            bg-red-50
            p-6
            text-sm
            text-red-600
          "
        >
          {error ||
            'Proyek tidak tersedia.'}
        </div>

      </UmkmAppShell>
    )
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
          <ArrowLeft
            size={19}
          />
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
            Detail Proyek
          </p>


          <h1
            className="
              mt-0.5
              truncate
              text-[21px]
              font-semibold
            "
          >
            {project.judul}
          </h1>

        </div>

      </header>


      {/* STATUS HERO */}

      <section
        className="
          mt-6
          rounded-[28px]
          bg-[#67D987]
          p-5
          text-white
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-[9px]
                font-medium
                text-white/80
              "
            >
              Progress proyek
            </p>


            <div
              className="
                mt-2
                flex
                items-end
                gap-2
              "
            >
              <strong
                className="
                  text-[31px]
                  font-semibold
                  leading-none
                "
              >
                {progress}%
              </strong>

              <span
                className="
                  pb-0.5
                  text-[9px]
                  text-white/90
                "
              >
                {projectStatusLabel(
                  project.status
                )}
              </span>
            </div>

          </div>


          <div
            className="
              rounded-full
              bg-white/20
              px-3
              py-1.5
              text-[8px]
              font-semibold
            "
          >
            {projectStatusLabel(
              project.status
            )}
          </div>

        </div>


        <div
          className="
            mt-4
            h-2
            overflow-hidden
            rounded-full
            bg-white/35
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-white
            "

            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>

      </section>


      {/* MAIN INFO */}

      <section
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
      >

        <InfoCard
          icon={
            Wallet
          }
          label="Anggaran"
          value={
            formatRupiah(
              project.anggaran ??
              0
            )
          }
        />


        <InfoCard
          icon={
            CalendarDays
          }
          label="Deadline"
          value={
            formatDate(
              project.deadline
            ) ??
            '-'
          }
        />


        <InfoCard
          icon={
            ClipboardList
          }
          label="Kategori"
          value={
            project
              .kategori_jurusan ??
            '-'
          }
        />


        <InfoCard
          icon={
            Store
          }
          label="Status"
          value={
            projectStatusLabel(
              project.status
            )
          }
        />

      </section>


      {/* BRIEF */}

      <section
        className="
          mt-5
          rounded-[26px]
          bg-white
          p-5
          shadow-[0_8px_28px_rgba(0,0,0,0.025)]
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Brief Proyek
        </h2>


        <p
          className="
            mt-3
            whitespace-pre-line
            text-[10px]
            leading-5
            text-gray-500
          "
        >
          {project
            .deskripsi_brief ??
            'Belum ada deskripsi proyek.'}
        </p>

      </section>


      {/* STUDENT */}

      <section
        className="
          mt-5
          rounded-[26px]
          bg-white
          p-5
          shadow-[0_8px_28px_rgba(0,0,0,0.025)]
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <UserRound
            size={17}
            className="
              text-tumbuh-green-dark
            "
          />

          <h2
            className="
              text-sm
              font-semibold
            "
          >
            Siswa Terpilih
          </h2>
        </div>


        {student ? (

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
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-xs
                font-semibold
                text-green-700
              "
            >
              {student.name
                ?.split(' ')
                .map(
                  (word) =>
                    word.charAt(0)
                )
                .slice(0, 2)
                .join('')
                .toUpperCase() ??
                'S'}
            </div>


            <div className="min-w-0">

              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                "
              >
                {student.name}
              </p>


              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  text-gray-400
                "
              >
                {[
                  studentProfile
                    .nama_sekolah,
                  studentProfile
                    .jurusan,
                ]
                  .filter(Boolean)
                  .join(' · ') ||
                  'Profil siswa'}
              </p>

            </div>

          </div>

        ) : (

          <p
            className="
              mt-3
              text-[10px]
              text-gray-400
            "
          >
            Belum ada siswa yang dipilih.
          </p>

        )}

      </section>


      {/* CHECKLIST */}

      <section
        className="
          mt-5
          rounded-[26px]
          bg-white
          p-5
          shadow-[0_8px_28px_rgba(0,0,0,0.025)]
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Checklist Hasil
        </h2>


        {checklist.length >
        0 ? (

          <div
            className="
              mt-4
              space-y-3
            "
          >
            {checklist.map(
              (
                item,
                index
              ) => (

                <div
                  key={`${item}-${index}`}

                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="
                      mt-0.5
                      shrink-0
                      text-green-500
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      leading-4
                      text-gray-600
                    "
                  >
                    {typeof item ===
                    'string'
                      ? item
                      : item?.text ??
                        item?.label ??
                        String(item)}
                  </p>
                </div>

              )
            )}
          </div>

        ) : (

          <p
            className="
              mt-3
              text-[10px]
              text-gray-400
            "
          >
            Belum ada checklist.
          </p>

        )}

      </section>


      {/* ACTIONS */}

      <section
        className="
          mt-6
          space-y-3
          pb-4
        "
      >

        {primaryAction && (
          <button
            type="button"

            onClick={() =>
              navigate(
                primaryAction.path
              )
            }

            className="
              flex
              h-13
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-tumbuh-green
              px-5
              py-3.5
              text-xs
              font-semibold
              text-white
              shadow-[0_8px_24px_rgba(108,216,135,0.25)]
            "
          >
            <primaryAction.icon
              size={16}
            />

            {
              primaryAction.label
            }
          </button>
        )}


        {canOpenChat && (
          <button
            type="button"

            onClick={() =>
              navigate(
                `/umkm/projects/${project.id}/workspace?tab=chat`
              )
            }

            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-[10px]
              font-semibold
              text-gray-700
            "
          >
            <MessageSquare
              size={15}
            />

            Buka Chat Proyek
          </button>
        )}


        {project.status ===
          'draft' && (

          <button
            type="button"

            onClick={() =>
              navigate(
                '/umkm/projects'
              )
            }

            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-[10px]
              font-semibold
            "
          >
            Kelola & Publikasikan
          </button>

        )}

      </section>

    </UmkmAppShell>
  )
}


function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-[22px]
        bg-white
        p-4
        shadow-[0_7px_24px_rgba(0,0,0,0.025)]
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
          text-green-700
        "
      >
        <Icon
          size={15}
        />
      </div>


      <p
        className="
          mt-3
          text-[8px]
          text-gray-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          truncate
          text-[10px]
          font-semibold
        "
      >
        {value}
      </p>

    </div>
  )
}
