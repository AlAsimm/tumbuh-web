import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  MessageSquare,
  Send,
  Users,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  formatDate,
  formatRupiah,
  projectProgress,
  umkmProjectStatusMeta,
} from '../../lib/formatters'


export default function UmkmProjectCard({
  project,
  index = 0,
  publishing = false,
  onPublish,
}) {
  const statusMeta =
    umkmProjectStatusMeta(
      project.status
    )


  const progress =
    projectProgress(
      project.status
    )


  const colors = [
    'bg-[#E7FAEC]',
    'bg-[#E8F4FF]',
    'bg-[#FFF6CC]',
  ]


  const cardColor =
    colors[index % colors.length]


  const members =
    Array.isArray(project.members)
      ? project.members
      : []


  const applicantCount =
    members.filter(
      (member) =>
        member.status_lamaran ===
        'diajukan'
    ).length


  const selectedMember =
    members.find(
      (member) =>
        member.status_lamaran ===
        'dipilih'
    )


  const student =
    selectedMember?.siswa ??
    selectedMember?.student


  const studentName =
    student?.name


  return (
    <article
      className={`
        rounded-[26px]
        p-5
        ${cardColor}
      `}
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div className="min-w-0 flex-1">

          <h2
            className="
              line-clamp-2
              text-[14px]
              font-semibold
              leading-5
            "
          >
            {project.judul}
          </h2>


          <p
            className="
              mt-1
              line-clamp-2
              text-[9px]
              leading-4
              text-gray-500
            "
          >
            {project.deskripsi_brief}
          </p>

        </div>


        <span
          className={`
            shrink-0

            rounded-full

            px-3
            py-1.5

            text-[8px]
            font-semibold

            ${statusMeta.className}
          `}
        >
          {statusMeta.label}
        </span>

      </div>


      {/* META */}

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
              bg-white/70
              px-3
              py-1.5
              text-[8px]
              font-medium
            "
          >
            {project.kategori_jurusan}
          </span>
        )}


        <span
          className="
            rounded-full
            bg-white/70
            px-3
            py-1.5
            text-[8px]
            font-medium
          "
        >
          {formatRupiah(
            project.anggaran
          )}
        </span>


        {project.deadline && (
          <span
            className="
              flex
              items-center
              gap-1

              rounded-full

              bg-white/70

              px-3
              py-1.5

              text-[8px]
            "
          >
            <CalendarDays size={10} />

            {formatDate(
              project.deadline
            )}
          </span>
        )}

      </div>


      {/* SELECTED STUDENT */}

      {studentName && (
        <div
          className="
            mt-4
            flex
            items-center
            gap-2

            rounded-2xl

            bg-white/55

            px-3
            py-2
          "
        >

          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center

              rounded-full

              bg-white

              text-[8px]
              font-semibold
            "
          >
            {studentName
              .split(' ')
              .map((part) =>
                part.charAt(0)
              )
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>


          <div>
            <p
              className="
                text-[8px]
                text-gray-400
              "
            >
              Siswa terpilih
            </p>

            <p
              className="
                text-[9px]
                font-semibold
              "
            >
              {studentName}
            </p>
          </div>

        </div>
      )}


      {/* OPEN APPLICANTS */}

      {project.status === 'open' && (
        <div
          className="
            mt-4

            flex
            items-center
            justify-between

            rounded-2xl

            bg-white/55

            px-3
            py-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Users
              size={15}
              className="
                text-blue-500
              "
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                "
              >
                {applicantCount} pelamar
              </p>

              <p
                className="
                  text-[8px]
                  text-gray-400
                "
              >
                menunggu keputusan
              </p>
            </div>

          </div>

        </div>
      )}


      {/* PROGRESS */}

      {![
        'draft',
        'open',
      ].includes(project.status) && (
        <div className="mt-5">

          <div
            className="
              flex
              items-end
              gap-1.5
            "
          >
            <strong
              className="
                text-xl
                font-semibold
                text-gray-900
              "
            >
              {progress}%
            </strong>

            <span
              className="
                pb-1
                text-[8px]
                text-gray-500
              "
            >
              progress alur proyek
            </span>
          </div>


          <div
            className="
              mt-1.5

              h-1.5

              overflow-hidden

              rounded-full

              bg-white/80
            "
          >
            <div
              className="
                h-full

                rounded-full

                bg-tumbuh-green-dark
              "

              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>

        </div>
      )}


      {/* ACTION */}

      <div
        className="
          mt-5

          flex
          items-center
          justify-end
          gap-2
        "
      >

        <ProjectActions
          project={project}

          publishing={
            publishing
          }

          onPublish={
            onPublish
          }
        />

      </div>

    </article>
  )
}


function ProjectActions({
  project,
  publishing,
  onPublish,
}) {

  /*
   * DRAFT
   */

  if (project.status === 'draft') {
    return (
      <button
        type="button"

        disabled={
          publishing
        }

        onClick={() =>
          onPublish(
            project
          )
        }

        className="
          flex
          items-center
          gap-2

          rounded-full

          bg-tumbuh-green

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-white

          disabled:opacity-50
        "
      >
        <Send size={13} />

        {publishing
          ? 'Publishing...'
          : 'Publish'}
      </button>
    )
  }


  /*
   * OPEN
   */

  if (project.status === 'open') {
    return (
      <Link
        to={
          `/umkm/projects/${project.id}/applicants`
        }

        className="
          flex
          items-center
          gap-2

          rounded-full

          bg-blue-500

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-white
        "
      >
        <Users size={13} />

        Lihat Pelamar
      </Link>
    )
  }


  /*
   * IN PROGRESS
   */

  if (
    project.status ===
    'in_progress'
  ) {
    return (
      <>
        <Link
          to={
            `/umkm/projects/${project.id}/workspace?tab=chat`
          }

          className="
            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            bg-white

            text-gray-700
          "
        >
          <MessageSquare size={15} />
        </Link>


        <Link
          to={
            `/umkm/projects/${project.id}/workspace`
          }

          className="
            flex
            items-center
            gap-2

            rounded-full

            bg-gray-900

            px-4
            py-2.5

            text-[9px]
            font-semibold
            text-white
          "
        >
          Workspace

          <ArrowUpRight size={13} />
        </Link>
      </>
    )
  }


  /*
   * TEACHER REVIEW
   */

  if (
    project.status ===
    'teacher_review'
  ) {
    return (
      <span
        className="
          flex
          items-center
          gap-2

          rounded-full

          bg-white/70

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-purple-600
        "
      >
        <CheckCircle2 size={13} />

        Menunggu Guru
      </span>
    )
  }


  /*
   * UMKM REVIEW
   */

  if (
    project.status ===
    'umkm_review'
  ) {
    return (
      <Link
        to={
          `/umkm/projects/${project.id}/review`
        }

        className="
          flex
          items-center
          gap-2

          rounded-full

          bg-orange-500

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-white
        "
      >
        <Eye size={13} />

        Review Hasil
      </Link>
    )
  }


  /*
   * MEDIATION
   */

  if (
    project.status ===
    'mediation'
  ) {
    return (
      <span
        className="
          rounded-full

          bg-red-100

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-red-600
        "
      >
        Dalam Mediasi
      </span>
    )
  }


  /*
   * COMPLETED
   */

  if (
    project.status ===
    'completed'
  ) {
    return (
      <span
        className="
          flex
          items-center
          gap-2

          rounded-full

          bg-green-100

          px-4
          py-2.5

          text-[9px]
          font-semibold
          text-green-700
        "
      >
        <CheckCircle2 size={13} />

        Selesai
      </span>
    )
  }


  return null
}