import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
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

import TeacherAppShell
  from '../../components/teacher/TeacherAppShell'


function unwrapSubmission(data) {
  return (
    data?.submission ??
    data?.data?.submission ??
    data?.data ??
    data
  )
}


function unwrapMessages(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    Array.isArray(
      data?.messages
    )
  ) {
    return data.messages
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


export default function TeacherSubmissionReviewPage() {
  const navigate =
    useNavigate()

  const {
    submissionId,
  } = useParams()


  const [
    submission,
    setSubmission,
  ] = useState(null)

  const [
    messages,
    setMessages,
  ] = useState([])

  const [
    note,
    setNote,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    downloading,
    setDownloading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const load =
      async () => {
        setLoading(true)
        setError('')

        try {
          const response =
            await api.get(
              `/teacher/submissions/${submissionId}`
            )

          const current =
            unwrapSubmission(
              response.data
            )

          setSubmission(current)


          const member =
            current?.project_member ??
            current?.projectMember ??
            {}

          const project =
            member.project ??
            current?.project

          if (project?.id) {
            const chatResponse =
              await api.get(
                `/teacher/projects/${project.id}/messages`
              )

            setMessages(
              unwrapMessages(
                chatResponse.data
              )
            )
          }

        } catch (err) {
          console.error(err)

          setError(
            err.response
              ?.data
              ?.message ??
            'Submission belum dapat dimuat.'
          )

        } finally {
          setLoading(false)
        }
      }

    load()
  }, [submissionId])


  const context =
    useMemo(() => {
      const member =
        submission?.project_member ??
        submission?.projectMember ??
        {}

      const project =
        member.project ??
        submission?.project ??
        {}

      const student =
        member.siswa ??
        member.student ??
        submission?.siswa ??
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
    }, [submission])


  const validate =
    async (
      decision
    ) => {
      if (
        decision === 'revision' &&
        !note.trim()
      ) {
        setError(
          'Catatan revisi wajib diisi.'
        )
        return
      }

      setSubmitting(true)
      setError('')

      try {
        await api.post(
          `/teacher/submissions/${submissionId}/validate`,
          {
            keputusan:
              decision,

            catatan:
              note.trim() ||
              null,
          }
        )

        navigate(
          '/teacher',
          {
            replace: true,
          }
        )

      } catch (err) {
        console.error(err)

        const validationErrors =
          err.response
            ?.data
            ?.errors

        if (validationErrors) {
          setError(
            Object.values(
              validationErrors
            )
              .flat()
              .at(0) ??
            'Data validasi tidak valid.'
          )
        } else {
          setError(
            err.response
              ?.data
              ?.message ??
            'Validasi belum berhasil dikirim.'
          )
        }

      } finally {
        setSubmitting(false)
      }
    }


  const downloadFile =
    async () => {
      setDownloading(true)
      setError('')

      try {
        const response =
          await api.get(
            `/teacher/submissions/${submissionId}/download`,
            {
              responseType:
                'blob',
            }
          )

        const url =
          window.URL
            .createObjectURL(
              new Blob([
                response.data
              ])
            )

        const anchor =
          document.createElement(
            'a'
          )

        anchor.href = url

        anchor.download =
          submission?.file_url
            ?.split('/')
            ?.pop() ??
          `submission-${submissionId}`

        document.body
          .appendChild(anchor)

        anchor.click()
        anchor.remove()

        window.URL
          .revokeObjectURL(url)

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'File belum berhasil diunduh.'
        )

      } finally {
        setDownloading(false)
      }
    }


  if (loading) {
    return (
      <TeacherAppShell>
        <div
          className="
            flex
            min-h-[70vh]
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
            Memuat submission...
          </p>
        </div>
      </TeacherAppShell>
    )
  }


  if (
    error &&
    !submission
  ) {
    return (
      <TeacherAppShell>
        <button
          type="button"
          onClick={() =>
            navigate('/teacher')
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
          "
        >
          <ArrowLeft size={18} />
        </button>

        <div
          className="
            mt-5
            rounded-3xl
            bg-red-50
            p-5
            text-[10px]
            text-red-600
          "
        >
          {error}
        </div>
      </TeacherAppShell>
    )
  }


  const {
    project,
    student,
    profile,
  } = context


  return (
    <TeacherAppShell>

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
            navigate('/teacher')
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
          "
        >
          <ArrowLeft size={18} />
        </button>


        <div>
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-widest
              text-purple-500
            "
          >
            Teacher Validation
          </p>

          <h1
            className="
              mt-1
              text-2xl
              font-semibold
            "
          >
            Periksa Submission
          </h1>

          <p
            className="
              mt-1
              text-[9px]
              text-gray-400
            "
          >
            Validasi kualitas hasil sebelum
            diteruskan ke UMKM.
          </p>
        </div>
      </header>


      <div
        className="
          mt-7
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-[1.25fr_0.75fr]
        "
      >

        <div className="space-y-5">

          <section
            className="
              rounded-[26px]
              bg-white
              p-5
            "
          >
            <p
              className="
                text-[8px]
                uppercase
                tracking-widest
                text-gray-400
              "
            >
              Proyek
            </p>

            <h2
              className="
                mt-1
                text-base
                font-semibold
              "
            >
              {project.judul ??
                'Proyek TUMBUH'}
            </h2>

            <p
              className="
                mt-3
                whitespace-pre-wrap
                text-[10px]
                leading-5
                text-gray-500
              "
            >
              {project.deskripsi_brief}
            </p>
          </section>


          <section
            className="
              rounded-[26px]
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    uppercase
                    tracking-widest
                    text-gray-400
                  "
                >
                  Submission
                </p>

                <h2
                  className="
                    mt-1
                    text-sm
                    font-semibold
                  "
                >
                  Versi {submission?.versi ?? '-'}
                </h2>
              </div>

              <ShieldCheck
                size={22}
                className="
                  text-purple-500
                "
              />
            </div>


            {submission?.catatan && (
              <div
                className="
                  mt-4
                  rounded-[18px]
                  bg-gray-50
                  p-4
                "
              >
                <p
                  className="
                    text-[8px]
                    text-gray-400
                  "
                >
                  Catatan siswa
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-gray-600
                  "
                >
                  {submission.catatan}
                </p>
              </div>
            )}


            <div
              className="
                mt-4
                grid
                gap-2
                sm:grid-cols-2
              "
            >
              {submission?.file_url && (
                <button
                  type="button"
                  onClick={downloadFile}
                  disabled={downloading}
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-gray-200
                    text-[9px]
                    font-semibold
                    disabled:opacity-50
                  "
                >
                  <Download size={14} />

                  {downloading
                    ? 'Mengunduh...'
                    : 'Download File'}
                </button>
              )}


              {submission?.repository_url && (
                <a
                  href={
                    submission.repository_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-gray-200
                    text-[9px]
                    font-semibold
                  "
                >
                  <ExternalLink size={14} />
                  Repository
                </a>
              )}
            </div>
          </section>


          <section
            className="
              rounded-[26px]
              bg-white
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <MessageCircle
                size={17}
                className="
                  text-green-700
                "
              />

              <h2
                className="
                  text-sm
                  font-semibold
                "
              >
                Percakapan Proyek
              </h2>
            </div>


            <p
              className="
                mt-1
                text-[8px]
                text-gray-400
              "
            >
              Guru hanya dapat membaca
              percakapan siswa dan UMKM.
            </p>


            <div
              className="
                mt-4
                max-h-[320px]
                space-y-2
                overflow-y-auto
                rounded-[20px]
                bg-gray-50
                p-4
              "
            >
              {messages.length > 0 ? (
                messages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className="
                        rounded-2xl
                        bg-white
                        p-3
                      "
                    >
                      <p
                        className="
                          text-[8px]
                          font-semibold
                          text-green-700
                        "
                      >
                        {message.sender?.name ??
                          'Pengguna'}
                      </p>

                      <p
                        className="
                          mt-1
                          whitespace-pre-wrap
                          text-[9px]
                          leading-4
                          text-gray-600
                        "
                      >
                        {message.isi_pesan}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p
                  className="
                    py-8
                    text-center
                    text-[9px]
                    text-gray-400
                  "
                >
                  Belum ada percakapan.
                </p>
              )}
            </div>
          </section>

        </div>


        <aside className="space-y-5">

          <section
            className="
              rounded-[26px]
              bg-[#E8F4FF]
              p-5
            "
          >
            <p
              className="
                text-[8px]
                uppercase
                tracking-widest
                text-blue-500
              "
            >
              Siswa
            </p>

            <h2
              className="
                mt-1
                text-sm
                font-semibold
              "
            >
              {student.name ??
                'Siswa TUMBUH'}
            </h2>

            <p
              className="
                mt-2
                text-[9px]
                leading-4
                text-gray-500
              "
            >
              {[
                profile.nama_sekolah,
                profile.jurusan,
                profile.tingkat_kelas
                  ? `Kelas ${profile.tingkat_kelas}`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ') ||
                'Data sekolah belum tersedia'}
            </p>
          </section>


          <section
            className="
              rounded-[26px]
              bg-white
              p-5
            "
          >
            <h2
              className="
                text-sm
                font-semibold
              "
            >
              Keputusan Guru
            </h2>

            <p
              className="
                mt-1
                text-[8px]
                leading-4
                text-gray-400
              "
            >
              Approve meneruskan hasil
              ke UMKM. Revision mengembalikan
              proyek ke siswa.
            </p>


            <textarea
              rows={6}
              maxLength={2000}
              value={note}
              disabled={submitting}
              onChange={(event) =>
                setNote(
                  event.target.value
                )
              }
              placeholder="Catatan validasi / revisi..."
              className="
                mt-4
                w-full
                resize-none
                rounded-[18px]
                border
                border-gray-200
                px-4
                py-3
                text-[10px]
                leading-5
                outline-none
                focus:border-tumbuh-green
                focus:ring-4
                focus:ring-green-100
                disabled:bg-gray-50
              "
            />


            {error && (
              <div
                className="
                  mt-3
                  rounded-2xl
                  bg-red-50
                  px-4
                  py-3
                  text-[9px]
                  text-red-600
                "
              >
                {error}
              </div>
            )}


            <div
              className="
                mt-4
                grid
                gap-2
              "
            >
              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  validate(
                    'revision'
                  )
                }
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-orange-200
                  bg-orange-50
                  text-[9px]
                  font-semibold
                  text-orange-600
                  disabled:opacity-50
                "
              >
                <RotateCcw size={14} />
                Minta Revisi
              </button>


              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  validate(
                    'approved'
                  )
                }
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-tumbuh-green
                  text-[9px]
                  font-semibold
                  text-white
                  disabled:opacity-50
                "
              >
                <CheckCircle2 size={15} />

                {submitting
                  ? 'Memproses...'
                  : 'Approve Submission'}
              </button>
            </div>
          </section>

        </aside>

      </div>

    </TeacherAppShell>
  )
}
