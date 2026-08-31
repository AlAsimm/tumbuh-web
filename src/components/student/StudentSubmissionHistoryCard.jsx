import {
  CheckCircle2,
  Download,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'

import {
  formatDate,
} from '../../lib/formatters'


function getValidations(
  submission
) {
  if (
    Array.isArray(
      submission.teacher_validations
    )
  ) {
    return submission.teacher_validations
  }

  if (
    Array.isArray(
      submission.teacherValidations
    )
  ) {
    return submission.teacherValidations
  }

  return []
}


export function getLatestTeacherValidation(
  submission
) {
  const validations =
    getValidations(
      submission
    )


  return (
    [...validations]
      .sort(
        (a, b) =>
          new Date(
            b.validated_at ??
            b.updated_at ??
            b.created_at ??
            0
          ) -
          new Date(
            a.validated_at ??
            a.updated_at ??
            a.created_at ??
            0
          )
      )
      .at(0) ??
    null
  )
}


export default function StudentSubmissionHistoryCard({
  submission,
  onDownload,
  downloading = false,
}) {
  const validation =
    getLatestTeacherValidation(
      submission
    )


  const decision =
    validation?.keputusan


  const approved =
    decision === 'approved'

  const revision =
    decision === 'revision'


  const teacher =
    validation?.guru ??
    validation?.teacher ??
    {}


  return (
    <article
      className={`
        rounded-[22px]

        border

        p-4

        ${
          approved
            ? `
              border-green-200
              bg-green-50
            `
            : revision
              ? `
                border-orange-200
                bg-orange-50
              `
              : `
                border-gray-100
                bg-white
              `
        }
      `}
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
              tracking-widest
              text-gray-400
            "
          >
            Submission
          </p>


          <h3
            className="
              mt-1
              text-sm
              font-semibold
            "
          >
            Versi {
              submission.versi ??
              '-'
            }
          </h3>

        </div>


        <SubmissionStatus
          validation={
            validation
          }
        />

      </div>


      {(submission.submitted_at ||
        submission.created_at) && (

        <p
          className="
            mt-2
            text-[8px]
            text-gray-400
          "
        >
          Dikirim{' '}
          {formatDate(
            submission.submitted_at ??
            submission.created_at
          )}
        </p>

      )}


      {submission.catatan && (
        <div
          className="
            mt-4

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
            Catatan kamu
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
            {submission.catatan}
          </p>

        </div>
      )}


      {validation && (
        <div
          className={`
            mt-4

            rounded-[16px]

            p-3

            ${
              approved
                ? 'bg-green-100/70'
                : revision
                  ? 'bg-orange-100/70'
                  : 'bg-gray-100'
            }
          `}
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {approved ? (
              <CheckCircle2
                size={14}
                className="
                  text-green-700
                "
              />
            ) : (
              <RotateCcw
                size={14}
                className="
                  text-orange-600
                "
              />
            )}


            <p
              className="
                text-[9px]
                font-semibold
              "
            >
              {approved
                ? 'Disetujui Guru'
                : revision
                  ? 'Perlu Revisi'
                  : 'Validasi Guru'}
            </p>

          </div>


          {teacher.name && (
            <p
              className="
                mt-2

                text-[8px]
                font-medium
                text-gray-500
              "
            >
              {teacher.name}
            </p>
          )}


          {validation.catatan && (
            <p
              className="
                mt-2

                whitespace-pre-wrap

                text-[9px]
                leading-4
                text-gray-600
              "
            >
              {validation.catatan}
            </p>
          )}


          {validation.validated_at && (
            <p
              className="
                mt-2
                text-[7px]
                text-gray-400
              "
            >
              {formatDate(
                validation.validated_at
              )}
            </p>
          )}

        </div>
      )}


      <div
        className="
          mt-4

          flex
          flex-wrap
          gap-2
        "
      >

        {submission.file_url && (
          <button
            type="button"

            disabled={
              downloading
            }

            onClick={() =>
              onDownload(
                submission
              )
            }

            className="
              flex
              h-9

              items-center
              justify-center
              gap-2

              rounded-full

              border
              border-gray-200

              bg-white

              px-3

              text-[8px]
              font-semibold

              disabled:opacity-50
            "
          >
            <Download size={12} />

            {downloading
              ? 'Mengunduh...'
              : 'Download'}
          </button>
        )}


        {submission.repository_url && (
          <a
            href={
              submission.repository_url
            }

            target="_blank"

            rel="noreferrer"

            className="
              flex
              h-9

              items-center
              justify-center
              gap-2

              rounded-full

              border
              border-gray-200

              bg-white

              px-3

              text-[8px]
              font-semibold
            "
          >
            <ExternalLink
              size={12}
            />

            Repository
          </a>
        )}

      </div>

    </article>
  )
}


function SubmissionStatus({
  validation,
}) {
  if (!validation) {
    return (
      <span
        className="
          rounded-full

          bg-purple-100

          px-3
          py-1.5

          text-[8px]
          font-semibold
          text-purple-600
        "
      >
        Menunggu Guru
      </span>
    )
  }


  if (
    validation.keputusan ===
    'revision'
  ) {
    return (
      <span
        className="
          rounded-full

          bg-orange-100

          px-3
          py-1.5

          text-[8px]
          font-semibold
          text-orange-600
        "
      >
        Revisi
      </span>
    )
  }


  if (
    validation.keputusan ===
    'approved'
  ) {
    return (
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
        Approved
      </span>
    )
  }


  return (
    <span
      className="
        rounded-full

        bg-gray-100

        px-3
        py-1.5

        text-[8px]
        font-semibold
        text-gray-500
      "
    >
      Validasi Guru
    </span>
  )
}
