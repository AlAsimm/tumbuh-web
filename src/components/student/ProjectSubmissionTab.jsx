import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Link2,
  RotateCcw,
  Upload,
} from 'lucide-react'

import {
  useMemo,
  useRef,
  useState,
} from 'react'

import api from '../../lib/api'

import StudentSubmissionHistoryCard, {
  getLatestTeacherValidation,
} from './StudentSubmissionHistoryCard'


export default function ProjectSubmissionTab({
  projectId,
  projectStatus,
  submissions = [],
  onSubmitted,
}) {
  const [
    file,
    setFile,
  ] = useState(null)

  const [
    repositoryUrl,
    setRepositoryUrl,
  ] = useState('')

  const [
    catatan,
    setCatatan,
  ] = useState('')

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    downloadingId,
    setDownloadingId,
  ] = useState(null)

  const [
    success,
    setSuccess,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState('')

  const fileInputRef =
    useRef(null)


  const orderedSubmissions =
    useMemo(() => {
      return [...submissions].sort(
        (a, b) =>
          Number(b.versi ?? 0) -
          Number(a.versi ?? 0)
      )
    }, [submissions])


  const latestSubmission =
    orderedSubmissions[0] ??
    null


  const latestValidation =
    latestSubmission
      ? getLatestTeacherValidation(
          latestSubmission
        )
      : null


  /*
   * Backend hanya mengizinkan submission
   * saat status project = in_progress.
   *
   * Jika Guru meminta revision, backend
   * mengembalikan project ke in_progress,
   * sehingga siswa bisa mengirim versi baru.
   */
  const canSubmit =
    projectStatus ===
    'in_progress'


  const needsRevision =
    canSubmit &&
    latestValidation?.keputusan ===
      'revision'


  const nextVersion =
    orderedSubmissions.length > 0
      ? Math.max(
          ...orderedSubmissions.map(
            (submission) =>
              Number(
                submission.versi
              ) || 0
          )
        ) + 1
      : 1


  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0] ??
      null


    if (!selectedFile) {
      setFile(null)
      return
    }


    const tenMb =
      10 * 1024 * 1024


    if (
      selectedFile.size >
      tenMb
    ) {
      setError(
        'Ukuran file maksimal 10 MB.'
      )

      event.target.value = ''

      setFile(null)

      return
    }


    setError('')
    setFile(selectedFile)
  }


  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setError('')
      setSuccess('')


      if (!canSubmit) {
        setError(
          'Submission tidak dapat dikirim pada status proyek saat ini.'
        )

        return
      }


      if (
        !file &&
        !repositoryUrl.trim()
      ) {
        setError(
          'Tambahkan file atau repository URL sebelum mengirim hasil kerja.'
        )

        return
      }


      const formData =
        new FormData()


      if (file) {
        formData.append(
          'file',
          file
        )
      }


      if (
        repositoryUrl.trim()
      ) {
        formData.append(
          'repository_url',
          repositoryUrl.trim()
        )
      }


      if (catatan.trim()) {
        formData.append(
          'catatan',
          catatan.trim()
        )
      }


      setSubmitting(true)


      try {
        const response =
          await api.post(
            `/projects/${projectId}/submissions`,
            formData
          )


        setSuccess(
          response.data?.message ??
          (
            needsRevision
              ? `Revisi V${nextVersion} berhasil dikirim.`
              : 'Hasil kerja berhasil dikirim.'
          )
        )


        setFile(null)
        setRepositoryUrl('')
        setCatatan('')


        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            ''
        }


        if (onSubmitted) {
          await onSubmitted()
        }

      } catch (err) {
        console.error(err)


        const validationErrors =
          err.response?.data?.errors


        if (validationErrors) {
          const firstError =
            Object.values(
              validationErrors
            )
              .flat()
              .at(0)


          setError(
            firstError ??
            'Data submission tidak valid.'
          )

        } else {
          setError(
            err.response?.data?.message ??
            'Hasil kerja belum berhasil dikirim.'
          )
        }

      } finally {
        setSubmitting(false)
      }
    }


  const downloadSubmission =
    async (
      submission
    ) => {

      if (
        !submission?.file_url
      ) {
        return
      }


      setDownloadingId(
        submission.id
      )

      setError('')


      try {
        const response =
          await api.get(
            `/submissions/${submission.id}/download`,
            {
              responseType:
                'blob',
            }
          )


        const disposition =
          response.headers[
            'content-disposition'
          ]


        let filename =
          `submission-v${submission.versi ?? submission.id}`


        if (disposition) {
          const match =
            disposition.match(
              /filename="?([^"]+)"?/i
            )


          if (match?.[1]) {
            filename =
              match[1]
          }
        }


        const blob =
          response.data instanceof Blob
            ? response.data
            : new Blob([
                response.data
              ])


        const url =
          window.URL
            .createObjectURL(
              blob
            )


        const anchor =
          document.createElement(
            'a'
          )


        anchor.href = url
        anchor.download = filename


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
          err.response?.data?.message ??
          'File belum dapat diunduh.'
        )

      } finally {
        setDownloadingId(null)
      }
    }


  return (
    <section className="mt-6">

      {/* INTRO */}

      <div
        className="
          rounded-[22px]

          border
          border-green-200

          bg-green-50

          px-4
          py-4
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
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-xl

              bg-white

              text-tumbuh-green-dark
            "
          >
            <FileText size={18} />
          </div>


          <div>

            <h2
              className="
                text-xs
                font-semibold
                text-tumbuh-green-dark
              "
            >
              Hasil Kerja Proyek
            </h2>


            <p
              className="
                mt-1

                text-[10px]
                leading-4
                text-gray-500
              "
            >
              Kirim hasil pengerjaan melalui
              file, repository, atau keduanya.
              Guru pembimbing akan melakukan
              validasi sebelum hasil diteruskan
              ke UMKM.
            </p>

          </div>

        </div>
      </div>


      {/* REVISION ALERT */}

      {needsRevision && (
        <section
          className="
            mt-5

            rounded-[22px]

            border
            border-orange-200

            bg-orange-50

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
                h-9
                w-9
                shrink-0

                items-center
                justify-center

                rounded-full

                bg-orange-100

                text-orange-600
              "
            >
              <RotateCcw
                size={16}
              />
            </div>


            <div className="min-w-0">

              <p
                className="
                  text-[10px]
                  font-semibold
                  text-orange-700
                "
              >
                Hasil Perlu Direvisi
              </p>


              <p
                className="
                  mt-1

                  text-[9px]
                  leading-4
                  text-gray-500
                "
              >
                Guru pembimbing meminta
                beberapa perbaikan sebelum
                hasil dapat diteruskan ke UMKM.
              </p>


              {latestValidation
                ?.guru?.name && (

                <p
                  className="
                    mt-3
                    text-[8px]
                    font-semibold
                    text-gray-500
                  "
                >
                  {
                    latestValidation
                      .guru.name
                  }
                </p>

              )}


              {latestValidation
                ?.catatan && (

                <div
                  className="
                    mt-2

                    rounded-[14px]

                    bg-white/80

                    px-3
                    py-3
                  "
                >
                  <p
                    className="
                      whitespace-pre-wrap

                      text-[9px]
                      leading-4
                      text-gray-600
                    "
                  >
                    {
                      latestValidation
                        .catatan
                    }
                  </p>
                </div>

              )}

            </div>

          </div>

        </section>
      )}


      {/* SUBMISSION FORM */}

      {canSubmit ? (

        <form
          onSubmit={
            handleSubmit
          }

          className="
            mt-6

            rounded-[28px]

            bg-white

            p-5

            shadow-[0_10px_35px_rgba(0,0,0,0.03)]
          "
        >

          <div>

            <h2
              className="
                text-sm
                font-semibold
              "
            >
              {needsRevision
                ? `Kirim Revisi V${nextVersion}`
                : 'Kirim Hasil Kerja'}
            </h2>


            <p
              className="
                mt-1

                text-[10px]
                leading-4
                text-gray-400
              "
            >
              {needsRevision
                ? 'Upload hasil yang sudah diperbaiki sesuai catatan guru.'
                : 'Submission berikutnya akan otomatis menjadi versi baru.'}
            </p>

          </div>


          {/* FILE */}

          <div className="mt-5">

            <label
              htmlFor="submission-file"

              className="
                mb-2
                block

                text-[11px]
                font-medium
              "
            >
              File Hasil Kerja
            </label>


            <label
              htmlFor="submission-file"

              className="
                flex
                min-h-[120px]

                cursor-pointer

                flex-col
                items-center
                justify-center

                rounded-[22px]

                border-2
                border-dashed
                border-gray-200

                bg-gray-50

                px-5
                py-6

                text-center

                transition

                hover:border-tumbuh-green
                hover:bg-green-50
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-full

                  bg-white

                  text-tumbuh-green-dark
                "
              >
                <Upload size={20} />
              </div>


              {file ? (
                <>

                  <p
                    className="
                      mt-3
                      max-w-full
                      truncate

                      text-xs
                      font-semibold
                    "
                  >
                    {file.name}
                  </p>


                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-gray-400
                    "
                  >
                    Klik untuk mengganti file
                  </p>

                </>

              ) : (
                <>

                  <p
                    className="
                      mt-3
                      text-xs
                      font-medium
                    "
                  >
                    Pilih file hasil kerja
                  </p>


                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-gray-400
                    "
                  >
                    PDF, ZIP, PNG, JPG/JPEG
                    · maksimal 10 MB
                  </p>

                </>
              )}

            </label>


            <input
              ref={
                fileInputRef
              }

              id="submission-file"

              type="file"

              accept=".pdf,.zip,.png,.jpg,.jpeg"

              onChange={
                handleFileChange
              }

              className="hidden"
            />

          </div>


          {/* REPOSITORY */}

          <div className="mt-5">

            <label
              htmlFor="repository-url"

              className="
                mb-2
                block

                text-[11px]
                font-medium
              "
            >
              Repository URL
            </label>


            <div className="relative">

              <Link2
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
                id="repository-url"

                type="url"

                value={
                  repositoryUrl
                }

                onChange={(event) =>
                  setRepositoryUrl(
                    event.target.value
                  )
                }

                placeholder="https://github.com/..."

                className="
                  h-12
                  w-full

                  rounded-2xl

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
                  focus:ring-tumbuh-green/10
                "
              />

            </div>

          </div>


          {/* NOTE */}

          <div className="mt-5">

            <label
              htmlFor="submission-note"

              className="
                mb-2
                block

                text-[11px]
                font-medium
              "
            >
              Catatan

              <span
                className="
                  ml-1
                  font-normal
                  text-gray-400
                "
              >
                (opsional)
              </span>
            </label>


            <textarea
              id="submission-note"

              rows={4}

              maxLength={2000}

              value={
                catatan
              }

              onChange={(event) =>
                setCatatan(
                  event.target.value
                )
              }

              placeholder={
                needsRevision
                  ? 'Jelaskan perubahan yang sudah kamu lakukan dari versi sebelumnya...'
                  : 'Contoh: Website sudah responsif dan tombol WhatsApp sudah terhubung...'
              }

              className="
                w-full
                resize-none

                rounded-2xl

                border
                border-gray-200

                bg-white

                px-4
                py-3

                text-xs
                leading-5

                outline-none

                transition

                focus:border-tumbuh-green
                focus:ring-4
                focus:ring-tumbuh-green/10
              "
            />

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="
                mt-5

                flex
                items-start
                gap-2

                rounded-2xl

                bg-red-50

                px-4
                py-3

                text-[10px]
                leading-4
                text-red-600
              "
            >
              <AlertCircle
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {error}
              </span>
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div
              className="
                mt-5

                flex
                items-start
                gap-2

                rounded-2xl

                bg-green-50

                px-4
                py-3

                text-[10px]
                leading-4
                text-green-700
              "
            >
              <CheckCircle2
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {success}
              </span>
            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"

            disabled={
              submitting
            }

            className="
              mt-6

              flex
              h-14
              w-full

              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-tumbuh-green

              font-semibold
              text-white

              shadow-[0_8px_24px_rgba(108,216,135,0.28)]

              transition

              hover:bg-tumbuh-green-dark
              active:scale-[0.99]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Upload size={17} />

            {submitting
              ? 'Mengirim...'
              : needsRevision
                ? `Kirim Revisi V${nextVersion}`
                : 'Kirim Hasil Kerja'}
          </button>

        </form>

      ) : (

        <SubmissionLockedNotice
          projectStatus={
            projectStatus
          }

          latestValidation={
            latestValidation
          }
        />

      )}


      {/* GLOBAL ERROR WHILE LOCKED / DOWNLOAD */}

      {!canSubmit &&
        error && (

        <div
          className="
            mt-4
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


      {/* HISTORY */}

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
              text-base
              font-semibold
            "
          >
            Riwayat Submission
          </h2>


          <span
            className="
              rounded-full

              bg-gray-100

              px-2.5
              py-1

              text-[9px]
              text-gray-500
            "
          >
            {
              orderedSubmissions
                .length
            }{' '}
            versi
          </span>

        </div>


        {orderedSubmissions.length >
        0 ? (

          <div
            className="
              mt-4
              space-y-4
            "
          >

            {orderedSubmissions.map(
              (submission) => (

                <StudentSubmissionHistoryCard
                  key={
                    submission.id
                  }

                  submission={
                    submission
                  }

                  downloading={
                    downloadingId ===
                    submission.id
                  }

                  onDownload={
                    downloadSubmission
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

              bg-white/60

              px-6
              py-10

              text-center
            "
          >

            <FileText
              size={25}

              className="
                mx-auto
                text-gray-300
              "
            />


            <h3
              className="
                mt-3
                text-xs
                font-semibold
              "
            >
              Belum ada submission
            </h3>


            <p
              className="
                mx-auto
                mt-1
                max-w-xs

                text-[10px]
                leading-4
                text-gray-400
              "
            >
              Hasil kerja yang kamu kirim
              akan tersimpan sebagai riwayat
              versi di sini.
            </p>

          </div>

        )}

      </section>

    </section>
  )
}


function SubmissionLockedNotice({
  projectStatus,
  latestValidation,
}) {
  const content = {

    teacher_review: {
      title:
        'Menunggu Validasi Guru',

      description:
        'Hasil kerja sudah dikirim. Guru pembimbing sedang memeriksa submission terbaru.',

      tone:
        'purple',

      icon:
        <CheckCircle2
          size={21}
        />,
    },


    umkm_review: {
      title:
        'Hasil Lolos Validasi Guru',

      description:
        'Submission telah disetujui Guru dan sekarang sedang menunggu review akhir dari UMKM.',

      tone:
        'green',

      icon:
        <CheckCircle2
          size={21}
        />,
    },


    mediation: {
      title:
        'Proyek Dalam Mediasi',

      description:
        'Hasil kerja sedang melalui proses mediasi. Riwayat submission tetap dapat dilihat.',

      tone:
        'orange',

      icon:
        <AlertCircle
          size={21}
        />,
    },


    completed: {
      title:
        'Proyek Telah Selesai',

      description:
        'Submission akhir sudah diterima dan proyek telah masuk ke portofolio terverifikasi.',

      tone:
        'green',

      icon:
        <CheckCircle2
          size={21}
        />,
    },

  }


  const current =
    content[projectStatus] ?? {
      title:
        'Submission Tidak Tersedia',

      description:
        'Hasil kerja tidak dapat dikirim pada status proyek saat ini.',

      tone:
        'gray',

      icon:
        <AlertCircle
          size={21}
        />,
    }


  const tone = {
    purple: {
      wrapper:
        'border-purple-200 bg-purple-50',

      icon:
        'bg-purple-100 text-purple-600',

      title:
        'text-purple-700',
    },

    green: {
      wrapper:
        'border-green-200 bg-green-50',

      icon:
        'bg-green-100 text-green-700',

      title:
        'text-green-700',
    },

    orange: {
      wrapper:
        'border-orange-200 bg-orange-50',

      icon:
        'bg-orange-100 text-orange-600',

      title:
        'text-orange-700',
    },

    gray: {
      wrapper:
        'border-gray-200 bg-white',

      icon:
        'bg-gray-100 text-gray-500',

      title:
        'text-gray-700',
    },
  }[current.tone]


  return (
    <div
      className={`
        mt-6

        rounded-[24px]

        border

        px-5
        py-5

        ${tone.wrapper}
      `}
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
            h-10
            w-10
            shrink-0

            items-center
            justify-center

            rounded-xl

            ${tone.icon}
          `}
        >
          {current.icon}
        </div>


        <div className="min-w-0">

          <h3
            className={`
              text-xs
              font-semibold

              ${tone.title}
            `}
          >
            {current.title}
          </h3>


          <p
            className="
              mt-1

              text-[10px]
              leading-4
              text-gray-500
            "
          >
            {current.description}
          </p>


          {projectStatus ===
            'umkm_review' &&
            latestValidation
              ?.guru?.name && (

            <p
              className="
                mt-3
                text-[8px]
                font-semibold
                text-green-700
              "
            >
              Disetujui oleh{' '}
              {
                latestValidation
                  .guru.name
              }
            </p>

          )}

        </div>

      </div>

    </div>
  )
}
