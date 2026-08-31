import {
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  formatDate,
  projectProgress,
  projectStatusLabel,
} from '../../lib/formatters'


export default function MyProjectCard({
  project,
  index = 0,
}) {
  const progress =
    projectProgress(project.status)

  const colors = [
    'bg-[#71DB91]',
    'bg-[#A9D3F6]',
    'bg-[#FCD351]',
  ]

  const cardColor =
    colors[index % colors.length]


  const businessName =
    project.umkm?.nama_toko ??
    project.umkm_profile?.nama_toko ??
    project.umkm?.user?.name ??
    'UMKM TUMBUH'


  return (
    <article
      className={`
        rounded-[24px]
        p-4
        ${cardColor}
      `}
    >

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

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/75
            "
          >
            <img
              src="/assets/logo-tumbuh.png"
              alt=""
              className="h-8 w-8 object-contain"
            />
          </div>


          <div className="min-w-0">

            <h2
              className="
                line-clamp-2
                text-sm
                font-semibold
                leading-5
              "
            >
              {project.judul}
            </h2>

            <p
              className="
                mt-0.5
                truncate
                text-[10px]
                text-gray-700
              "
            >
              {businessName}

              {project.deadline && (
                <>
                  {' '}
                  | Deadline:{' '}
                  {formatDate(
                    project.deadline
                  )}
                </>
              )}
            </p>

          </div>

        </div>


        <span
          className="
            shrink-0
            rounded-full
            bg-white/70
            px-3
            py-1.5
            text-[9px]
            font-medium
          "
        >
          {projectStatusLabel(
            project.status
          )}
        </span>

      </div>


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
              text-2xl
              font-semibold
              text-white
            "
          >
            {progress}%
          </strong>

          <span
            className="
              pb-1
              text-[9px]
              text-white/90
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
            mt-1
            h-1.5
            overflow-hidden
            rounded-full
            bg-white/75
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-tumbuh-green-dark
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>


      <div
        className="
          mt-3
          flex
          justify-end
          gap-2
        "
      >

        <Link
          to={`/student/projects/${project.id}/workspace?tab=chat`}
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
          <MessageCircle size={16} />
        </Link>


        <Link
          to={`/student/projects/${project.id}/workspace`}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-blue-500
          "
        >
          <ArrowUpRight size={16} />
        </Link>

      </div>

    </article>
  )
}