import {
  Search,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import api from '../../lib/api'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import ExploreProjectCard
  from '../../components/student/ExploreProjectCard'


function unwrapProjects(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.projects)) {
    return data.projects
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}


const filters = [
  {
    label: 'Explore',
    value: 'all',
  },
  {
    label: 'Web Dev',
    value: 'PPLG',
  },
  {
    label: 'Design',
    value: 'DKV',
  },
  {
    label: 'Aplikasi',
    value: 'application',
  },
  {
    label: 'Editing',
    value: 'editing',
  },
]


export default function ExplorePage() {
  const [projects, setProjects] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [activeFilter, setActiveFilter] =
    useState('all')

  const [favorites, setFavorites] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await api.get('/projects')

        const list =
          unwrapProjects(response.data)

        setProjects(
          list.filter(
            (project) =>
              project.status === 'open'
          )
        )

      } catch (err) {
        console.error(err)

        setError(
          'Project belum dapat dimuat.'
        )

      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])


  const toggleFavorite = (projectId) => {
    setFavorites((current) => {
      if (current.includes(projectId)) {
        return current.filter(
          (id) => id !== projectId
        )
      }

      return [
        ...current,
        projectId,
      ]
    })
  }


  const filteredProjects =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return projects.filter(
        (project) => {

          const matchesSearch =
            !keyword ||
            project.judul
              ?.toLowerCase()
              .includes(keyword) ||
            project.deskripsi_brief
              ?.toLowerCase()
              .includes(keyword) ||
            project.kategori_jurusan
              ?.toLowerCase()
              .includes(keyword) ||
            project.umkm
              ?.nama_toko
              ?.toLowerCase()
              .includes(keyword)


          if (!matchesSearch) {
            return false
          }


          if (activeFilter === 'all') {
            return true
          }


          if (activeFilter === 'PPLG') {
            return (
              project.kategori_jurusan
                ?.toLowerCase()
                .includes('pplg') ||
              project.judul
                ?.toLowerCase()
                .includes('website') ||
              project.judul
                ?.toLowerCase()
                .includes('web')
            )
          }


          if (activeFilter === 'DKV') {
            return (
              project.kategori_jurusan
                ?.toLowerCase()
                .includes('dkv') ||
              project.judul
                ?.toLowerCase()
                .includes('design') ||
              project.judul
                ?.toLowerCase()
                .includes('desain')
            )
          }


          if (
            activeFilter ===
            'application'
          ) {
            return (
              project.judul
                ?.toLowerCase()
                .includes('aplikasi') ||
              project.deskripsi_brief
                ?.toLowerCase()
                .includes('aplikasi')
            )
          }


          if (activeFilter === 'editing') {
            return (
              project.judul
                ?.toLowerCase()
                .includes('edit') ||
              project.deskripsi_brief
                ?.toLowerCase()
                .includes('editing')
            )
          }


          return true
        }
      )
    }, [
      projects,
      search,
      activeFilter,
    ])


  const recommended =
    filteredProjects.slice(0, 2)


  const latest =
    filteredProjects.slice(2)


  return (
    <StudentAppShell>

      {/* TITLE */}
      <header>
        <h1
          className="
            text-[30px]
            font-semibold
            tracking-tight
          "
        >
          Explore
        </h1>
      </header>


      {/* SEARCH */}
      <section className="mt-6">

        <div className="relative">

          <input
            type="search"

            value={search}

            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }

            placeholder="Cari project, skill, atau UMKM"

            className="
              h-12
              w-full

              rounded-full
              border
              border-gray-400

              bg-white

              pl-5
              pr-14

              text-xs

              outline-none

              transition

              focus:border-tumbuh-green
              focus:ring-4
              focus:ring-tumbuh-green/10
            "
          />


          <div
            className="
              absolute
              right-2
              top-1/2

              flex
              h-9
              w-9

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              bg-tumbuh-green-dark

              text-white
            "
          >
            <Search size={17} />
          </div>

        </div>


        {/* FILTER */}
        <div
          className="
            mt-3
            flex
            gap-2
            overflow-x-auto
            pb-1

            [&::-webkit-scrollbar]:hidden
          "
        >
          {filters.map((filter) => {
            const active =
              activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"

                onClick={() =>
                  setActiveFilter(
                    filter.value
                  )
                }

                className={`
                  shrink-0
                  rounded-full
                  border

                  px-3
                  py-1.5

                  text-xs
                  font-medium

                  transition

                  ${
                    active
                      ? `
                        border-tumbuh-green
                        bg-tumbuh-green
                        text-white
                      `
                      : `
                        border-gray-500
                        bg-white
                        text-gray-700
                      `
                  }
                `}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

      </section>


      {/* ERROR */}
      {error && (
        <div
          className="
            mt-6
            rounded-2xl
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* LOADING */}
      {loading ? (
        <div
          className="
            flex
            min-h-[50vh]
            items-center
            justify-center
          "
        >
          <p
            className="
              animate-pulse
              font-semibold
              text-tumbuh-green-dark
            "
          >
            Mencari project...
          </p>
        </div>
      ) : (

        <div
          className="
            md:grid
            md:grid-cols-2
            md:gap-8
          "
        >

          {/* RECOMMENDED */}
          <section className="mt-8">

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Rekomendasi Proyek
              </h2>

              <button
                type="button"
                onClick={() =>
                  setActiveFilter('all')
                }
                className="
                  text-xs
                  font-semibold
                  text-tumbuh-green-dark
                "
              >
                See all
              </button>

            </div>


            <div className="space-y-4">

              {recommended.length > 0 ? (
                recommended.map(
                  (project, index) => (
                    <ExploreProjectCard
                      key={project.id}
                      project={project}

                      variant={
                        index % 2 === 0
                          ? 'green'
                          : 'blue'
                      }

                      favorite={
                        favorites.includes(
                          project.id
                        )
                      }

                      onToggleFavorite={
                        toggleFavorite
                      }
                    />
                  )
                )
              ) : (
                <EmptyState />
              )}

            </div>

          </section>


          {/* LATEST */}
          <section className="mt-10 md:mt-8">

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Rekomendasi Terbaru
              </h2>

              <button
                type="button"
                onClick={() =>
                  setActiveFilter('all')
                }
                className="
                  text-xs
                  font-semibold
                  text-tumbuh-green-dark
                "
              >
                See all
              </button>

            </div>


            <div className="space-y-4">

              {latest.length > 0 ? (
                latest.map(
                  (project, index) => (
                    <ExploreProjectCard
                      key={project.id}
                      project={project}

                      variant={
                        index % 3 === 0
                          ? 'blue'
                          : index % 3 === 1
                            ? 'yellow'
                            : 'green'
                      }

                      favorite={
                        favorites.includes(
                          project.id
                        )
                      }

                      onToggleFavorite={
                        toggleFavorite
                      }
                    />
                  )
                )
              ) : (
                filteredProjects.length >
                  0 && (
                  <p
                    className="
                      py-8
                      text-center
                      text-sm
                      text-gray-400
                    "
                  >
                    Semua project sudah
                    tampil di rekomendasi.
                  </p>
                )
              )}

            </div>

          </section>

        </div>

      )}

    </StudentAppShell>
  )
}


function EmptyState() {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-dashed
        border-gray-300

        bg-white/70

        px-6
        py-10

        text-center
      "
    >
      <p
        className="
          text-sm
          font-medium
        "
      >
        Project tidak ditemukan.
      </p>

      <p
        className="
          mt-1
          text-xs
          text-gray-400
        "
      >
        Coba gunakan kata kunci
        atau kategori lain.
      </p>
    </div>
  )
}