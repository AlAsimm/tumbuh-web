import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Image,
  Layout,
  Megaphone,
  Palette,
  Plus,
  Sparkles,
  Store,
  X,
} from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../lib/api'

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'

import BuilderProgress
  from '../../components/umkm/BuilderProgress'

import BuilderChoiceCard
  from '../../components/umkm/BuilderChoiceCard'

import GeneratedProjectPreview
  from '../../components/umkm/GeneratedProjectPreview'


const businessTypes = [
  {
    value: 'Kuliner',
    title: 'Kuliner',
    description:
      'Makanan, minuman, bakery, katering, dan usaha sejenis.',
    icon: Store,
  },
  {
    value: 'Fashion',
    title: 'Fashion',
    description:
      'Pakaian, aksesoris, thrift, hijab, dan produk fashion.',
    icon: BriefcaseBusiness,
  },
  {
    value: 'Jasa',
    title: 'Jasa',
    description:
      'Laundry, fotografi, servis, kursus, dan layanan lainnya.',
    icon: Sparkles,
  },
  {
    value: 'Lainnya',
    title: 'Lainnya',
    description:
      'Jenis bisnis yang belum termasuk kategori di atas.',
    icon: Store,
  },
]


const commonNeeds = [
  {
    value: 'Website bisnis',
    title: 'Website Bisnis',
    icon: Layout,
  },
  {
    value: 'Konten media sosial',
    title: 'Konten Media Sosial',
    icon: Megaphone,
  },
  {
    value: 'Desain promosi',
    title: 'Desain Promosi',
    icon: Palette,
  },
  {
    value: 'Foto dan editing produk',
    title: 'Foto / Edit Produk',
    icon: Image,
  },
]


export default function UmkmProjectBuilderPage() {
  const navigate =
    useNavigate()

  const [
    step,
    setStep,
  ] = useState(1)

  const [
    form,
    setForm,
  ] = useState({
    jenis_usaha: '',
    kebutuhan: '',
    fitur_utama: [],
    anggaran: '',
    deadline: '',
    catatan_tambahan: '',
  })

  const [
    customFeature,
    setCustomFeature,
  ] = useState('')

  const [
    generatedProject,
    setGeneratedProject,
  ] = useState(null)

  const [
    generating,
    setGenerating,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }


  const toggleFeature = (
    feature
  ) => {
    setForm((current) => {
      const exists =
        current.fitur_utama.includes(
          feature
        )

      return {
        ...current,

        fitur_utama: exists
          ? current.fitur_utama.filter(
              (item) =>
                item !== feature
            )
          : [
              ...current.fitur_utama,
              feature,
            ],
      }
    })
  }


  const addCustomFeature = () => {
    const value =
      customFeature.trim()

    if (!value) {
      return
    }

    if (
      form.fitur_utama.includes(
        value
      )
    ) {
      setCustomFeature('')
      return
    }

    if (
      form.fitur_utama.length >= 10
    ) {
      setError(
        'Maksimal 10 kebutuhan utama.'
      )
      return
    }

    setForm((current) => ({
      ...current,

      fitur_utama: [
        ...current.fitur_utama,
        value,
      ],
    }))

    setCustomFeature('')
    setError('')
  }


  const validateCurrentStep = () => {
    setError('')

    if (
      step === 1 &&
      !form.jenis_usaha
    ) {
      setError(
        'Pilih jenis usaha terlebih dahulu.'
      )
      return false
    }


    if (step === 2) {
      if (
        !form.kebutuhan.trim()
      ) {
        setError(
          'Ceritakan kebutuhan bisnis Anda.'
        )
        return false
      }

      if (
        form.fitur_utama.length === 0
      ) {
        setError(
          'Pilih minimal satu kebutuhan utama.'
        )
        return false
      }
    }


    if (step === 3) {
      if (
        form.anggaran === '' ||
        Number(form.anggaran) < 0
      ) {
        setError(
          'Masukkan anggaran proyek.'
        )
        return false
      }

      if (!form.deadline) {
        setError(
          'Pilih deadline proyek.'
        )
        return false
      }
    }

    return true
  }


  const nextStep = () => {
    if (
      !validateCurrentStep()
    ) {
      return
    }

    setStep((current) =>
      Math.min(
        current + 1,
        3
      )
    )
  }


  const previousStep = () => {
    setError('')

    setStep((current) =>
      Math.max(
        current - 1,
        1
      )
    )
  }


  const generateProject =
    async () => {
      if (
        !validateCurrentStep()
      ) {
        return
      }

      setGenerating(true)
      setError('')

      try {
        const response =
          await api.post(
            '/umkm/project-builder/generate',
            {
              jenis_usaha:
                form.jenis_usaha,

              kebutuhan:
                form.kebutuhan,

              fitur_utama:
                form.fitur_utama,

              anggaran:
                Number(
                  form.anggaran
                ),

              deadline:
                form.deadline,

              catatan_tambahan:
                form.catatan_tambahan ||
                null,
            }
          )

        const result =
          response.data?.project ??
          response.data?.draft ??
          response.data?.data ??
          response.data

        setGeneratedProject(
          result
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
            'Data tidak valid.'
          )
        } else {
          setError(
            err.response
              ?.data
              ?.message ??
            'AI belum berhasil membuat draft proyek.'
          )
        }

      } finally {
        setGenerating(false)
      }
    }


  const handleBackFromPreview = () => {
    setGeneratedProject(null)
    setError('')
  }


  if (generatedProject) {
    return (
      <GeneratedProjectPreview
        generatedProject={
          generatedProject
        }
        builderAnswers={form}
        onBack={
          handleBackFromPreview
        }
      />
    )
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
          onClick={() => {
            if (step > 1) {
              previousStep()
            } else {
              navigate('/umkm')
            }
          }}
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
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Sparkles
              size={14}
              className="
                text-tumbuh-green-dark
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-widest
                text-green-600
              "
            >
              Imagine
            </span>
          </div>

          <h1
            className="
              mt-0.5
              text-xl
              font-semibold
            "
          >
            Bangun Proyek Anda
          </h1>
        </div>
      </header>


      {/* PROGRESS */}

      <section className="mt-6">
        <div
          className="
            mb-2
            flex
            justify-between
            text-[9px]
            text-gray-400
          "
        >
          <span>
            Langkah {step} dari 3
          </span>

          <span>
            {Math.round(
              (step / 3) * 100
            )}%
          </span>
        </div>

        <BuilderProgress
          currentStep={step}
        />
      </section>


      {/* STEP */}

      <section
        className="
          mt-7
          rounded-[30px]
          bg-white/80
          px-4
          py-6
          md:px-6
        "
      >

        {step === 1 && (
          <BusinessStep
            form={form}
            updateField={
              updateField
            }
          />
        )}


        {step === 2 && (
          <NeedsStep
            form={form}
            updateField={
              updateField
            }
            toggleFeature={
              toggleFeature
            }
            customFeature={
              customFeature
            }
            setCustomFeature={
              setCustomFeature
            }
            addCustomFeature={
              addCustomFeature
            }
          />
        )}


        {step === 3 && (
          <BudgetStep
            form={form}
            updateField={
              updateField
            }
          />
        )}

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
            text-[10px]
            leading-4
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* ACTION */}

      <div
        className="
          mt-6
          flex
          gap-3
        "
      >

        {step > 1 && (
          <button
            type="button"
            onClick={
              previousStep
            }
            className="
              h-13
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              text-xs
              font-semibold
            "
          >
            Kembali
          </button>
        )}


        {step < 3 ? (
          <button
            type="button"
            onClick={
              nextStep
            }
            className="
              flex
              h-13
              flex-1
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-tumbuh-green
              font-semibold
              text-white
              transition
              active:scale-[0.99]
            "
          >
            Lanjut
            <ArrowRight
              size={16}
            />
          </button>

        ) : (
          <button
            type="button"
            disabled={generating}
            onClick={
              generateProject
            }
            className="
              flex
              h-14
              flex-1
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-tumbuh-green
              font-semibold
              text-white
              shadow-[0_8px_24px_rgba(108,216,135,0.3)]
              transition
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Sparkles
              size={17}
            />

            {generating
              ? 'AI sedang menyusun...'
              : 'Buat dengan Imagine AI'}
          </button>
        )}

      </div>

    </UmkmAppShell>
  )
}


/*
 * PENTING:
 * Ketiga component di bawah berada DI LUAR
 * UmkmProjectBuilderPage.
 *
 * Dengan begitu React mempertahankan identity
 * component ketika parent melakukan re-render,
 * sehingga input tidak kehilangan fokus
 * setiap kali user mengetik.
 */


function BusinessStep({
  form,
  updateField,
}) {
  return (
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
        Tentang Bisnis
      </p>


      <h2
        className="
          mt-2
          text-[20px]
          font-semibold
          leading-7
        "
      >
        Bisnis Anda bergerak
        di bidang apa?
      </h2>


      <p
        className="
          mt-2
          text-[10px]
          leading-5
          text-gray-400
        "
      >
        Informasi ini membantu Imagine
        memahami konteks kebutuhan
        bisnis Anda.
      </p>


      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
        "
      >

        {businessTypes.map(
          (business) => (
            <BuilderChoiceCard
              key={
                business.value
              }
              icon={
                business.icon
              }
              title={
                business.title
              }
              description={
                business.description
              }
              active={
                form.jenis_usaha ===
                business.value
              }
              onClick={() =>
                updateField(
                  'jenis_usaha',
                  business.value
                )
              }
            />
          )
        )}

      </div>

    </div>
  )
}


function NeedsStep({
  form,
  updateField,
  toggleFeature,
  customFeature,
  setCustomFeature,
  addCustomFeature,
}) {
  return (
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
        Kebutuhan Proyek
      </p>


      <h2
        className="
          mt-2
          text-[20px]
          font-semibold
          leading-7
        "
      >
        Apa yang ingin
        Anda tingkatkan?
      </h2>


      <p
        className="
          mt-2
          text-[10px]
          leading-5
          text-gray-400
        "
      >
        Ceritakan masalah dengan bahasa
        sehari-hari. Tidak perlu memakai
        istilah teknis.
      </p>


      <div className="mt-6">

        <label
          htmlFor="builder-need"
          className="
            text-[11px]
            font-semibold
          "
        >
          Ceritakan kebutuhan Anda
        </label>


        <textarea
          id="builder-need"
          rows={5}
          maxLength={500}
          value={
            form.kebutuhan
          }
          onChange={(event) =>
            updateField(
              'kebutuhan',
              event.target.value
            )
          }
          placeholder="Contoh: Pelanggan saya sering bertanya produk lewat WhatsApp. Saya ingin punya tempat sederhana agar mereka bisa melihat semua produk dan langsung menghubungi kami."
          className="
            mt-2
            w-full
            resize-none
            rounded-[20px]
            border
            border-gray-200
            px-4
            py-4
            text-xs
            leading-5
            outline-none
            transition
            focus:border-tumbuh-green
            focus:ring-4
            focus:ring-green-100
          "
        />


        <div
          className="
            mt-1
            text-right
            text-[8px]
            text-gray-300
          "
        >
          {form.kebutuhan.length}/500
        </div>

      </div>


      <div className="mt-5">

        <p
          className="
            text-[11px]
            font-semibold
          "
        >
          Kebutuhan utama
        </p>


        <p
          className="
            mt-1
            text-[9px]
            text-gray-400
          "
        >
          Bisa pilih lebih dari satu.
        </p>


        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >

          {commonNeeds.map(
            (need) => {
              const active =
                form.fitur_utama.includes(
                  need.value
                )

              const Icon =
                need.icon

              return (
                <button
                  key={
                    need.value
                  }
                  type="button"
                  onClick={() =>
                    toggleFeature(
                      need.value
                    )
                  }
                  className={`
                    relative
                    flex
                    min-h-[90px]
                    flex-col
                    items-start
                    justify-between
                    rounded-[18px]
                    border-2
                    p-3
                    text-left

                    ${
                      active
                        ? `
                          border-tumbuh-green
                          bg-green-50
                        `
                        : `
                          border-gray-100
                          bg-white
                        `
                    }
                  `}
                >

                  <Icon
                    size={18}
                    className={
                      active
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  />


                  <span
                    className="
                      mt-3
                      text-[10px]
                      font-semibold
                    "
                  >
                    {need.title}
                  </span>


                  {active && (
                    <div
                      className="
                        absolute
                        right-2
                        top-2
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-tumbuh-green
                        text-white
                      "
                    >
                      <Check
                        size={11}
                      />
                    </div>
                  )}

                </button>
              )
            }
          )}

        </div>

      </div>


      <div className="mt-5">

        <p
          className="
            text-[11px]
            font-semibold
          "
        >
          Tambahkan kebutuhan lain
        </p>


        <div
          className="
            mt-2
            flex
            gap-2
          "
        >

          <input
            value={
              customFeature
            }
            maxLength={150}
            onChange={(event) =>
              setCustomFeature(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                'Enter'
              ) {
                event.preventDefault()
                addCustomFeature()
              }
            }}
            placeholder="Contoh: tombol WhatsApp"
            className="
              h-11
              min-w-0
              flex-1
              rounded-2xl
              border
              border-gray-200
              px-4
              text-[10px]
              outline-none
              focus:border-tumbuh-green
            "
          />


          <button
            type="button"
            onClick={
              addCustomFeature
            }
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gray-900
              text-white
            "
          >
            <Plus size={16} />
          </button>

        </div>


        {form.fitur_utama.length > 0 && (
          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >

            {form.fitur_utama.map(
              (feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() =>
                    toggleFeature(
                      feature
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-green-100
                    px-3
                    py-1.5
                    text-[8px]
                    font-medium
                    text-green-700
                  "
                >
                  {feature}
                  <X size={10} />
                </button>
              )
            )}

          </div>
        )}

      </div>

    </div>
  )
}


function BudgetStep({
  form,
  updateField,
}) {
  const today =
    new Date()
      .toISOString()
      .split('T')[0]


  return (
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
        Detail Proyek
      </p>


      <h2
        className="
          mt-2
          text-[20px]
          font-semibold
          leading-7
        "
      >
        Sedikit lagi!
      </h2>


      <p
        className="
          mt-2
          text-[10px]
          leading-5
          text-gray-400
        "
      >
        Tentukan anggaran dan waktu
        pengerjaan. Imagine akan menyusun
        brief berdasarkan informasi Anda.
      </p>


      <div className="mt-7">

        <label
          htmlFor="builder-budget"
          className="
            text-[11px]
            font-semibold
          "
        >
          Anggaran Proyek
        </label>


        <div className="relative mt-2">

          <span
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-xs
              font-semibold
              text-gray-400
            "
          >
            Rp
          </span>


          <input
            id="builder-budget"
            type="number"
            min="0"
            value={
              form.anggaran
            }
            onChange={(event) =>
              updateField(
                'anggaran',
                event.target.value
              )
            }
            placeholder="500000"
            className="
              h-14
              w-full
              rounded-[20px]
              border
              border-gray-200
              pl-11
              pr-4
              text-sm
              font-semibold
              outline-none
              focus:border-tumbuh-green
              focus:ring-4
              focus:ring-green-100
            "
          />

        </div>

      </div>


      <div className="mt-5">

        <label
          htmlFor="builder-deadline"
          className="
            text-[11px]
            font-semibold
          "
        >
          Deadline
        </label>


        <input
          id="builder-deadline"
          type="date"
          min={today}
          value={
            form.deadline
          }
          onChange={(event) =>
            updateField(
              'deadline',
              event.target.value
            )
          }
          className="
            mt-2
            h-14
            w-full
            rounded-[20px]
            border
            border-gray-200
            bg-white
            px-4
            text-xs
            outline-none
            focus:border-tumbuh-green
            focus:ring-4
            focus:ring-green-100
          "
        />

      </div>


      <div className="mt-5">

        <label
          htmlFor="builder-note"
          className="
            text-[11px]
            font-semibold
          "
        >
          Catatan Tambahan

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
          id="builder-note"
          rows={4}
          maxLength={1000}
          value={
            form.catatan_tambahan
          }
          onChange={(event) =>
            updateField(
              'catatan_tambahan',
              event.target.value
            )
          }
          placeholder="Contoh: warna usaha kami hijau dan putih. Target pelanggan adalah ibu rumah tangga."
          className="
            mt-2
            w-full
            resize-none
            rounded-[20px]
            border
            border-gray-200
            px-4
            py-4
            text-xs
            leading-5
            outline-none
            focus:border-tumbuh-green
            focus:ring-4
            focus:ring-green-100
          "
        />

      </div>


      <div
        className="
          mt-6
          flex
          items-start
          gap-3
          rounded-[20px]
          bg-purple-50
          px-4
          py-4
        "
      >
        <Sparkles
          size={18}
          className="
            mt-0.5
            shrink-0
            text-purple-500
          "
        />


        <div>
          <p
            className="
              text-[10px]
              font-semibold
              text-purple-700
            "
          >
            Imagine AI
          </p>

          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-gray-500
            "
          >
            AI hanya membantu menyusun
            draft. Anda tetap dapat
            memeriksa dan mengubah isinya
            sebelum proyek diterbitkan.
          </p>
        </div>

      </div>

    </div>
  )
}
