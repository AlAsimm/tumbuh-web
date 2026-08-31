import {
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react'

import {
  QRCodeSVG,
} from 'qrcode.react'

import {
  useState,
} from 'react'


export default function PortfolioQrModal({
  portfolio,
  studentName,
  onClose,
}) {
  const [copied, setCopied] =
    useState(false)


  if (!portfolio) {
    return null
  }


  const signedUrl =
    portfolio.qr_signed_url


  /*
   * QR diarahkan ke halaman React publik.
   * Halaman React kemudian memvalidasi
   * signed Laravel URL tanpa mengubahnya.
   */

  const appUrl =
    import.meta.env.VITE_APP_URL ??
    window.location.origin


  const publicVerificationUrl =
    `${appUrl}/verify?url=${
      encodeURIComponent(
        signedUrl
      )
    }`


  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        publicVerificationUrl
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)

    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-end
        justify-center

        bg-black/40

        p-0

        backdrop-blur-sm

        sm:items-center
        sm:p-6
      "
    >

      <div
        className="
          relative

          w-full
          max-w-[430px]

          rounded-t-[32px]

          bg-white

          px-6
          pb-8
          pt-6

          shadow-2xl

          sm:rounded-[32px]
        "
      >

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}

          className="
            absolute
            right-5
            top-5

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            bg-gray-100

            text-gray-500
          "
        >
          <X size={17} />
        </button>


        {/* HEADER */}

        <div className="text-center">

          <div
            className="
              mx-auto

              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-full

              bg-green-100

              text-tumbuh-green-dark
            "
          >
            <CheckCircle2 size={23} />
          </div>


          <h2
            className="
              mt-4
              text-lg
              font-semibold
            "
          >
            Portofolio Terverifikasi
          </h2>


          <p
            className="
              mt-1
              text-[10px]
              leading-4
              text-gray-400
            "
          >
            Scan QR untuk memverifikasi
            hasil proyek {studentName}.
          </p>

        </div>


        {/* QR */}

        <div
          className="
            mx-auto
            mt-6

            flex
            w-fit

            items-center
            justify-center

            rounded-[26px]

            border
            border-gray-100

            bg-white

            p-5

            shadow-[0_10px_35px_rgba(0,0,0,0.06)]
          "
        >

          <QRCodeSVG
            value={
              publicVerificationUrl
            }

            size={190}

            level="M"

            includeMargin={false}
          />

        </div>


        <p
          className="
            mt-4
            text-center
            text-[9px]
            text-gray-400
          "
        >
          Portfolio ID #{portfolio.id}
        </p>


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

            onClick={copyLink}

            className="
              flex
              h-12
              items-center
              justify-center
              gap-2

              rounded-2xl

              border
              border-gray-200

              bg-white

              text-[10px]
              font-semibold
            "
          >
            <Copy size={15} />

            {copied
              ? 'Tersalin'
              : 'Salin Link'}
          </button>


          <a
            href={publicVerificationUrl}

            target="_blank"
            rel="noreferrer"

            className="
              flex
              h-12
              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-tumbuh-green

              text-[10px]
              font-semibold
              text-white
            "
          >
            <ExternalLink size={15} />

            Verifikasi
          </a>

        </div>

      </div>

    </div>
  )
}