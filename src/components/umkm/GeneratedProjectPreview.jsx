import {
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Save,
  Send,
  Sparkles,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import api from '../../lib/api'

import UmkmAppShell
  from './UmkmAppShell'

import {
  formatRupiah,
} from '../../lib/formatters'


export default function GeneratedProjectPreview({
  generatedProject,
  builderAnswers,
  onBack,
}) {
  const navigate =
    useNavigate()


  const [
    draft,
    setDraft,
  ] = useState({
    judul:
      generatedProject.judul ??
      '',

    deskripsi_brief:
      generatedProject.deskripsi_brief ??
      '',

    kategori_jurusan:
      generatedProject.kategori_jurusan ??
      '',

    checklist:
      Array.isArray(
        generatedProject.checklist
      )
        ? generatedProject.checklist
        : [],
  })


  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    publishing,
    setPublishing,
  ] = useState(false)

  const [
    savedProject,
    setSavedProject,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')


  /*
   * Setelah draft berhasil tersimpan ke database,
   * semua field dikunci agar perubahan lokal
   * tidak berbeda dengan data yang sudah disimpan.
   */
  const locked =
    Boolean(savedProject)


  const updateField = (
    field,
    value
  ) => {
    if (locked) {
      return
    }

    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }


  const updateChecklist = (
    index,
    value
  ) => {
    if (locked) {
      return
    }

    setDraft((current) => ({
      ...current,

      checklist:
        current.checklist.map(
          (item, itemIndex) =>
            itemIndex === index
              ? value
              : item
        ),
    }))
  }


  const removeChecklist = (
    index
  ) => {
    if (locked) {
      return
    }

    setDraft((current) => ({
      ...current,

      checklist:
        current.checklist.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }))
  }


  const addChecklist = () => {
    if (locked) {
      return
    }

    setDraft((current) => ({
      ...current,

      checklist: [
        ...current.checklist,
        '',
      ],
    }))
  }


  const validateDraft = () => {
    if (!draft.judul.trim()) {
      setError(
        'Judul proyek wajib diisi.'
      )

      return false
    }


    if (
      !draft.deskripsi_brief.trim()
    ) {
      setError(
        'Deskripsi proyek wajib diisi.'
      )

      return false
    }


    if (
      !draft.kategori_jurusan.trim()
    ) {
      setError(
        'Kategori jurusan wajib diisi.'
      )

      return false
    }


    return true
  }


  const saveDraft = async () => {
    if (!validateDraft()) {
      return null
    }


    if (savedProject) {
      return savedProject
    }


    setSaving(true)
    setError('')
    setSuccess('')


    try {
      const response =
        await api.post(
          '/projects',
          {
            judul:
              draft.judul.trim(),

            deskripsi_brief:
              draft.deskripsi_brief.trim(),

            kategori_jurusan:
              draft.kategori_jurusan.trim(),

            anggaran:
              Number(
                builderAnswers.anggaran
              ),

            deadline:
              builderAnswers.deadline,

            checklist:
              draft.checklist
                .map(
                  (item) =>
                    item.trim()
                )
                .filter(Boolean),

            builder_answers:
              builderAnswers,

            generated_by_ai:
              true,
          }
        )


      const project =
        response.data?.project ??
        response.data?.data ??
        response.data


      setSavedProject(
        project
      )

      setSuccess(
        'Draft berhasil disimpan. Data dikunci sampai proyek dipublikasikan.'
      )


      return project

    } catch (err) {
      console.error(err)

      setError(
        err.response
          ?.data
          ?.message ??
        'Draft belum berhasil disimpan.'
      )

      return null

    } finally {
      setSaving(false)
    }
  }


  const publishProject =
    async () => {

      setPublishing(true)
      setError('')
      setSuccess('')


      try {
        /*
         * Simpan sebagai draft dahulu
         * apabila project belum memiliki ID.
         */
        const project =
          savedProject ??
          await saveDraft()


        if (!project?.id) {
          return
        }


        await api.patch(
          `/projects/${project.id}/publish`
        )


        setSuccess(
          'Proyek berhasil dipublikasikan.'
        )


        setTimeout(() => {
          navigate(
            '/umkm/projects'
          )
        }, 700)

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Proyek belum berhasil dipublikasikan.'
        )

      } finally {
        setPublishing(false)
      }
    }


  return (
    <UmkmAppShell>

      {/* HEADER */}

      <header
        className="
          flex
          items-center
          gap-3
        "
      >

        <button
          type="button"

          onClick={onBack}

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
          <ArrowLeft size={19} />
        </button>


        <div>

          <div
            className="
              flex
              items-center
              gap-1.5

              text-[9px]
              font-semibold
              uppercase
              tracking-widest
              text-purple-500
            "
          >
            <Sparkles size={12} />

            Imagine Result
          </div>


          <h1
            className="
              mt-1
              text-xl
              font-semibold
            "
          >
            Draft Proyek Anda
          </h1>

        </div>

      </header>


      {/* AI NOTICE */}

      <div
        className="
          mt-6

          flex
          items-start
          gap-3

          rounded-[22px]

          border
          border-green-200

          bg-green-50

          px-4
          py-4
        "
      >
        <CheckCircle2
          size={19}
          className="
            shrink-0
            text-green-600
          "
        />

        <div>
          <p
            className="
              text-[10px]
              font-semibold
              text-green-700
            "
          >
            {locked
              ? 'Draft sudah tersimpan'
              : 'Draft berhasil dibuat'}
          </p>

          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-gray-500
            "
          >
            {locked
              ? 'Draft telah tersimpan ke database. Field dikunci agar data yang akan dipublikasikan tetap konsisten.'
              : 'Periksa kembali hasil Imagine. Anda bebas mengubah semua informasi sebelum proyek disimpan dan diterbitkan.'}
          </p>
        </div>
      </div>


      {/* FORM */}

      <section
        className="
          mt-6

          rounded-[28px]

          bg-white

          p-5
        "
      >

        <EditField
          label="Judul Proyek"

          value={
            draft.judul
          }

          disabled={
            locked
          }

          onChange={(value) =>
            updateField(
              'judul',
              value
            )
          }
        />


        <div className="mt-5">

          <label
            className="
              text-[10px]
              font-semibold
            "
          >
            Deskripsi Proyek
          </label>


          <textarea
            rows={7}

            value={
              draft.deskripsi_brief
            }

            disabled={
              locked
            }

            onChange={(event) =>
              updateField(
                'deskripsi_brief',
                event.target.value
              )
            }

            className="
              mt-2
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

              transition

              focus:border-tumbuh-green

              disabled:cursor-not-allowed
              disabled:bg-gray-50
              disabled:text-gray-500
            "
          />

        </div>


        <div className="mt-5">

          <EditField
            label="Kategori Jurusan"

            value={
              draft.kategori_jurusan
            }

            disabled={
              locked
            }

            onChange={(value) =>
              updateField(
                'kategori_jurusan',
                value
              )
            }
          />

        </div>


        {/* FIXED USER INPUT */}

        <div
          className="
            mt-6

            grid
            grid-cols-2
            gap-3
          "
        >

          <InfoBox
            label="Anggaran"

            value={
              formatRupiah(
                builderAnswers.anggaran
              )
            }
          />


          <InfoBox
            label="Deadline"

            value={
              builderAnswers.deadline
            }
          />

        </div>


        {/* CHECKLIST */}

        <div className="mt-7">

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                "
              >
                Checklist Pekerjaan
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  text-gray-400
                "
              >
                Hasil kerja yang
                diharapkan dari siswa.
              </p>
            </div>


            <button
              type="button"

              disabled={
                locked
              }

              onClick={
                addChecklist
              }

              className="
                rounded-full

                bg-green-50

                px-3
                py-2

                text-[8px]
                font-semibold
                text-green-700

                transition

                disabled:cursor-not-allowed
                disabled:bg-gray-100
                disabled:text-gray-400
              "
            >
              + Tambah
            </button>

          </div>


          <div
            className="
              mt-4
              space-y-2
            "
          >

            {draft.checklist.map(
              (item, index) => (

                <div
                  key={index}

                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      bg-green-100

                      text-[9px]
                      font-semibold
                      text-green-700
                    "
                  >
                    {index + 1}
                  </div>


                  <input
                    value={item}

                    disabled={
                      locked
                    }

                    onChange={(event) =>
                      updateChecklist(
                        index,
                        event.target.value
                      )
                    }

                    className="
                      h-11
                      min-w-0
                      flex-1

                      rounded-2xl

                      border
                      border-gray-200

                      px-3

                      text-[9px]

                      outline-none

                      transition

                      focus:border-tumbuh-green

                      disabled:cursor-not-allowed
                      disabled:bg-gray-50
                      disabled:text-gray-500
                    "
                  />


                  <button
                    type="button"

                    disabled={
                      locked
                    }

                    onClick={() =>
                      removeChecklist(
                        index
                      )
                    }

                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center

                      rounded-full

                      text-gray-300

                      transition

                      hover:bg-red-50
                      hover:text-red-400

                      disabled:cursor-not-allowed
                      disabled:hover:bg-transparent
                      disabled:hover:text-gray-300
                    "
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-4
            rounded-2xl
            bg-red-50
            p-4
            text-[10px]
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {success && (
        <div
          className="
            mt-4
            rounded-2xl
            bg-green-50
            p-4
            text-[10px]
            text-green-700
          "
        >
          {success}
        </div>
      )}


      {/* ACTION */}

      <div
        className="
          mt-6

          grid
          grid-cols-2
          gap-3
        "
      >

        <button
          type="button"

          disabled={
            saving ||
            locked ||
            publishing
          }

          onClick={
            saveDraft
          }

          className="
            flex
            h-13
            items-center
            justify-center
            gap-2

            rounded-2xl

            border
            border-gray-200

            bg-white

            text-[10px]
            font-semibold

            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-400
            disabled:opacity-70
          "
        >
          <Save size={15} />

          {locked
            ? 'Draft Tersimpan'
            : saving
              ? 'Menyimpan...'
              : 'Simpan Draft'}
        </button>


        <button
          type="button"

          disabled={
            publishing ||
            saving
          }

          onClick={
            publishProject
          }

          className="
            flex
            h-13
            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-tumbuh-green

            text-[10px]
            font-semibold
            text-white

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Send size={15} />

          {publishing
            ? 'Menerbitkan...'
            : 'Publish'}
        </button>

      </div>

    </UmkmAppShell>
  )
}


function EditField({
  label,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>

      <label
        className="
          text-[10px]
          font-semibold
        "
      >
        {label}
      </label>


      <div className="relative mt-2">

        <input
          value={value}

          disabled={
            disabled
          }

          onChange={(event) =>
            onChange(
              event.target.value
            )
          }

          className="
            h-12
            w-full

            rounded-[18px]

            border
            border-gray-200

            px-4
            pr-10

            text-[10px]

            outline-none

            transition

            focus:border-tumbuh-green

            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-500
          "
        />


        {!disabled && (
          <Pencil
            size={13}

            className="
              absolute
              right-4
              top-1/2

              -translate-y-1/2

              text-gray-300
            "
          />
        )}

      </div>

    </div>
  )
}


function InfoBox({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-[18px]

        bg-gray-50

        px-4
        py-4
      "
    >
      <p
        className="
          text-[8px]
          text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-[10px]
          font-semibold
        "
      >
        {value}
      </p>
    </div>
  )
}
