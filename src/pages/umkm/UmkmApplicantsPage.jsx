import {
  ArrowLeft,
  BriefcaseBusiness,
  Search,
  Users,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  formatRupiah,
} from '../../lib/formatters'

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import UmkmApplicantCard
  from '../../components/umkm/UmkmApplicantCard'

import SelectApplicantModal
  from '../../components/umkm/SelectApplicantModal'


function unwrapApplicants(
  data
) {
  if (
    Array.isArray(data)
  ) {
    return {
      project: null,
      applicants: data,
    }
  }


  return {
    project:
      data?.project ??
      null,

    applicants:
      Array.isArray(
        data?.applicants
      )
        ? data.applicants

        : Array.isArray(
            data?.data
          )
          ? data.data
          : [],
  }
}


export default function UmkmApplicantsPage() {
  const navigate =
    useNavigate()

  const {
    projectId,
  } = useParams()


  const [
    project,
    setProject,
  ] = useState(null)

  const [
    applicants,
    setApplicants,
  ] = useState([])

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  const [
    selectedApplicant,
    setSelectedApplicant,
  ] = useState(null)

  const [
    selectingId,
    setSelectingId,
  ] = useState(null)


  const loadApplicants =
    async () => {

      setLoading(true)
      setError('')


      try {
        const response =
          await api.get(
            `/projects/${projectId}/applicants`
          )


        const result =
          unwrapApplicants(
            response.data
          )


        setApplicants(
          result.applicants
        )


        /*
         * Beberapa versi endpoint
         * applicants mungkin belum
         * mengembalikan project.
         *
         * Kalau tidak ada, ambil
         * project secara terpisah.
         */

        if (result.project) {
          setProject(
            result.project
          )

        } else {
          const projectResponse =
            await api.get(
              `/projects/${projectId}`
            )


          setProject(
            projectResponse
              .data
              ?.project ??
            projectResponse
              .data
              ?.data ??
            projectResponse.data
          )
        }

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Daftar pelamar belum dapat dimuat.'
        )

      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    loadApplicants()
  }, [projectId])


  const filteredApplicants =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase()


      if (!keyword) {
        return applicants
      }


      return applicants.filter(
        (applicant) => {

          const student =
            applicant.siswa ??
            applicant.student ??
            {}


          const profile =
            student.smk_profile ??
            student.smkProfile ??
            {}


          return [
            student.name,
            profile.nama_sekolah,
            profile.jurusan,
          ]
            .filter(Boolean)
            .some(
              (value) =>
                value
                  .toLowerCase()
                  .includes(
                    keyword
                  )
            )
        }
      )

    }, [
      applicants,
      search,
    ])


  const pendingCount =
    applicants.filter(
      (applicant) =>
        applicant.status_lamaran ===
        'diajukan'
    ).length


  const chosenApplicant =
    applicants.find(
      (applicant) =>
        applicant.status_lamaran ===
        'dipilih'
    )


  const projectLocked =
    Boolean(
      chosenApplicant
    ) ||
    (
      project &&
      project.status !== 'open'
    )


  const handleSelect =
    async () => {

      if (
        !selectedApplicant
      ) {
        return
      }


      const application =
        selectedApplicant


      setSelectingId(
        application.id
      )

      setError('')
      setSuccess('')


      try {
        await api.patch(
          `/applications/${application.id}/select`
        )


        /*
         * Backend memilih satu siswa
         * dan menolak pelamar lainnya.
         *
         * Update frontend langsung
         * agar tidak perlu reload.
         */

        setApplicants(
          (current) =>
            current.map(
              (item) => ({
                ...item,

                status_lamaran:
                  item.id ===
                  application.id

                    ? 'dipilih'
                    : item.status_lamaran ===
                      'diajukan'

                      ? 'ditolak'
                      : item.status_lamaran,
              })
            )
        )


        setProject(
          (current) =>
            current
              ? {
                  ...current,
                  status:
                    'in_progress',
                }
              : current
        )


        const student =
          application.siswa ??
          application.student


        setSuccess(
          `${student?.name ?? 'Siswa'} berhasil dipilih. Proyek sekarang mulai berjalan.`
        )


        setSelectedApplicant(
          null
        )

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Siswa belum berhasil dipilih.'
        )

      } finally {
        setSelectingId(null)
      }
    }


  return (
    <UmkmAppShell>

      {/* HEADER */}

      <header
        className="
          flex
          items-start
          gap-3
        "
      >

        <button
          type="button"

          onClick={() =>
            navigate(
              '/umkm/projects'
            )
          }

          className="
            flex
            h-10
            w-10
            shrink-0

            items-center
            justify-center

            rounded-full

            bg-white

            shadow-sm
          "
        >
          <ArrowLeft size={19} />
        </button>


        <div>

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-widest
              text-green-600
            "
          >
            Kandidat Proyek
          </p>


          <h1
            className="
              mt-1
              text-[24px]
              font-semibold
            "
          >
            Daftar Pelamar
          </h1>


          <p
            className="
              mt-1
              text-[10px]
              text-gray-400
            "
          >
            Pilih siswa yang paling
            sesuai dengan kebutuhan
            proyek Anda.
          </p>

        </div>

      </header>


      {/* PROJECT SUMMARY */}

      {project && (
        <section
          className="
            mt-6

            rounded-[24px]

            bg-[#E7FAEC]

            p-4
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0

                items-center
                justify-center

                rounded-xl

                bg-white

                text-green-700
              "
            >
              <BriefcaseBusiness
                size={18}
              />
            </div>


            <div className="min-w-0">

              <p
                className="
                  line-clamp-2
                  text-xs
                  font-semibold
                "
              >
                {project.judul}
              </p>


              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  gap-2
                "
              >

                <span
                  className="
                    rounded-full

                    bg-white/80

                    px-2.5
                    py-1

                    text-[8px]
                  "
                >
                  {project.kategori_jurusan}
                </span>


                <span
                  className="
                    rounded-full

                    bg-white/80

                    px-2.5
                    py-1

                    text-[8px]
                  "
                >
                  {formatRupiah(
                    project.anggaran
                  )}
                </span>

              </div>

            </div>

          </div>

        </section>
      )}


      {/* STATS */}

      <section
        className="
          mt-5

          grid
          grid-cols-2
          gap-3
        "
      >

        <ApplicantStat
          label="Total Pelamar"
          value={
            applicants.length
          }
        />


        <ApplicantStat
          label="Menunggu"
          value={
            pendingCount
          }
        />

      </section>


      {/* CHOSEN NOTICE */}

      {chosenApplicant && (
        <div
          className="
            mt-5

            rounded-[20px]

            border
            border-green-200

            bg-green-50

            px-4
            py-4
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              text-green-700
            "
          >
            Siswa sudah dipilih
          </p>


          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-gray-500
            "
          >
            {
              chosenApplicant
                .siswa
                ?.name ??
              chosenApplicant
                .student
                ?.name ??
              'Siswa'
            }{' '}
            sekarang menjadi anggota
            proyek ini.
          </p>


          <button
            type="button"

            onClick={() =>
              navigate(
                `/umkm/projects/${projectId}/workspace`
              )
            }

            className="
              mt-3

              rounded-full

              bg-tumbuh-green

              px-4
              py-2

              text-[9px]
              font-semibold
              text-white
            "
          >
            Buka Workspace
          </button>
        </div>
      )}


      {/* SEARCH */}

      <div
        className="
          relative
          mt-6
        "
      >

        <Search
          size={16}

          className="
            absolute
            left-4
            top-1/2

            -translate-y-1/2

            text-gray-400
          "
        />


        <input
          type="search"

          value={search}

          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }

          placeholder="Cari nama, sekolah, atau jurusan..."

          className="
            h-12
            w-full

            rounded-full

            border
            border-gray-200

            bg-white

            pl-11
            pr-4

            text-[10px]

            outline-none

            focus:border-tumbuh-green
            focus:ring-4
            focus:ring-green-100
          "
        />

      </div>


      {/* SUCCESS */}

      {success && (
        <div
          className="
            mt-4

            rounded-2xl

            bg-green-50

            px-4
            py-3

            text-[10px]
            leading-4
            text-green-700
          "
        >
          {success}
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-4

            rounded-2xl

            bg-red-50

            px-4
            py-3

            text-[10px]
            leading-4
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* CONTENT */}

      {loading ? (

        <div
          className="
            flex
            min-h-[380px]
            items-center
            justify-center
          "
        >
          <p
            className="
              animate-pulse

              text-xs
              font-semibold
              text-green-700
            "
          >
            Memuat pelamar...
          </p>
        </div>

      ) : filteredApplicants.length >
      0 ? (

        <section
          className="
            mt-6

            grid
            grid-cols-1

            gap-4

            md:grid-cols-2
          "
        >

          {filteredApplicants.map(
            (applicant) => (

              <UmkmApplicantCard
                key={
                  applicant.id
                }

                applicant={
                  applicant
                }

                selecting={
                  selectingId ===
                  applicant.id
                }

                projectLocked={
                  projectLocked
                }

                onSelect={
                  setSelectedApplicant
                }
              />

            )
          )}

        </section>

      ) : (

        <EmptyApplicants
          searching={
            Boolean(
              search.trim()
            )
          }
        />

      )}


      {/* MODAL */}

      <SelectApplicantModal
        applicant={
          selectedApplicant
        }

        loading={
          Boolean(
            selectingId
          )
        }

        onClose={() => {
          if (!selectingId) {
            setSelectedApplicant(
              null
            )
          }
        }}

        onConfirm={
          handleSelect
        }
      />

    </UmkmAppShell>
  )
}


function ApplicantStat({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-[22px]

        bg-white

        px-4
        py-4
      "
    >
      <p
        className="
          text-[8px]
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </p>

      <strong
        className="
          mt-1
          block
          text-xl
        "
      >
        {value}
      </strong>
    </div>
  )
}


function EmptyApplicants({
  searching,
}) {
  return (
    <div
      className="
        mt-6

        rounded-[28px]

        border
        border-dashed
        border-gray-300

        bg-white/70

        px-6
        py-12

        text-center
      "
    >

      <Users
        size={30}

        className="
          mx-auto
          text-gray-300
        "
      />


      <h2
        className="
          mt-4
          text-sm
          font-semibold
        "
      >
        {searching
          ? 'Pelamar tidak ditemukan'
          : 'Belum ada pelamar'}
      </h2>


      <p
        className="
          mx-auto
          mt-2
          max-w-xs

          text-[10px]
          leading-5
          text-gray-400
        "
      >
        {searching
          ? 'Coba gunakan kata kunci lain.'
          : 'Ketika siswa mengajukan lamaran, profil mereka akan muncul di halaman ini.'}
      </p>

    </div>
  )
}