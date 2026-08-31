import {
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react'


export default function FinalReviewConfirmModal({
  decision,
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!decision) {
    return null
  }


  const accepted =
    decision === 'accepted'


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-end
        justify-center

        bg-black/40

        backdrop-blur-sm

        sm:items-center
        sm:p-6
      "
    >

      <div
        className="
          relative

          w-full
          max-w-[430px]

          rounded-t-[32px]

          bg-white

          px-6
          pb-8
          pt-6

          sm:rounded-[32px]
        "
      >

        <button
          type="button"

          disabled={loading}

          onClick={onClose}

          className="
            absolute
            right-5
            top-5

            flex
            h-9
            w-9

            items-center
            justify-center

            rounded-full

            bg-gray-100

            text-gray-500

            disabled:opacity-50
          "
        >
          <X size={17} />
        </button>


        <div
          className={`
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-full

            ${
              accepted
                ? `
                  bg-green-100
                  text-green-700
                `
                : `
                  bg-orange-100
                  text-orange-600
                `
            }
          `}
        >

          {accepted ? (
            <CheckCircle2
              size={23}
            />
          ) : (
            <AlertTriangle
              size={23}
            />
          )}

        </div>


        <h2
          className="
            mt-5
            text-lg
            font-semibold
          "
        >
          {accepted
            ? 'Terima hasil proyek?'
            : 'Ajukan mediasi?'}
        </h2>


        <p
          className="
            mt-2

            text-[10px]
            leading-5
            text-gray-400
          "
        >

          {accepted
            ? `
              Setelah diterima, proyek
              akan ditandai selesai dan
              portfolio terverifikasi
              siswa akan dibuat otomatis.
            `
            : `
              Proyek akan masuk tahap
              mediasi agar permasalahan
              hasil kerja dapat ditinjau
              lebih lanjut.
            `}

        </p>


        <div
          className="
            mt-6

            grid
            grid-cols-2
            gap-3
          "
        >

          <button
            type="button"

            disabled={loading}

            onClick={onClose}

            className="
              h-12

              rounded-2xl

              border
              border-gray-200

              text-[10px]
              font-semibold

              disabled:opacity-50
            "
          >
            Batal
          </button>


          <button
            type="button"

            disabled={loading}

            onClick={
              onConfirm
            }

            className={`
              h-12

              rounded-2xl

              text-[10px]
              font-semibold
              text-white

              disabled:opacity-50

              ${
                accepted
                  ? 'bg-tumbuh-green'
                  : 'bg-orange-500'
              }
            `}
          >
            {loading
              ? 'Memproses...'
              : accepted
                ? 'Ya, Terima'
                : 'Ya, Mediasi'}
          </button>

        </div>

      </div>

    </div>
  )
}