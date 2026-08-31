import {
  CheckCircle2,
  X,
} from 'lucide-react'


export default function SelectApplicantModal({
  applicant,
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!applicant) {
    return null
  }


  const student =
    applicant.siswa ??
    applicant.student ??
    {}


  const profile =
    student.smk_profile ??
    student.smkProfile ??
    {}


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
          className="
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-full

            bg-green-100

            text-green-700
          "
        >
          <CheckCircle2
            size={23}
          />
        </div>


        <h2
          className="
            mt-5
            text-lg
            font-semibold
          "
        >
          Pilih siswa ini?
        </h2>


        <p
          className="
            mt-2

            text-[10px]
            leading-5
            text-gray-400
          "
        >
          Setelah dipilih, proyek akan
          mulai berjalan dan pelamar
          lainnya otomatis tidak dipilih.
        </p>


        {/* STUDENT */}

        <div
          className="
            mt-5

            rounded-[20px]

            bg-tumbuh-bg

            p-4
          "
        >

          <p
            className="
              text-sm
              font-semibold
            "
          >
            {student.name ??
              'Siswa TUMBUH'}
          </p>


          <p
            className="
              mt-1
              text-[9px]
              text-gray-400
            "
          >
            {profile.nama_sekolah ??
              'Sekolah belum tersedia'}
          </p>


          <p
            className="
              mt-1
              text-[9px]
              font-medium
              text-green-700
            "
          >
            {[
              profile.jurusan,
              profile.tingkat_kelas
                ? `Kelas ${profile.tingkat_kelas}`
                : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

        </div>


        {/* ACTION */}

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

            onClick={onConfirm}

            className="
              h-12

              rounded-2xl

              bg-tumbuh-green

              text-[10px]
              font-semibold
              text-white

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? 'Memproses...'
              : 'Ya, Pilih'}
          </button>

        </div>

      </div>

    </div>
  )
}