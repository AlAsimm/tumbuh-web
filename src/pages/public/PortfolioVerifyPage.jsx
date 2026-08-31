import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Star,
  Store,
  XCircle,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  useSearchParams,
} from 'react-router-dom'

import TumbuhLogo
  from '../../components/common/TumbuhLogo'


export default function PortfolioVerifyPage() {
  const [
    searchParams,
  ] = useSearchParams()


  const signedUrl =
    searchParams.get('url')


  const [
    verification,
    setVerification,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const verifyPortfolio =
      async () => {

        if (!signedUrl) {
          setError(
            'Link verifikasi tidak valid.'
          )

          setLoading(false)

          return
        }


        try {
          /*
           * Penting:
           * URL signed tidak boleh diubah.
           */

          const response =
            await fetch(
              signedUrl,
              {
                headers: {
                  Accept:
                    'application/json',
                },
              }
            )


          if (!response.ok) {
            throw new Error(
              `Verification failed: ${response.status}`
            )
          }


          const data =
            await response.json()


          setVerification(data)

        } catch (err) {
          console.error(err)

          setError(
            'Portofolio tidak dapat diverifikasi. Link mungkin tidak valid atau telah berubah.'
          )

        } finally {
          setLoading(false)
        }
      }


    verifyPortfolio()
  }, [signedUrl])


  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center

          bg-tumbuh-bg
        "
      >
        <p
          className="
            animate-pulse
            font-semibold
            text-tumbuh-green-dark
          "
        >
          Memverifikasi portofolio...
        </p>
      </main>
    )
  }


  if (
    error ||
    !verification
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center

          bg-tumbuh-bg

          px-6
        "
      >

        <div
          className="
            w-full
            max-w-md

            rounded-[30px]

            bg-white

            p-8

            text-center
          "
        >

          <XCircle
            size={50}
            className="
              mx-auto
              text-red-500
            "
          />


          <h1
            className="
              mt-5
              text-xl
              font-semibold
            "
          >
            Verifikasi Gagal
          </h1>


          <p
            className="
              mt-2
              text-xs
              leading-5
              text-gray-400
            "
          >
            {error}
          </p>

        </div>

      </main>
    )
  }


  const student =
    verification.student ?? {}


  const project =
    verification.project ?? {}


  const umkm =
    verification.umkm ?? {}


  const review =
    verification.review ?? {}


  const teacher =
    verification.teacher_validation ??
    verification.validation ??
    {}


  return (
    <main
      className="
        min-h-screen

        bg-gradient-to-b
        from-white
        via-tumbuh-bg
        to-cyan-50

        px-5
        py-8
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-xl
        "
      >

        {/* LOGO */}

        <TumbuhLogo
          size="sm"
        />


        {/* VERIFIED */}

        <section
          className="
            mt-8

            rounded-[32px]

            bg-white

            p-6

            shadow-[0_14px_45px_rgba(0,0,0,0.05)]
          "
        >

          <div className="text-center">

            <div
              className="
                mx-auto

                flex
                h-16
                w-16

                items-center
                justify-center

                rounded-full

                bg-green-100

                text-green-700
              "
            >
              <ShieldCheck
                size={30}
              />
            </div>


            <div
              className="
                mt-4

                flex
                items-center
                justify-center
                gap-2
              "
            >

              <h1
                className="
                  text-xl
                  font-semibold
                "
              >
                Portofolio Terverifikasi
              </h1>


              <BadgeCheck
                size={19}
                className="
                  text-green-600
                "
              />

            </div>


            <p
              className="
                mt-2
                text-[10px]
                leading-4
                text-gray-400
              "
            >
              Data proyek ini diverifikasi
              melalui sistem TUMBUH.
            </p>

          </div>


          {/* STUDENT */}

          <VerificationSection
            title="Siswa"
          >

            <VerifyRow
              icon={GraduationCap}

              label="Nama"

              value={
                student.name ??
                '-'
              }
            />


            <VerifyRow
              icon={GraduationCap}

              label="Sekolah"

              value={
                student.school ??
                student.nama_sekolah ??
                '-'
              }
            />


            <VerifyRow
              icon={GraduationCap}

              label="Jurusan"

              value={
                student.major ??
                student.jurusan ??
                '-'
              }
            />

          </VerificationSection>


          {/* PROJECT */}

          <VerificationSection
            title="Proyek"
          >

            <VerifyRow
              icon={BriefcaseBusiness}

              label="Judul Proyek"

              value={
                project.title ??
                project.judul ??
                '-'
              }
            />


            <VerifyRow
              icon={Store}

              label="UMKM"

              value={
                umkm.business_name ??
                umkm.nama_toko ??
                '-'
              }
            />


            <VerifyRow
              icon={CheckCircle2}

              label="Status"

              value="Selesai & Terverifikasi"
            />

          </VerificationSection>


          {/* REVIEW */}

          {review?.rating && (
            <VerificationSection
              title="Penilaian UMKM"
            >

              <VerifyRow
                icon={Star}

                label="Rating"

                value={`${review.rating}/5`}
              />


              {review.comment && (
                <div
                  className="
                    mt-3

                    rounded-2xl

                    bg-gray-50

                    p-4

                    text-[10px]
                    leading-4
                    text-gray-500
                  "
                >
                  “{review.comment}”
                </div>
              )}

            </VerificationSection>
          )}


          {/* VALIDATION */}

          {teacher && (
            <VerificationSection
              title="Validasi Guru"
            >

              <VerifyRow
                icon={ShieldCheck}

                label="Keputusan"

                value={
                  teacher.decision ===
                  'approved'
                    ? 'Disetujui'
                    : teacher.keputusan ??
                      'Disetujui'
                }
              />


              {(teacher.teacher_name ||
                teacher.guru) && (

                <VerifyRow
                  icon={GraduationCap}

                  label="Guru Pembimbing"

                  value={
                    teacher.teacher_name ??
                    teacher.guru
                  }
                />

              )}

            </VerificationSection>
          )}


          {/* FOOTER */}

          <div
            className="
              mt-7

              rounded-2xl

              bg-green-50

              px-4
              py-3

              text-center
            "
          >

            <p
              className="
                text-[9px]
                font-medium
                text-green-700
              "
            >
              ✓ Verified by TUMBUH
            </p>

          </div>

        </section>

      </div>

    </main>
  )
}


function VerificationSection({
  title,
  children,
}) {
  return (
    <section
      className="
        mt-7

        border-t
        border-gray-100

        pt-5
      "
    >

      <h2
        className="
          text-xs
          font-semibold
        "
      >
        {title}
      </h2>


      <div
        className="
          mt-4
          space-y-4
        "
      >
        {children}
      </div>

    </section>
  )
}


function VerifyRow({
  icon: Icon,
  label,
  value,
}) {
  return (
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

          bg-green-50

          text-tumbuh-green-dark
        "
      >
        <Icon size={16} />
      </div>


      <div>

        <p
          className="
            text-[9px]
            text-gray-400
          "
        >
          {label}
        </p>


        <p
          className="
            mt-0.5
            text-[11px]
            font-medium
          "
        >
          {value}
        </p>

      </div>

    </div>
  )
}