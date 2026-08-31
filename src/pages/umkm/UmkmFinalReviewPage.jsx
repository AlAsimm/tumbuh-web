import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldCheck,
  UserRound,
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

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import ProjectRatingInput
  from '../../components/umkm/ProjectRatingInput'

import FinalReviewConfirmModal
  from '../../components/umkm/FinalReviewConfirmModal'


function unwrapReview(data) {
  return {
    project:
      data?.project ??
      data?.data?.project ??
      null,

    submission:
      data?.submission ??
      data?.latest_submission ??
      data?.latestSubmission ??
      data?.data?.submission ??
      null,

    teacherValidation:
      data?.teacher_validation ??
      data?.teacherValidation ??
      data?.validation ??
      data?.data?.teacher_validation ??
      null,

    student:
      data?.student ??
      data?.siswa ??
      data?.data?.student ??
      null,

    review:
      data?.review ??
      data?.data?.review ??
      null,
  }
}


export default function UmkmFinalReviewPage() {
  const navigate =
    useNavigate()

  const {
    projectId,
  } = useParams()


  const [
    data,
    setData,
  ] = useState(null)

  const [
    rating,
    setRating,
  ] = useState(0)

  const [
    comment,
    setComment,
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
    decision,
    setDecision,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')


  const loadReview =
    async () => {

      setLoading(true)
      setError('')


      try {
        const response =
          await api.get(
            `/umkm/projects/${projectId}/review`
          )


        const result =
          unwrapReview(
            response.data
          )


        setData(result)


        if (
          result.review?.rating
        ) {
          setRating(
            Number(
              result.review.rating
            )
          )
        }


        if (
          result.review?.komentar
        ) {
          setComment(
            result.review.komentar
          )
        }

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Final review belum dapat dimuat.'
        )

      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    loadReview()
  }, [projectId])


  const project =
    data?.project


  const submission =
    data?.submission


  const validation =
    data?.teacherValidation


  const student =
    useMemo(() => {

      if (data?.student) {
        return data.student
      }


      return (
        submission
          ?.project_member
          ?.siswa ??
        submission
          ?.projectMember
          ?.siswa ??
        {}
      )

    }, [
      data,
      submission,
    ])


  const profile =
    student?.smk_profile ??
    student?.smkProfile ??
    {}


  const handleDownload =
    async () => {

      if (
        !submission?.file_url
      ) {
        return
      }


      setDownloading(true)
      setError('')


      try {
        const response =
          await api.get(
            `/umkm/projects/${projectId}/review/download`,
            {
              responseType:
                'blob',
            }
          )


        const blob =
          new Blob(
            [response.data]
          )


        const url =
          window.URL
            .createObjectURL(
              blob
            )


        const anchor =
          document
            .createElement('a')


        anchor.href = url


        anchor.download =
          submission
            .file_url
            ?.split('/')
            ?.pop() ??
          `submission-project-${projectId}`


        document.body
          .appendChild(
            anchor
          )


        anchor.click()


        anchor.remove()


        window.URL
          .revokeObjectURL(
            url
          )

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


  const openDecision = (
    nextDecision
  ) => {
    setError('')


    if (
      nextDecision ===
        'accepted' &&
      rating === 0
    ) {
      setError(
        'Berikan rating terlebih dahulu sebelum menerima hasil proyek.'
      )

      return
    }


    if (
      nextDecision ===
        'mediation' &&
      !comment.trim()
    ) {
      setError(
        'Tuliskan alasan mediasi terlebih dahulu.'
      )

      return
    }


    setDecision(
      nextDecision
    )
  }


  const submitReview =
    async () => {

      if (!decision) {
        return
      }


      setSubmitting(true)
      setError('')
      setSuccess('')


      try {
        const payload = {
          keputusan:
            decision,

          rating:
            rating > 0
              ? rating
              : null,

          komentar:
            comment.trim() ||
            null,
        }


        const response =
          await api.post(
            `/umkm/projects/${projectId}/review`,
            payload
          )


        if (
          decision ===
          'accepted'
        ) {
          setSuccess(
            'Hasil proyek berhasil diterima. Proyek selesai dan portfolio terverifikasi siswa telah dibuat.'
          )

        } else {
          setSuccess(
            'Proyek berhasil diajukan ke tahap mediasi.'
          )
        }


        setDecision(null)


        setTimeout(() => {

          navigate(
            '/umkm/projects'
          )

        }, 1200)


        return response

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
            'Data review tidak valid.'
          )

        } else {
          setError(
            err.response
              ?.data
              ?.message ??
            'Review belum berhasil dikirim.'
          )
        }

      } finally {
        setSubmitting(false)
      }
    }


  if (loading) {
    return (
      <UmkmAppShell>

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

              text-sm
              font-semibold
              text-green-700
            "
          >
            Memuat hasil proyek...
          </p>
        </div>

      </UmkmAppShell>
    )
  }


  if (
    error &&
    !project
  ) {
    return (
      <UmkmAppShell>

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
            items-center
            justify-center

            rounded-full

            bg-white
          "
        >
          <ArrowLeft
            size={18}
          />
        </button>


        <div
          className="
            mt-6

            rounded-3xl

            bg-red-50

            p-5

            text-xs
            text-red-600
          "
        >
          {error}
        </div>

      </UmkmAppShell>
    )
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
              `/umkm/projects/${projectId}/workspace?tab=result`
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
          <ArrowLeft
            size={19}
          />
        </button>


        <div>

          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-widest
              text-orange-500
            "
          >
            Final Review
          </p>


          <h1
            className="
              mt-1

              text-[23px]
              font-semibold
            "
          >
            Review Hasil Akhir
          </h1>


          <p
            className="
              mt-1

              text-[9px]
              leading-4
              text-gray-400
            "
          >
            Periksa hasil kerja siswa
            sebelum menyelesaikan proyek.
          </p>

        </div>

      </header>


      {/* PROJECT */}

      <section
        className="
          mt-6

          rounded-[26px]

          bg-[#FFF0D9]

          p-5
        "
      >

        <p
          className="
            text-[8px]
            font-medium
            uppercase
            tracking-wide
            text-orange-600
          "
        >
          Proyek
        </p>


        <h2
          className="
            mt-1

            text-sm
            font-semibold
          "
        >
          {project?.judul}
        </h2>


        <p
          className="
            mt-2

            line-clamp-3

            text-[9px]
            leading-4
            text-gray-500
          "
        >
          {project?.deskripsi_brief}
        </p>

      </section>


      {/* STUDENT */}

      <section
        className="
          mt-4

          rounded-[24px]

          bg-white

          p-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              shrink-0

              items-center
              justify-center

              rounded-full

              bg-blue-100

              text-blue-600
            "
          >
            <UserRound
              size={19}
            />
          </div>


          <div className="min-w-0">

            <p
              className="
                text-[8px]
                text-gray-400
              "
            >
              Dikerjakan oleh
            </p>


            <p
              className="
                mt-0.5
                truncate

                text-xs
                font-semibold
              "
            >
              {student?.name ??
                'Siswa TUMBUH'}
            </p>


            <div
              className="
                mt-1

                flex
                items-center
                gap-1

                text-[8px]
                text-gray-400
              "
            >
              <GraduationCap
                size={11}
              />

              {[
                profile.nama_sekolah,
                profile.jurusan,
              ]
                .filter(Boolean)
                .join(' · ') ||
                'Data sekolah tidak tersedia'}
            </div>

          </div>

        </div>

      </section>


      {/* TEACHER VALIDATION */}

      <section
        className="
          mt-4

          rounded-[24px]

          border
          border-green-200

          bg-green-50

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

          <ShieldCheck
            size={20}
            className="
              shrink-0
              text-green-700
            "
          />


          <div>

            <p
              className="
                text-[10px]
                font-semibold
                text-green-800
              "
            >
              Telah Divalidasi Guru
            </p>


            <p
              className="
                mt-1

                text-[9px]
                leading-4
                text-gray-500
              "
            >
              Submission telah melewati
              pemeriksaan guru pembimbing
              sebelum masuk ke tahap
              review UMKM.
            </p>


            {validation?.guru?.name && (
              <p
                className="
                  mt-3

                  text-[8px]
                  font-medium
                  text-green-700
                "
              >
                Validator:{' '}
                {
                  validation.guru.name
                }
              </p>
            )}


            {validation?.catatan && (
              <div
                className="
                  mt-3

                  rounded-[16px]

                  bg-white/70

                  p-3
                "
              >
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Catatan Guru
                </p>


                <p
                  className="
                    mt-1

                    text-[9px]
                    leading-4
                    text-gray-600
                  "
                >
                  {
                    validation.catatan
                  }
                </p>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* SUBMISSION */}

      <section
        className="
          mt-4

          rounded-[24px]

          bg-white

          p-5
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                text-[8px]
                uppercase
                tracking-wide
                text-gray-400
              "
            >
              Submission Final
            </p>


            <h2
              className="
                mt-1
                text-sm
                font-semibold
              "
            >
              Versi {
                submission?.versi ??
                '-'
              }
            </h2>

          </div>


          <span
            className="
              rounded-full

              bg-green-100

              px-3
              py-1.5

              text-[8px]
              font-semibold
              text-green-700
            "
          >
            Siap Direview
          </span>

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
              Catatan Siswa
            </p>


            <p
              className="
                mt-1

                text-[9px]
                leading-4
                text-gray-600
              "
            >
              {
                submission.catatan
              }
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

              disabled={
                downloading
              }

              onClick={
                handleDownload
              }

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
              <Download
                size={14}
              />

              {downloading
                ? 'Mengunduh...'
                : 'Download File'}
            </button>
          )}


          {submission?.repository_url && (
            <a
              href={
                submission
                  .repository_url
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
              <ExternalLink
                size={14}
              />

              Buka Repository
            </a>
          )}

        </div>


        {!submission?.file_url &&
        !submission?.repository_url && (

          <div
            className="
              mt-4

              rounded-2xl

              bg-gray-50

              px-4
              py-4

              text-center
            "
          >
            <FileText
              size={20}

              className="
                mx-auto
                text-gray-300
              "
            />

            <p
              className="
                mt-2

                text-[9px]
                text-gray-400
              "
            >
              Tidak ada file atau
              repository yang tersedia.
            </p>

          </div>

        )}

      </section>


      {/* REVIEW FORM */}

      <section
        className="
          mt-4

          rounded-[24px]

          bg-white

          p-5
        "
      >

        <ProjectRatingInput
          value={rating}

          onChange={
            setRating
          }

          disabled={
            submitting
          }
        />


        <div className="mt-6">

          <label
            htmlFor="umkm-review-comment"

            className="
              text-[10px]
              font-semibold
            "
          >
            Komentar
          </label>


          <p
            className="
              mt-1

              text-[8px]
              text-gray-400
            "
          >
            Berikan feedback untuk siswa
            atau jelaskan alasan jika
            membutuhkan mediasi.
          </p>


          <textarea
            id="umkm-review-comment"

            rows={5}

            maxLength={2000}

            value={comment}

            disabled={
              submitting
            }

            onChange={(event) =>
              setComment(
                event.target.value
              )
            }

            placeholder="Contoh: Website sudah sesuai kebutuhan kami dan mudah digunakan..."

            className="
              mt-3
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


          <p
            className="
              mt-1
              text-right
              text-[7px]
              text-gray-300
            "
          >
            {comment.length}/2000
          </p>

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-4

            rounded-2xl

            bg-red-50

            px-4
            py-3

            text-[9px]
            leading-4
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div
          className="
            mt-4

            rounded-2xl

            bg-green-50

            px-4
            py-3

            text-[9px]
            leading-4
            text-green-700
          "
        >
          {success}
        </div>
      )}


      {/* DECISION */}

      <section
        className="
          mt-5

          grid
          grid-cols-2
          gap-3
        "
      >

        <button
          type="button"

          disabled={
            submitting
          }

          onClick={() =>
            openDecision(
              'mediation'
            )
          }

          className="
            flex
            min-h-13

            items-center
            justify-center
            gap-2

            rounded-2xl

            border
            border-orange-200

            bg-orange-50

            px-3

            text-[9px]
            font-semibold
            text-orange-600

            disabled:opacity-50
          "
        >
          <AlertTriangle
            size={14}
          />

          Ajukan Mediasi
        </button>


        <button
          type="button"

          disabled={
            submitting
          }

          onClick={() =>
            openDecision(
              'accepted'
            )
          }

          className="
            flex
            min-h-13

            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-tumbuh-green

            px-3

            text-[9px]
            font-semibold
            text-white

            disabled:opacity-50
          "
        >
          <CheckCircle2
            size={14}
          />

          Terima Hasil
        </button>

      </section>


      <p
        className="
          mt-3

          text-center

          text-[7px]
          leading-3
          text-gray-400
        "
      >
        Keputusan final akan mengubah
        status proyek dan tidak dapat
        dilakukan sembarangan.
      </p>


      <FinalReviewConfirmModal
        decision={
          decision
        }

        loading={
          submitting
        }

        onClose={() => {
          if (!submitting) {
            setDecision(null)
          }
        }}

        onConfirm={
          submitReview
        }
      />

    </UmkmAppShell>
  )
}