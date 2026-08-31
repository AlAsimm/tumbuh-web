import {
  Send,
  UserRound,
} from 'lucide-react'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'


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


function formatMessageTime(value) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(
    new Date(value)
  )
}


export default function UmkmProjectChatTab({
  projectId,
  projectStatus,
}) {
  const {
    user,
  } = useAuth()


  const [
    messages,
    setMessages,
  ] = useState([])

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    sending,
    setSending,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  const bottomRef =
    useRef(null)


  const allowedStatuses = [
    'in_progress',
    'teacher_review',
    'umkm_review',
    'mediation',
  ]


  const canSend =
    allowedStatuses.includes(
      projectStatus
    )


  useEffect(() => {
    let active = true


    const loadMessages =
      async (
        silent = false
      ) => {

        if (!silent) {
          setLoading(true)
        }


        try {
          const response =
            await api.get(
              `/projects/${projectId}/messages`
            )


          if (active) {
            setMessages(
              unwrapMessages(
                response.data
              )
            )
          }

        } catch (err) {
          if (
            active &&
            !silent
          ) {
            setError(
              err.response
                ?.data
                ?.message ??
              'Percakapan belum dapat dimuat.'
            )
          }

        } finally {
          if (
            active &&
            !silent
          ) {
            setLoading(false)
          }
        }
      }


    loadMessages()


    const interval =
      setInterval(() => {
        loadMessages(true)
      }, 3000)


    return () => {
      active = false

      clearInterval(
        interval
      )
    }

  }, [projectId])


  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior: 'smooth',
      })
  }, [messages.length])


  const handleSend =
    async (event) => {

      event.preventDefault()


      const content =
        message.trim()


      if (
        !content ||
        sending ||
        !canSend
      ) {
        return
      }


      setSending(true)
      setError('')


      try {
        const response =
          await api.post(
            `/projects/${projectId}/messages`,
            {
              isi_pesan:
                content,
            }
          )


        const created =
          response.data
            ?.message ??
          response.data
            ?.data


        if (
          created &&
          typeof created ===
          'object'
        ) {
          setMessages(
            (current) => [
              ...current,
              created,
            ]
          )

        } else {
          const refreshed =
            await api.get(
              `/projects/${projectId}/messages`
            )

          setMessages(
            unwrapMessages(
              refreshed.data
            )
          )
        }


        setMessage('')

      } catch (err) {
        console.error(err)

        setError(
          err.response
            ?.data
            ?.message ??
          'Pesan belum berhasil dikirim.'
        )

      } finally {
        setSending(false)
      }
    }


  return (
    <div>

      {/* TRANSPARENCY */}

      <div
        className="
          flex
          items-start
          gap-3

          rounded-[20px]

          border
          border-green-700

          bg-[#B8F0CE]

          px-4
          py-4
        "
      >
        <UserRound
          size={18}
          className="
            mt-0.5
            shrink-0
            text-green-800
          "
        />


        <div>
          <p
            className="
              text-[10px]
              font-semibold
              text-green-900
            "
          >
            Transparansi Untuk Semua
          </p>

          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-green-900/70
            "
          >
            Percakapan dapat dipantau
            oleh guru pembimbing sekolah
            untuk memastikan proyek
            berjalan baik.
          </p>
        </div>
      </div>


      {/* CHAT */}

      <div
        className="
          mt-4

          min-h-[360px]

          rounded-[24px]

          bg-white

          p-4
        "
      >

        {loading ? (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >
            <p
              className="
                animate-pulse
                text-[10px]
                font-semibold
                text-green-700
              "
            >
              Memuat percakapan...
            </p>
          </div>

        ) : messages.length > 0 ? (

          <div
            className="
              space-y-3
            "
          >

            {messages.map(
              (item) => (

                <MessageBubble
                  key={item.id}

                  message={item}

                  mine={
                    Number(
                      item.sender_id
                    ) ===
                    Number(
                      user?.id
                    )
                  }
                />

              )
            )}


            <div
              ref={bottomRef}
            />

          </div>

        ) : (

          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center

              text-center
            "
          >
            <p
              className="
                text-xs
                font-semibold
              "
            >
              Belum ada percakapan
            </p>

            <p
              className="
                mt-1
                max-w-xs
                text-[9px]
                leading-4
                text-gray-400
              "
            >
              Mulai diskusi dengan siswa
              mengenai kebutuhan proyek.
            </p>
          </div>

        )}

      </div>


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


      {/* INPUT */}

      {canSend ? (

        <form
          onSubmit={
            handleSend
          }

          className="
            mt-3

            flex
            items-end
            gap-2

            rounded-[20px]

            bg-white

            p-2
          "
        >

          <textarea
            rows={1}

            maxLength={2000}

            value={message}

            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }

            onKeyDown={(event) => {
              if (
                event.key ===
                  'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault()

                handleSend(
                  event
                )
              }
            }}

            placeholder="Tulis pesan..."

            className="
              min-h-11
              max-h-28
              min-w-0
              flex-1

              resize-none

              rounded-2xl

              border-0

              bg-gray-50

              px-4
              py-3

              text-[10px]

              outline-none
            "
          />


          <button
            type="submit"

            disabled={
              sending ||
              !message.trim()
            }

            className="
              flex
              h-11
              w-11
              shrink-0

              items-center
              justify-center

              rounded-2xl

              bg-tumbuh-green

              text-white

              disabled:opacity-40
            "
          >
            <Send size={16} />
          </button>

        </form>

      ) : (

        <div
          className="
            mt-3

            rounded-[20px]

            bg-gray-100

            px-4
            py-4

            text-center
          "
        >
          <p
            className="
              text-[9px]
              text-gray-500
            "
          >
            Percakapan proyek ini
            sudah dalam mode baca saja.
          </p>
        </div>

      )}

    </div>
  )
}


function MessageBubble({
  message,
  mine,
}) {
  const sender =
    message.sender ?? {}


  return (
    <div
      className={`
        flex

        ${
          mine
            ? 'justify-end'
            : 'justify-start'
        }
      `}
    >

      <div
        className={`
          max-w-[82%]

          rounded-[20px]

          px-4
          py-3

          ${
            mine
              ? `
                rounded-br-md

                bg-tumbuh-green

                text-white
              `
              : `
                rounded-bl-md

                bg-gray-100

                text-gray-700
              `
          }
        `}
      >

        {!mine && (
          <p
            className="
              mb-1
              text-[8px]
              font-semibold
              opacity-70
            "
          >
            {sender.name ??
              'Siswa'}
          </p>
        )}


        <p
          className="
            whitespace-pre-wrap
            break-words

            text-[10px]
            leading-4
          "
        >
          {message.isi_pesan}
        </p>


        <p
          className={`
            mt-1
            text-right
            text-[7px]

            ${
              mine
                ? 'text-white/70'
                : 'text-gray-400'
            }
          `}
        >
          {formatMessageTime(
            message.created_at
          )}
        </p>

      </div>

    </div>
  )
}