import {
  CheckCircle2,
  QrCode,
  Star,
} from 'lucide-react'

import {
  formatDate,
  formatRupiah,
} from '../../lib/formatters'


export default function PortfolioProjectCard({
  portfolio,
  onShowQr,
}) {
  const project =
    portfolio.project ?? {}


  const businessName =
    project.umkm?.nama_toko ??
    project.umkm?.user?.name ??
    'UMKM TUMBUH'


  const review =
    project.review ??
    portfolio.review


  return (
    <article
      className="
        rounded-[24px]

        border
        border-gray-100

        bg-white

        p-4

        shadow-[0_8px_30px_rgba(0,0,0,0.025)]
      "
    >

      <div className="flex gap-3">

        {/* THUMBNAIL */}

        <div
          className="
            flex
            h-20
            w-20
            shrink-0

            items-center
            justify-center

            rounded-2xl

            bg-gradient-to-br
            from-pink-100
            to-orange-100
          "
        >
          <img
            src="/assets/logo-tumbuh.png"
            alt=""
            className="
              h-11
              w-11
              object-contain
            "
          />
        </div>


        <div className="min-w-0 flex-1">

          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >

            <div className="min-w-0">

              <h3
                className="
                  line-clamp-2
                  text-sm
                  font-semibold
                "
              >
                {project.judul}
              </h3>


              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  text-gray-400
                "
              >
                {businessName}
              </p>

            </div>


            <div
              className="
                flex
                shrink-0
                items-center
                gap-1

                rounded-full

                bg-green-100

                px-2
                py-1

                text-[8px]
                font-semibold
                text-green-700
              "
            >
              <CheckCircle2
                size={11}
              />

              Verified
            </div>

          </div>


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

                  text-[8px]
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
                  border-gray-200

                  px-2
                  py-1

                  text-[8px]
                "
              >
                {formatRupiah(
                  project.anggaran
                )}
              </span>
            )}

          </div>


          {review?.rating && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-1

                text-[9px]
                font-medium
              "
            >
              <Star
                size={12}
                className="
                  fill-yellow-400
                  text-yellow-400
                "
              />

              {review.rating}/5
            </div>
          )}

        </div>

      </div>


      {/* DESCRIPTION */}

      {review?.komentar && (
        <p
          className="
            mt-3
            line-clamp-2

            text-[10px]
            leading-4
            text-gray-500
          "
        >
          “{review.komentar}”
        </p>
      )}


      {/* FOOTER */}

      <div
        className="
          mt-4

          flex
          items-center
          justify-between

          border-t
          border-gray-100

          pt-3
        "
      >

        <span
          className="
            text-[9px]
            text-gray-400
          "
        >
          Dipublikasikan{' '}
          {formatDate(
            portfolio.published_at
          ) ?? '-'}
        </span>


        <button
          type="button"

          onClick={() =>
            onShowQr(portfolio)
          }

          className="
            flex
            items-center
            gap-1.5

            rounded-full

            bg-tumbuh-green

            px-3
            py-2

            text-[9px]
            font-semibold
            text-white
          "
        >
          <QrCode size={13} />

          QR Verify
        </button>

      </div>

    </article>
  )
}