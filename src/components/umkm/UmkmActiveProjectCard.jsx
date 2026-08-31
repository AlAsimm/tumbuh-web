import {
  ArrowDownRight,
  MessageSquare,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  projectProgress,
  projectStatusLabel,
} from '../../lib/formatters'


export default function UmkmActiveProjectCard({
  project,
  index = 0,
}) {
  const progress =
    projectProgress(
      project.status
    )


  const backgroundClasses = [
    'bg-[#67D987]',
    'bg-[#91C2F7]',
    'bg-[#FCD351]',
  ]


  const background =
    backgroundClasses[
      index %
      backgroundClasses.length
    ]


  const selectedMember =
    project.members?.find(
      (member) =>
        member.status_lamaran ===
        'dipilih'
    ) ??
    project.selected_member


  const student =
    selectedMember?.siswa ??
    selectedMember?.student ??
    {}


  const studentName =
    student?.name ??
    'Siswa TUMBUH'


  const school =
    student?.smk_profile
      ?.nama_sekolah ??
    student?.smkProfile
      ?.nama_sekolah ??
    ''


  return (
    <article
      className={`
        rounded-[20px]

        px-4
        py-4

        ${background}
      `}
    >

      {/* TOP */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
          "
        >

          {/* STUDENT AVATAR */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-white/80

              text-[10px]
              font-semibold
              text-gray-700
            "
          >
            {studentName
              .split(' ')
              .map((name) =>
                name.charAt(0)
              )
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>


          <div className="min-w-0">

            <h3
              className="
                truncate
                text-[13px]
                font-medium
                text-gray-950
              "
            >
              {project.judul}
            </h3>


            <p
              className="
                mt-0.5
                truncate
                text-[8px]
                text-gray-700
              "
            >
              {selectedMember
                ? `dibuat oleh ${studentName}${
                    school
                      ? ` - ${school}`
                      : ''
                  }`
                : 'Menunggu siswa terpilih'}
            </p>

          </div>

        </div>


        <span
          className="
            shrink-0

            rounded-full

            bg-cyan-100

            px-3
            py-1.5

            text-[8px]
            font-semibold
            text-blue-500
          "
        >
          proses
        </span>

      </div>


      {/* PROGRESS */}

      <div
        className="
          mt-4
          flex
          items-end
          justify-between
          gap-3
        "
      >

        <div className="min-w-0 flex-1">

          <div
            className="
              flex
              items-end
              gap-1
            "
          >
            <strong
              className="
                text-[21px]
                font-semibold
                leading-none
                text-white
              "
            >
              {progress}%
            </strong>

            <span
              className="
                truncate
                pb-0.5
                text-[8px]
                text-white/95
              "
            >
              status:{' '}
              {projectStatusLabel(
                project.status
              )}
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
                bg-blue-500
              "

              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>

        </div>


        {/* ACTION */}

        <div
          className="
            flex
            shrink-0
            gap-2
          "
        >

          <Link
            to={
              `/umkm/projects/${project.id}/workspace?tab=chat`
            }

            className="
              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-full

              bg-white

              text-gray-700
            "
          >
            <MessageSquare
              size={15}
            />
          </Link>


          <Link
            to={
              `/umkm/projects/${project.id}`
            }

            className="
              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-full

              bg-white

              text-blue-500
            "
          >
            <ArrowDownRight
              size={15}
            />
          </Link>

        </div>

      </div>

    </article>
  )
}