import {
  ArrowUpRight,
  Heart,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  formatRupiah,
} from '../../lib/formatters'


export default function ExploreProjectCard({
  project,
  variant = 'green',
  favorite = false,
  onToggleFavorite,
}) {
  const backgrounds = {
    green: 'bg-[#71DB91]',
    blue: 'bg-[#A9D3F6]',
    yellow: 'bg-[#FCD351]',
  }

  const businessName =
    project.umkm?.nama_toko ??
    project.umkm?.user?.name ??
    project.umkm_profile?.nama_toko ??
    'UMKM TUMBUH'


  return (
    <article
      className={`
        rounded-[24px]
        p-4

        ${backgrounds[variant] ?? backgrounds.green}
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
            items-center
            gap-3
          "
        >

          {/* UMKM AVATAR */}
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/70
              text-lg
            "
          >
            🌱
          </div>


          <div className="min-w-0">

            <h3
              className="
                line-clamp-2
                text-[15px]
                font-semibold
                leading-5
              "
            >
              {project.judul}
            </h3>

            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-gray-700
              "
            >
              {businessName}
            </p>

          </div>

        </div>


        <span
          className="
            shrink-0
            rounded-full
            bg-white/40
            px-2
            py-1
            text-[10px]
            font-medium
          "
        >
          Open
        </span>

      </div>


      {/* DESCRIPTION */}
      <p
        className="
          mt-4
          line-clamp-2
          text-[11px]
          leading-[16px]
          text-gray-800
        "
      >
        {project.deskripsi_brief}
      </p>


      {/* FOOTER */}
      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            min-w-0
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
              rounded-full
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-medium
              text-gray-800
            "
          >
            {formatRupiah(project.anggaran)}
          </span>

        </div>


        <div
          className="
            flex
            shrink-0
            gap-2
          "
        >

          <button
            type="button"
            aria-label="Simpan project"

            onClick={() =>
              onToggleFavorite?.(project.id)
            }

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              transition
              active:scale-95
            "
          >
            <Heart
              size={17}
              className={
                favorite
                  ? 'fill-red-400 text-red-400'
                  : 'text-gray-600'
              }
            />
          </button>


          <Link
            to={`/student/projects/${project.id}`}

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              text-blue-500
              transition
              active:scale-95
            "
          >
            <ArrowUpRight size={17} />
          </Link>

        </div>

      </div>

    </article>
  )
}