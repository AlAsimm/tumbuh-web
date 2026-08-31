import {
  Plus,
  Search,
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
  umkmProjectStage,
} from '../../lib/formatters'

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import UmkmProjectCard
  from '../../components/umkm/UmkmProjectCard'


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


const tabs = [
  {
    label: 'Semua',
    value: 'all',
  },

  {
    label: 'Draft',
    value: 'draft',
  },

  {
    label: 'Open',
    value: 'open',
  },

  {
    label: 'Berjalan',
    value: 'active',
  },

  {
    label: 'Review',
    value: 'review',
  },

  {
    label: 'Selesai',
    value: 'completed',
  },
]


export default function UmkmProjectsPage() {
  const navigate =
    useNavigate()


  const [
    projects,
    setProjects,
  ] = useState([])

  const [
    activeTab,
    setActiveTab,
  ] = useState('all')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    publishingId,
    setPublishingId,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')


  const loadProjects =
    async () => {

      setLoading(true)
      setError('')

      try {
        const response =
          await api.get(
            '/my-projects'
          )

        setProjects(
          unwrapProjects(
            response.data
          )
        )

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Daftar proyek belum dapat dimuat.'
        )

      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    loadProjects()
  }, [])


  const filteredProjects =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase()


      return projects.filter(
        (project) => {

          /*
           * TAB
           */

          if (
            activeTab !== 'all' &&
            umkmProjectStage(
              project.status
            ) !== activeTab
          ) {
            return false
          }


          /*
           * SEARCH
           */

          if (!keyword) {
            return true
          }


          return (
            project.judul
              ?.toLowerCase()
              .includes(keyword) ||

            project
              .deskripsi_brief
              ?.toLowerCase()
              .includes(keyword) ||

            project
              .kategori_jurusan
              ?.toLowerCase()
              .includes(keyword)
          )
        }
      )

    }, [
      projects,
      activeTab,
      search,
    ])


  const counts =
    useMemo(() => ({
      all:
        projects.length,

      draft:
        projects.filter(
          (project) =>
            umkmProjectStage(
              project.status
            ) === 'draft'
        ).length,

      open:
        projects.filter(
          (project) =>
            umkmProjectStage(
              project.status
            ) === 'open'
        ).length,

      active:
        projects.filter(
          (project) =>
            umkmProjectStage(
              project.status
            ) === 'active'
        ).length,

      review:
        projects.filter(
          (project) =>
            umkmProjectStage(
              project.status
            ) === 'review'
        ).length,

      completed:
        projects.filter(
          (project) =>
            umkmProjectStage(
              project.status
            ) === 'completed'
        ).length,
    }), [projects])


  const handlePublish =
    async (project) => {

      if (
        project.status !==
        'draft'
      ) {
        return
      }


      setPublishingId(
        project.id
      )

      setError('')
      setSuccess('')


      try {
        await api.patch(
          `/projects/${project.id}/publish`
        )


        /*
         * Update local state
         * tanpa reload seluruh halaman.
         */

        setProjects(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                project.id

                  ? {
                      ...item,
                      status:
                        'open',
                    }

                  : item
            )
        )


        setSuccess(
          `"${project.judul}" berhasil dipublikasikan.`
        )

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Proyek belum berhasil dipublikasikan.'
        )

      } finally {
        setPublishingId(null)
      }
    }


  return (
    <UmkmAppShell>

      {/* HEADER */}

      <header
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

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
            Kelola Proyek
          </p>


          <h1
            className="
              mt-1

              text-[27px]
              font-semibold
              tracking-tight
            "
          >
            Proyek Saya
          </h1>


          <p
            className="
              mt-1

              text-[10px]
              text-gray-400
            "
          >
            Pantau proyek dan temukan
            siswa terbaik untuk bisnis Anda.
          </p>

        </div>


        <button
          type="button"

          onClick={() =>
            navigate(
              '/umkm/project-builder'
            )
          }

          className="
            flex
            h-11
            w-11
            shrink-0

            items-center
            justify-center

            rounded-full

            bg-tumbuh-green

            text-white

            shadow-[0_7px_20px_rgba(108,216,135,0.3)]
          "
        >
          <Plus size={19} />
        </button>

      </header>


      {/* SEARCH */}

      <section className="mt-6">

        <div className="relative">

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

            placeholder="Cari proyek..."

            className="
              h-12
              w-full

              rounded-full

              border
              border-gray-200

              bg-white

              pl-11
              pr-4

              text-xs

              outline-none

              transition

              focus:border-tumbuh-green
              focus:ring-4
              focus:ring-green-100
            "
          />

        </div>

      </section>


      {/* TABS */}

      <section
        className="
          mt-4

          flex
          gap-2

          overflow-x-auto

          pb-1

          [&::-webkit-scrollbar]:hidden
        "
      >

        {tabs.map((tab) => {

          const active =
            activeTab ===
            tab.value


          return (
            <button
              key={tab.value}

              type="button"

              onClick={() =>
                setActiveTab(
                  tab.value
                )
              }

              className={`
                flex
                shrink-0

                items-center
                gap-1.5

                rounded-full

                px-3
                py-2

                text-[9px]
                font-medium

                transition

                ${
                  active
                    ? `
                      bg-gray-900
                      text-white
                    `
                    : `
                      border
                      border-gray-200

                      bg-white

                      text-gray-500
                    `
                }
              `}
            >
              {tab.label}


              <span
                className={`
                  rounded-full

                  px-1.5
                  py-0.5

                  text-[7px]

                  ${
                    active
                      ? 'bg-white/20'
                      : 'bg-gray-100'
                  }
                `}
              >
                {
                  counts[
                    tab.value
                  ]
                }
              </span>

            </button>
          )
        })}

      </section>


      {/* SUCCESS */}

      {success && (
        <div
          className="
            mt-5

            rounded-2xl

            bg-green-50

            px-4
            py-3

            text-[10px]
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
            mt-5

            rounded-2xl

            bg-red-50

            px-4
            py-3

            text-[10px]
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* PROJECTS */}

      {loading ? (

        <div
          className="
            flex
            min-h-[55vh]
            items-center
            justify-center
          "
        >
          <p
            className="
              animate-pulse

              text-sm
              font-semibold
              text-tumbuh-green-dark
            "
          >
            Memuat proyek...
          </p>
        </div>

      ) : (

        <section
          className="
            mt-6

            grid
            grid-cols-1

            gap-4

            md:grid-cols-2
          "
        >

          {filteredProjects.length >
          0 ? (

            filteredProjects.map(
              (
                project,
                index
              ) => (

                <UmkmProjectCard
                  key={project.id}

                  project={project}

                  index={index}

                  publishing={
                    publishingId ===
                    project.id
                  }

                  onPublish={
                    handlePublish
                  }
                />

              )
            )

          ) : (

            <EmptyProjects
              activeTab={
                activeTab
              }

              searching={
                Boolean(
                  search.trim()
                )
              }

              onCreate={() =>
                navigate(
                  '/umkm/project-builder'
                )
              }
            />

          )}

        </section>

      )}

    </UmkmAppShell>
  )
}


function EmptyProjects({
  activeTab,
  searching,
  onCreate,
}) {
  if (searching) {
    return (
      <EmptyState
        title="Proyek tidak ditemukan"

        description="Coba gunakan kata kunci lain."

        onCreate={onCreate}
      />
    )
  }


  const copy = {
    all: [
      'Belum ada proyek',
      'Mulai dari Imagine untuk membuat proyek pertama Anda.',
    ],

    draft: [
      'Tidak ada draft',
      'Proyek yang belum diterbitkan akan muncul di sini.',
    ],

    open: [
      'Tidak ada proyek open',
      'Proyek yang sedang mencari siswa akan muncul di sini.',
    ],

    active: [
      'Tidak ada proyek berjalan',
      'Proyek yang sedang dikerjakan siswa akan muncul di sini.',
    ],

    review: [
      'Tidak ada proyek dalam review',
      'Validasi Guru dan review akhir akan muncul di sini.',
    ],

    completed: [
      'Belum ada proyek selesai',
      'Proyek yang sudah diterima akan tersimpan di sini.',
    ],
  }


  const [
    title,
    description,
  ] =
    copy[activeTab] ??
    copy.all


  return (
    <EmptyState
      title={title}

      description={
        description
      }

      onCreate={
        onCreate
      }
    />
  )
}


function EmptyState({
  title,
  description,
  onCreate,
}) {
  return (
    <div
      className="
        col-span-full

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

      <img
        src="/assets/logo-tumbuh.png"

        alt=""

        className="
          mx-auto

          h-14
          w-14

          object-contain

          opacity-70
        "
      />


      <h2
        className="
          mt-5
          text-sm
          font-semibold
        "
      >
        {title}
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
        {description}
      </p>


      <button
        type="button"

        onClick={
          onCreate
        }

        className="
          mt-5

          rounded-full

          bg-tumbuh-green

          px-5
          py-2.5

          text-[9px]
          font-semibold
          text-white
        "
      >
        + Buat Proyek
      </button>

    </div>
  )
}