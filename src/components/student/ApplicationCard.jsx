import {
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  applicationStatusLabel,
  formatDate,
  formatRupiah,
} from '../../lib/formatters'


export default function ApplicationCard({
  application,
}) {
  const project =
    application.project ??
    application.proyek ??
    null

  if (!project) {
    return null
  }


  const businessName =
    project.umkm?.nama_toko ??
    project.umkm_profile?.nama_toko ??
    project.umkm?.user?.name ??
    'UMKM TUMBUH'


  const status =
    application.status_lamaran


  const statusClasses = {
    diajukan:
      'bg-blue-100 text-blue-600',

    dipilih:
      'bg-green-100 text-green-700',

    ditolak:
      'bg-red-100 text-red-600',
  }


  const cardClasses = {
    diajukan:
      'border-blue-100',

    dipilih:
      'border-green-200',

    ditolak:
      'border-red-100',
  }


  return (
    <article
      className={`
        rounded-[24px]
        border
        bg-white
        p-4

        shadow-[0_8px_30px_rgba(0,0,0,0.025)]

        ${cardClasses[status] ?? 'border-gray-200'}
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

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
          "
        >

          {/* PROJECT ICON */}

          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center

              rounded-2xl

              bg-gradient-to-br
              from-green-50
              to-green-100
            "
          >
            <img
              src="/assets/logo-tumbuh.png"
              alt=""
              className="
                h-9
                w-9
                object-contain
              "
            />
          </div>


          {/* TITLE */}

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
                text-[11px]
                text-gray-500
              "
            >
              {businessName}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <span
          className={`
            shrink-0
            rounded-full
            px-3
            py-1.5

            text-[9px]
            font-semibold

            ${
              statusClasses[status] ??
              'bg-gray-100 text-gray-500'
            }
          `}
        >
          {applicationStatusLabel(status)}
        </span>

      </div>


      {/* TAGS */}

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

              text-[9px]
              font-medium
              text-blue-500
            "
          >
            {project.kategori_jurusan}
          </span>
        )}


        <span
          className="
            rounded-full
            border
            border-gray-300
            px-3
            py-1.5

            text-[9px]
            font-medium
          "
        >
          {formatRupiah(project.anggaran)}
        </span>

      </div>


      {/* BOTTOM INFO */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3

          border-t
          border-gray-100
          pt-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-1.5

            text-[10px]
            text-gray-400
          "
        >
          <CalendarDays size={13} />

          <span>
            Dikirim{' '}
            {formatDate(
              application.applied_at ??
              application.created_at
            ) ?? '-'}
          </span>
        </div>


        <Link
          to={`/student/projects/${project.id}`}

          aria-label="Lihat detail proyek"

          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center

            rounded-full

            border
            border-gray-200

            text-blue-500

            transition

            hover:bg-blue-50

            active:scale-95
          "
        >
          <ArrowUpRight size={16} />
        </Link>

      </div>


      {/* ACCEPTED MESSAGE */}

      {status === 'dipilih' && (
        <div
          className="
            mt-3
            rounded-2xl

            bg-green-50
            px-4
            py-3

            text-[10px]
            leading-4
            text-green-700
          "
        >
          Selamat! Kamu dipilih untuk
          mengerjakan proyek ini.
        </div>
      )}

    </article>
  )
}