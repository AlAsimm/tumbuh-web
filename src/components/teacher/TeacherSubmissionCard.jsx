import {
  ArrowUpRight,
  CalendarDays,
  GraduationCap,
  School,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  formatDate,
} from '../../lib/formatters'


export default function TeacherSubmissionCard({
  submission,
}) {
  const member =
    submission.project_member ??
    submission.projectMember ??
    {}

  const project =
    member.project ??
    submission.project ??
    {}

  const student =
    member.siswa ??
    member.student ??
    submission.siswa ??
    {}

  const profile =
    student.smk_profile ??
    student.smkProfile ??
    {}


  return (
    <article
      className="
        rounded-[24px]
        border
        border-gray-100
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
        <div className="min-w-0">
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-widest
              text-purple-500
            "
          >
            Menunggu Validasi
          </p>

          <h2
            className="
              mt-1
              line-clamp-2
              text-sm
              font-semibold
            "
          >
            {project.judul ??
              'Proyek TUMBUH'}
          </h2>
        </div>


        <span
          className="
            shrink-0
            rounded-full
            bg-purple-100
            px-3
            py-1.5
            text-[8px]
            font-semibold
            text-purple-600
          "
        >
          V{submission.versi ?? '-'}
        </span>
      </div>


      <div
        className="
          mt-4
          space-y-2
        "
      >
        <MetaRow
          icon={GraduationCap}
          text={
            student.name ??
            'Siswa TUMBUH'
          }
        />

        <MetaRow
          icon={School}
          text={
            [
              profile.nama_sekolah,
              profile.jurusan,
            ]
              .filter(Boolean)
              .join(' · ') ||
            'Data sekolah belum tersedia'
          }
        />

        {submission.submitted_at && (
          <MetaRow
            icon={CalendarDays}
            text={
              `Dikirim ${formatDate(
                submission.submitted_at
              )}`
            }
          />
        )}
      </div>


      <Link
        to={
          `/teacher/submissions/${submission.id}`
        }
        className="
          mt-5
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-gray-900
          text-[9px]
          font-semibold
          text-white
        "
      >
        Periksa Submission
        <ArrowUpRight size={14} />
      </Link>

    </article>
  )
}


function MetaRow({
  icon: Icon,
  text,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-[9px]
        text-gray-400
      "
    >
      <Icon
        size={12}
        className="shrink-0"
      />
      <span className="truncate">
        {text}
      </span>
    </div>
  )
}
