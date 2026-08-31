import {
  Bell,
  Sun,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import UmkmStatCard
  from '../../components/umkm/UmkmStatCard'

import UmkmActiveProjectCard
  from '../../components/umkm/UmkmActiveProjectCard'

import BusinessIdeaCard
  from '../../components/umkm/BusinessIdeaCard'


function unwrapProjects(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.projects
    )
  ) {
    return data.projects
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data
  }

  return []
}


function unwrapApplicants(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.applicants
    )
  ) {
    return data.applicants
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data
  }

  return []
}


export default function UmkmDashboard() {
  const {
    user,
  } = useAuth()

  const navigate =
    useNavigate()


  const [
    projects,
    setProjects,
  ] = useState([])

  const [
    applicants,
    setApplicants,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const loadDashboard =
      async () => {

        setLoading(true)
        setError('')

        try {
          /*
           * 1. Ambil semua project
           * milik UMKM.
           */
          const projectResponse =
            await api.get(
              '/my-projects'
            )


          const projectList =
            unwrapProjects(
              projectResponse.data
            )


          setProjects(
            projectList
          )


          /*
           * 2. Ambil pelamar dari
           * project yang memungkinkan
           * menerima aplikasi.
           */
          const applicantRequests =
            projectList
              .filter(
                (project) =>
                  [
                    'open',
                    'in_progress',
                  ].includes(
                    project.status
                  )
              )
              .map(
                (project) =>
                  api.get(
                    `/projects/${project.id}/applicants`
                  )
                    .then(
                      (response) =>
                        unwrapApplicants(
                          response.data
                        )
                    )
                    .catch(
                      () => []
                    )
              )


          const applicantGroups =
            await Promise.all(
              applicantRequests
            )


          setApplicants(
            applicantGroups.flat()
          )

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Dashboard belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }


    loadDashboard()
  }, [])


  /*
   * ACTIVE PROJECT
   *
   * Project open belum masuk karena
   * masih tahap mencari siswa.
   */
  const activeProjects =
    useMemo(() => {

      return projects.filter(
        (project) =>
          [
            'in_progress',
            'teacher_review',
            'umkm_review',
            'mediation',
          ].includes(
            project.status
          )
      )

    }, [projects])


  const completedProjects =
    useMemo(() => {

      return projects.filter(
        (project) =>
          project.status ===
          'completed'
      )

    }, [projects])


  /*
   * Pelamar baru =
   * status masih diajukan.
   */
  const newApplicants =
    useMemo(() => {

      return applicants.filter(
        (applicant) =>
          applicant
            .status_lamaran ===
          'diajukan'
      )

    }, [applicants])


  const profile =
    user?.umkm_profile ??
    user?.umkmProfile ??
    {}


  const ownerName =
    user?.name ??
    'Mitra UMKM'


  const businessName =
    profile.nama_toko ??
    'UMKM TUMBUH'


  const businessGreeting =
    profile.nama_toko
      ?.match(
        /^(Bu|Pak)\s+\S+/i
      )
      ?.[0]


  const ownerFirstName =
    ownerName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .at(0)


  const greetingName =
    businessGreeting ??
    ownerFirstName ??
    'Partner'





  return (
    <UmkmAppShell>

      {/* HEADER */}

      <header
        className="
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
            items-center
            gap-3
          "
        >

          {/* AVATAR */}

          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F9B9BC]
              text-base
              font-semibold
              text-white
            "
          >
            {ownerName
              .split(' ')
              .map(
                (word) =>
                  word.charAt(0)
              )
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>


          <div className="min-w-0">

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Sun
                size={15}
                className="
                  text-green-500
                "
              />


              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-green-500
                "
              >
                Good Morning
              </span>

            </div>


            <h1
              className="
                mt-1
                truncate
                text-[23px]
                font-semibold
                tracking-tight
              "
            >
              Halo, {greetingName}!
            </h1>

          </div>

        </div>


        {/* NOTIFICATION */}

        <button
          type="button"

          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#8CDEA4]
            text-gray-800
          "
        >
          <Bell size={18} />


          {newApplicants.length >
            0 && (

            <span
              className="
                absolute
                right-1
                top-1
                h-2
                w-2
                rounded-full
                bg-red-500
                ring-2
                ring-[#8CDEA4]
              "
            />

          )}

        </button>

      </header>


      {/* OPTIONAL BUSINESS */}

      <p
        className="
          mt-1
          pl-[68px]
          text-[8px]
          text-gray-400
        "
      >
        {businessName}
      </p>


      {/* STATS */}

      <section
        className="
          mt-5
          grid
          grid-cols-3
          gap-3
        "
      >

        <UmkmStatCard
          label="Proyek"
          value={
            activeProjects.length
          }
          subLabel="aktif"
          subColor="text-blue-500"
        />


        <UmkmStatCard
          label="Pelamar"
          value={
            newApplicants.length
          }
          subLabel="baru"
          subColor="text-green-600"
        />


        <UmkmStatCard
          label="Proyek"
          value={
            completedProjects.length
          }
          subLabel="selesai"
          subColor="text-gray-500"
        />

      </section>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-5
            rounded-2xl
            bg-red-50
            px-4
            py-3
            text-xs
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* ACTIVE PROJECTS */}

      <section className="mt-8">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-[19px]
              font-semibold
            "
          >
            Proyek Aktif Anda
          </h2>


          <button
            type="button"

            onClick={() =>
              navigate(
                '/umkm/projects'
              )
            }

            className="
              text-[11px]
              font-semibold
              text-green-700
            "
          >
            See all
          </button>

        </div>


        {loading ? (

          <div
            className="
              flex
              min-h-56
              items-center
              justify-center
            "
          >
            <p
              className="
                animate-pulse
                text-xs
                font-semibold
                text-tumbuh-green-dark
              "
            >
              Memuat proyek...
            </p>
          </div>

        ) : activeProjects.length >
        0 ? (

          <div
            className="
              mt-4
              space-y-4
            "
          >

            {activeProjects
              .slice(0, 2)
              .map(
                (
                  project,
                  index
                ) => (

                  <UmkmActiveProjectCard
                    key={
                      project.id
                    }

                    project={
                      project
                    }

                    index={
                      index
                    }
                  />

                )
              )}

          </div>

        ) : (

          <div
            className="
              mt-4
              rounded-[24px]
              border
              border-dashed
              border-gray-300
              bg-white/70
              px-5
              py-8
              text-center
            "
          >

            <img
              src="/assets/logo-tumbuh.png"
              alt=""

              className="
                mx-auto
                h-12
                w-12
                object-contain
                opacity-70
              "
            />


            <h3
              className="
                mt-3
                text-xs
                font-semibold
              "
            >
              Belum ada proyek aktif
            </h3>


            <p
              className="
                mt-1
                text-[9px]
                text-gray-400
              "
            >
              Buat proyek baru dan
              temukan siswa yang sesuai.
            </p>

          </div>

        )}

      </section>


      {/* BUILD BUSINESS */}

      <section
        className="
          mt-8
          rounded-t-[34px]
          bg-white
          px-4
          pb-5
          pt-8
          shadow-[0_-5px_30px_rgba(0,0,0,0.02)]
          md:rounded-[34px]
        "
      >

        <h2
          className="
            text-[18px]
            font-semibold
          "
        >
          Ayo Bangun Bisnis anda
        </h2>


        <div
          className="
            mt-5
            space-y-3
          "
        >

          <BusinessIdeaCard
            type="content"
            title="Konten Instagram"
            description="Tingkatkan penjualan bisnis Anda dengan konten kreatif."

            onClick={() =>
              navigate(
                '/umkm/project-builder'
              )
            }
          />


          <BusinessIdeaCard
            type="website"
            title="Website Bisnis"
            description="Buat katalog digital untuk membantu pelanggan mengenal produk Anda."

            onClick={() =>
              navigate(
                '/umkm/project-builder'
              )
            }
          />


          <BusinessIdeaCard
            type="design"
            title="Desain Promosi"
            description="Perkuat identitas bisnis dengan materi visual yang menarik."

            onClick={() =>
              navigate(
                '/umkm/project-builder'
              )
            }
          />

        </div>

      </section>

    </UmkmAppShell>
  )
}
