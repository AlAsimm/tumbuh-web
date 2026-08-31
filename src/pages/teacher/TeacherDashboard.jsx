import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Folder,
  MessageSquare,
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
} from 'react-router-dom'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'

import {
  formatDate,
  projectProgress,
} from '../../lib/formatters'

import TeacherAppShell
  from '../../components/teacher/TeacherAppShell'


function unwrapSubmissions(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.submissions
    )
  ) {
    return data.submissions
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


function getContext(submission) {
  const member =
    submission.project_member ??
    submission.projectMember ??
    {}

  const project =
    member.project ??
    submission.project ??
    {}

  const student =
    member.siswa ??
    member.student ??
    submission.siswa ??
    {}

  const profile =
    student.smk_profile ??
    student.smkProfile ??
    {}

  return {
    member,
    project,
    student,
    profile,
  }
}


export default function TeacherDashboard() {
  const {
    user,
  } = useAuth()

  const navigate =
    useNavigate()


  const [
    submissions,
    setSubmissions,
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


  useEffect(() => {
    const loadDashboard =
      async () => {

        setLoading(true)
        setError('')

        try {
          const response =
            await api.get(
              '/teacher/submissions'
            )

          setSubmissions(
            unwrapSubmissions(
              response.data
            )
          )

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Dashboard pembimbing belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }


    loadDashboard()
  }, [])


  const filtered =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return submissions
      }


      return submissions.filter(
        (submission) => {

          const {
            project,
            student,
            profile,
          } =
            getContext(
              submission
            )

          return [
            project.judul,
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
      submissions,
      search,
    ])


  const uniqueProjects =
    useMemo(() => {

      return new Set(
        submissions
          .map(
            (submission) =>
              getContext(
                submission
              ).project.id
          )
          .filter(Boolean)
      ).size

    }, [submissions])


  const uniqueStudents =
    useMemo(() => {

      return new Set(
        submissions
          .map(
            (submission) =>
              getContext(
                submission
              ).student.id
          )
          .filter(Boolean)
      ).size

    }, [submissions])


  const recentActivities =
    useMemo(() => {

      return [...submissions]
        .sort(
          (a, b) =>
            new Date(
              b.submitted_at ??
              b.created_at ??
              0
            ) -
            new Date(
              a.submitted_at ??
              a.created_at ??
              0
            )
        )
        .slice(0, 4)

    }, [submissions])


  return (
    <TeacherAppShell>

      <div
        className="
          grid
          min-h-screen
          grid-cols-1

          xl:grid-cols-[minmax(0,1fr)_390px]
        "
      >

        {/* CENTER */}

        <section
          className="
            min-w-0
            px-5
            pb-10
            pt-8

            sm:px-8
            lg:px-12
            lg:pt-12
          "
        >

          {/* TOP */}

          <div
            className="
              flex
              flex-col
              gap-6

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[15px]
                  text-[#247A3D]
                "
              >
                Halo{' '}
                <strong>
                  {user?.name ??
                    'Guru'}
                </strong>
                , Selamat datang!
              </p>


              <h1
                className="
                  mt-7
                  text-[31px]
                  font-semibold
                  lowercase
                  tracking-[-0.03em]
                "
              >
                dashboard pembimbing
              </h1>

            </div>


            <div
              className="
                relative
                w-full
                sm:max-w-[250px]
              "
            >
              <Search
                size={19}
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  text-[#7890A0]
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
                placeholder="Search..."
                className="
                  h-10
                  w-full
                  border-0
                  bg-transparent
                  pl-9
                  pr-2
                  text-[11px]
                  outline-none
                  placeholder:text-gray-300
                "
              />
            </div>

          </div>


          {/* STATS */}

          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >

            <TeacherStatCard
              icon={Folder}
              iconClass="bg-[#58DB88] text-[#146632]"
              label="Proyek perlu validasi"
              value={uniqueProjects}
              suffix="proyek"
              decoration="green"
            />


            <TeacherStatCard
              icon={Users}
              iconClass="bg-[#C9F7FA] text-blue-600"
              label="Mentee di antrian"
              value={uniqueStudents}
              suffix="siswa"
              decoration="blue"
            />


            <TeacherStatCard
              icon={Clock3}
              iconClass="bg-[#FBECEF] text-red-700"
              label="Submission menunggu"
              value={
                submissions.length
              }
              suffix="submission"
              decoration="red"
            />

          </div>


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


          {/* ACTIVE / REVIEW QUEUE */}

          <div
            className="
              mt-16
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <h2
                className="
                  text-[21px]
                  font-semibold
                "
              >
                Proyek aktif
              </h2>

              <span
                className="
                  text-[10px]
                  font-medium
                  text-blue-500
                "
              >
                View All
              </span>
            </div>


            <div
              className="
                hidden
                items-center
                gap-2
                text-[12px]
                text-blue-500
                sm:flex
              "
            >
              <CalendarDays
                size={18}
                className="
                  text-[#7B95A7]
                "
              />

              {new Intl.DateTimeFormat(
                'id-ID',
                {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }
              ).format(
                new Date()
              )}
            </div>
          </div>


          {loading ? (
            <div
              className="
                flex
                min-h-[360px]
                items-center
                justify-center
              "
            >
              <p
                className="
                  animate-pulse
                  text-[11px]
                  font-semibold
                  text-green-700
                "
              >
                Memuat proyek...
              </p>
            </div>

          ) : filtered.length > 0 ? (

            <div
              className="
                mt-8
                space-y-5
              "
            >
              {filtered.map(
                (
                  submission,
                  index
                ) => (

                  <TeacherProjectRow
                    key={
                      submission.id
                    }
                    submission={
                      submission
                    }
                    index={index}
                    onOpen={() =>
                      navigate(
                        `/teacher/submissions/${submission.id}`
                      )
                    }
                  />

                )
              )}
            </div>

          ) : (

            <div
              className="
                mt-8
                rounded-[24px]
                border
                border-dashed
                border-gray-300
                bg-white
                px-6
                py-14
                text-center
              "
            >
              <CheckCircle2
                size={30}
                className="
                  mx-auto
                  text-green-300
                "
              />

              <h3
                className="
                  mt-4
                  text-sm
                  font-semibold
                "
              >
                Tidak ada proyek yang
                menunggu validasi
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-[9px]
                  leading-4
                  text-gray-400
                "
              >
                Submission siswa akan
                muncul di sini setelah
                hasil kerja dikirim.
              </p>
            </div>

          )}

        </section>


        {/* RIGHT RAIL */}

        <aside
          className="
            border-t
            border-[#EAEFEC]
            bg-white
            px-6
            py-8

            xl:border-l
            xl:border-t-0
            xl:px-8
          "
        >

          {/* TEACHER PILL */}

          <div
            className="
              ml-auto
              flex
              max-w-[245px]
              items-center
              gap-3
              rounded-[16px]
              bg-[#EDF9F0]
              px-3
              py-2
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#F1C9B9]
                text-[11px]
                font-semibold
                text-white
              "
            >
              {(user?.name ??
                'G')
                .split(' ')
                .filter(Boolean)
                .map(
                  (word) =>
                    word.charAt(0)
                )
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>


            <div className="min-w-0 flex-1">

              <p
                className="
                  truncate
                  text-[11px]
                  font-medium
                "
              >
                {user?.name ??
                  'Guru TUMBUH'}
              </p>

              <p
                className="
                  text-[9px]
                  text-green-700
                "
              >
                guru pembimbing
              </p>

            </div>


            <ChevronDown
              size={16}
            />

          </div>


          {/* ACTIVITY */}

          <section
            className="
              mt-14
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div className="relative">
                <Bell
                  size={20}
                  className="
                    text-gray-500
                  "
                />

                {submissions.length >
                  0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                      ring-2
                      ring-white
                    "
                  />
                )}
              </div>

              <h2
                className="
                  text-[18px]
                  font-semibold
                "
              >
                aktivitas terbaru
              </h2>
            </div>


            <div
              className="
                mt-8
                space-y-7
              "
            >

              {recentActivities.length >
              0 ? (

                recentActivities.map(
                  (
                    submission,
                    index
                  ) => {

                    const {
                      project,
                      student,
                    } =
                      getContext(
                        submission
                      )

                    return (
                      <button
                        key={
                          submission.id
                        }
                        type="button"
                        onClick={() =>
                          navigate(
                            `/teacher/submissions/${submission.id}`
                          )
                        }
                        className="
                          flex
                          w-full
                          items-start
                          gap-3
                          text-left
                        "
                      >

                        <Avatar
                          name={
                            student.name
                          }
                          index={
                            index
                          }
                          size="sm"
                        />


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              truncate
                              text-[10px]
                              font-semibold
                            "
                          >
                            {student.name ??
                              'Siswa'}{' '}
                            menunggu approval
                            mu!
                          </p>


                          <p
                            className="
                              mt-1
                              line-clamp-2
                              text-[9px]
                              leading-4
                              text-gray-400
                            "
                          >
                            baru saja
                            mengirim hasil
                            proyek{' '}
                            {project.judul ??
                              'TUMBUH'}
                          </p>

                        </div>


                        <span
                          className="
                            shrink-0
                            text-[8px]
                            text-gray-400
                          "
                        >
                          {submission
                            .versi
                            ? `V${submission.versi}`
                            : ''}
                        </span>

                      </button>
                    )
                  }
                )

              ) : (

                <p
                  className="
                    text-[9px]
                    leading-4
                    text-gray-400
                  "
                >
                  Belum ada aktivitas
                  submission terbaru.
                </p>

              )}

            </div>

          </section>


          {/* SCHEDULE */}

          <section
            className="
              mt-20
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <CalendarDays
                size={20}
                className="
                  text-gray-500
                "
              />

              <h2
                className="
                  text-[18px]
                  font-semibold
                "
              >
                jadwal bimbingan
              </h2>
            </div>


            <div
              className="
                mt-8
                rounded-[18px]
                border
                border-dashed
                border-gray-300
                bg-[#FCFEFD]
                px-5
                py-7
                text-center
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                "
              >
                Jadwal belum tersedia
              </p>

              <p
                className="
                  mt-2
                  text-[8px]
                  leading-4
                  text-gray-400
                "
              >
                Modul jadwal bimbingan
                belum terhubung ke backend
                pada MVP saat ini.
              </p>
            </div>

          </section>

        </aside>

      </div>

    </TeacherAppShell>
  )
}


function TeacherStatCard({
  icon: Icon,
  iconClass,
  label,
  value,
  suffix,
  decoration,
}) {
  const decorationClass = {
    green:
      'from-green-100 via-green-200 to-transparent',

    blue:
      'from-cyan-100 via-cyan-200 to-transparent',

    red:
      'from-red-50 via-red-100 to-transparent',
  }[decoration]


  return (
    <article
      className="
        relative
        min-h-[255px]
        overflow-hidden
        rounded-[14px]
        border
        border-[#E4E8E6]
        bg-white
        p-5
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
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-xl

            ${iconClass}
          `}
        >
          <Icon size={18} />
        </div>


        <p
          className="
            pt-2
            text-[11px]
            font-medium
            leading-4
          "
        >
          {label}
        </p>

      </div>


      <div
        className="
          relative
          z-10
          mt-5
          text-center
        "
      >
        <strong
          className="
            block
            text-[45px]
            font-normal
            leading-none
          "
        >
          {value}
        </strong>

        <span
          className="
            mt-2
            block
            text-[11px]
            text-gray-500
          "
        >
          {suffix}
        </span>
      </div>


      <div
        className={`
          absolute
          bottom-0
          left-4
          right-4
          h-20
          rounded-t-[50%]
          bg-gradient-to-t

          ${decorationClass}
        `}
      />

    </article>
  )
}


function TeacherProjectRow({
  submission,
  index,
  onOpen,
}) {
  const {
    project,
    student,
    profile,
  } =
    getContext(
      submission
    )


  const colors = [
    {
      card: 'bg-[#66D889]',
      bar: 'bg-[#277A43]',
    },
    {
      card: 'bg-[#9DC6FA]',
      bar: 'bg-[#1474D4]',
    },
    {
      card: 'bg-[#FFD13F]',
      bar: 'bg-[#E6A500]',
    },
  ]


  const palette =
    colors[
      index %
      colors.length
    ]


  const progress =
    projectProgress(
      project.status
    )


  return (
    <article
      className={`
        rounded-[17px]
        px-4
        py-4

        ${palette.card}
      `}
    >

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        <Avatar
          name={
            student.name
          }
          index={index}
        />


        <div
          className="
            min-w-0
            flex-1
          "
        >

          <div
            className="
              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >

            <div className="min-w-0">

              <h3
                className="
                  truncate
                  text-[17px]
                  font-medium
                  lowercase
                "
              >
                {project.judul ??
                  'proyek tumbuh'}
              </h3>


              <p
                className="
                  mt-0.5
                  truncate
                  text-[8px]
                  text-black/60
                "
              >
                dibuat oleh{' '}
                {student.name ??
                  'siswa'}{' '}
                -{' '}
                {profile.nama_sekolah ??
                  'sekolah'}
                {' | '}
                Deadline:{' '}
                {project.deadline
                  ? formatDate(
                      project.deadline
                    )
                  : '-'}
              </p>

            </div>


            <div
              className="
                flex
                shrink-0
                gap-2
              "
            >

              {profile.jurusan && (
                <span
                  className="
                    rounded-full
                    bg-[#CBF6F6]
                    px-3
                    py-1.5
                    text-[8px]
                    text-blue-600
                  "
                >
                  {profile.jurusan}
                </span>
              )}


              <span
                className="
                  rounded-full
                  bg-white/70
                  px-3
                  py-1.5
                  text-[8px]
                  text-blue-600
                "
              >
                proses
              </span>

            </div>

          </div>


          <div
            className="
              mt-4
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                min-w-0
                flex-1
              "
            >

              <div
                className="
                  flex
                  items-baseline
                  gap-2
                "
              >
                <strong
                  className="
                    text-[18px]
                    font-semibold
                    text-white
                  "
                >
                  {progress}%
                </strong>

                <span
                  className="
                    text-[8px]
                    text-white/90
                  "
                >
                  status :
                  menunggu approval
                </span>
              </div>


              <div
                className="
                  mt-1
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-white/90
                "
              >
                <div
                  className={`
                    h-full
                    rounded-full

                    ${palette.bar}
                  `}
                  style={{
                    width:
                      `${progress}%`,
                  }}
                />
              </div>

            </div>


            <button
              type="button"
              onClick={onOpen}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <MessageSquare
                size={14}
              />
            </button>


            <button
              type="button"
              onClick={onOpen}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-blue-500
              "
            >
              ↘
            </button>

          </div>

        </div>

      </div>

    </article>
  )
}


function Avatar({
  name,
  index = 0,
  size = 'md',
}) {
  const backgrounds = [
    'bg-blue-600',
    'bg-[#86634A]',
    'bg-red-700',
    'bg-purple-600',
  ]

  const classSize =
    size === 'sm'
      ? 'h-9 w-9 text-[8px]'
      : 'h-10 w-10 text-[9px]'


  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        font-semibold
        text-white

        ${classSize}

        ${
          backgrounds[
            index %
            backgrounds.length
          ]
        }
      `}
    >
      {(name ??
        'ST')
        .split(' ')
        .filter(Boolean)
        .map(
          (word) =>
            word.charAt(0)
        )
        .slice(0, 2)
        .join('')
        .toUpperCase()}
    </div>
  )
}
