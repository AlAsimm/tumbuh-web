import {
  BadgeCheck,
  CalendarDays,
  Check,
  GraduationCap,
  School,
  UserRound,
  X,
} from 'lucide-react'

import {
  formatDate,
} from '../../lib/formatters'


export default function UmkmApplicantCard({
  applicant,
  onSelect,
  selecting = false,
  projectLocked = false,
}) {
  const student =
    applicant.siswa ??
    applicant.student ??
    {}


  const profile =
    student.smk_profile ??
    student.smkProfile ??
    {}


  const name =
    student.name ??
    'Siswa TUMBUH'


  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .map((part) =>
        part.charAt(0)
      )
      .slice(0, 2)
      .join('')
      .toUpperCase()


  const status =
    applicant.status_lamaran


  const selected =
    status === 'dipilih'

  const rejected =
    status === 'ditolak'


  return (
    <article
      className={`
        rounded-[26px]

        border

        p-5

        transition

        ${
          selected
            ? `
              border-green-200
              bg-green-50
            `
            : rejected
              ? `
                border-gray-100
                bg-gray-50
                opacity-65
              `
              : `
                border-gray-100
                bg-white
              `
        }
      `}
    >

      {/* STUDENT */}

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0

            items-center
            justify-center

            rounded-full

            text-sm
            font-semibold

            ${
              selected
                ? `
                  bg-tumbuh-green
                  text-white
                `
                : `
                  bg-blue-100
                  text-blue-600
                `
            }
          `}
        >
          {initials}
        </div>


        <div className="min-w-0 flex-1">

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <h2
              className="
                text-sm
                font-semibold
              "
            >
              {name}
            </h2>


            {selected && (
              <BadgeCheck
                size={16}
                className="
                  text-green-600
                "
              />
            )}

          </div>


          <div
            className="
              mt-2
              space-y-1.5
            "
          >

            <StudentMeta
              icon={School}
              text={
                profile.nama_sekolah ??
                'Sekolah belum tersedia'
              }
            />


            <StudentMeta
              icon={GraduationCap}
              text={
                [
                  profile.jurusan,
                  profile.tingkat_kelas
                    ? `Kelas ${profile.tingkat_kelas}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ') ||
                'Data jurusan belum tersedia'
              }
            />


            {applicant.applied_at && (
              <StudentMeta
                icon={CalendarDays}
                text={
                  `Melamar ${formatDate(
                    applicant.applied_at
                  )}`
                }
              />
            )}

          </div>

        </div>


        <ApplicantStatus
          status={status}
        />

      </div>


      {/* ACTION */}

      <div
        className="
          mt-5

          border-t
          border-gray-100

          pt-4
        "
      >

        {status === 'diajukan' &&
        !projectLocked ? (

          <button
            type="button"

            disabled={selecting}

            onClick={() =>
              onSelect(
                applicant
              )
            }

            className="
              flex
              h-11
              w-full

              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-tumbuh-green

              text-[10px]
              font-semibold
              text-white

              transition

              active:scale-[0.99]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Check size={15} />

            {selecting
              ? 'Memilih siswa...'
              : 'Pilih Siswa'}
          </button>

        ) : selected ? (

          <div
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-green-100

              text-[10px]
              font-semibold
              text-green-700
            "
          >
            <Check size={15} />

            Siswa Terpilih
          </div>

        ) : rejected ? (

          <div
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-gray-100

              text-[10px]
              font-medium
              text-gray-400
            "
          >
            <X size={14} />

            Tidak Dipilih
          </div>

        ) : null}

      </div>

    </article>
  )
}


function StudentMeta({
  icon: Icon,
  text,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5

        text-[9px]
        text-gray-400
      "
    >
      <Icon
        size={12}
        className="
          shrink-0
        "
      />

      <span
        className="
          truncate
        "
      >
        {text}
      </span>
    </div>
  )
}


function ApplicantStatus({
  status,
}) {
  const variants = {
    diajukan: {
      label: 'Pelamar Baru',
      className:
        'bg-blue-100 text-blue-600',
    },

    dipilih: {
      label: 'Dipilih',
      className:
        'bg-green-100 text-green-700',
    },

    ditolak: {
      label: 'Tidak Dipilih',
      className:
        'bg-gray-100 text-gray-500',
    },
  }


  const variant =
    variants[status] ??
    variants.diajukan


  return (
    <span
      className={`
        shrink-0

        rounded-full

        px-2.5
        py-1.5

        text-[7px]
        font-semibold

        ${variant.className}
      `}
    >
      {variant.label}
    </span>
  )
}