import {
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react'

import {
  formatRupiah,
  projectProgress,
  projectStatusLabel,
} from '../../lib/formatters'

export default function StudentProjectCard({
  project,
  compact = false,
}) {
  const progress =
    projectProgress(project.status)

  const businessName =
    project.umkm?.nama_toko ??
    project.umkm_profile?.nama_toko ??
    project.umkm?.user?.name ??
    'UMKM TUMBUH'

  return (
    <article
      className="
        rounded-[22px]
        border
        border-gray-200
        bg-white
        p-4
      "
    >
      <div className="flex gap-3">

        <div
          className="
            flex
            h-20
            w-20
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-emerald-100
            text-3xl
          "
        >
          🌱
        </div>

        <div className="min-w-0 flex-1">

          <h3
            className="
              line-clamp-2
              text-sm
              font-semibold
              text-gray-950
            "
          >
            {project.judul}
          </h3>

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

          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-1.5
            "
          >
            {project.kategori_jurusan && (
              <span
                className="
                  rounded-full
                  bg-cyan-100
                  px-2
                  py-1
                  text-[9px]
                  font-medium
                  text-blue-500
                "
              >
                {project.kategori_jurusan}
              </span>
            )}

            {project.anggaran && (
              <span
                className="
                  rounded-full
                  border
                  border-gray-300
                  px-2
                  py-1
                  text-[9px]
                "
              >
                {formatRupiah(project.anggaran)}
              </span>
            )}
          </div>

          {!compact && (
            <p
              className="
                mt-3
                line-clamp-2
                text-[10px]
                leading-4
                text-gray-500
              "
            >
              {project.deskripsi_brief}
            </p>
          )}

        </div>
      </div>

      {project.status !== 'open' && (
        <div className="mt-4">

          <div
            className="
              mb-1.5
              flex
              items-end
              justify-between
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
              h-1.5
              overflow-hidden
              rounded-full
              bg-gray-200
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-tumbuh-green-dark
                transition-all
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>
      )}

      <div
        className="
          mt-3
          flex
          justify-end
          gap-2
        "
      >
        {project.status !== 'open' && (
          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-gray-300
            "
          >
            <MessageCircle size={15} />
          </button>
        )}

        <button
          type="button"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-gray-300
            text-blue-500
          "
        >
          <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  )
}