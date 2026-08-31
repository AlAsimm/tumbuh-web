import {
  Send,
  UserRound,
  Wifi,
} from 'lucide-react'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'


function unwrapMessages(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.messages)) {
    return data.messages
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}


function formatMessageTime(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(new Date(date))
}


export default function ProjectChatTab({
  projectId,
  projectStatus,
}) {
  const { user } = useAuth()

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

  const bottomRef = useRef(null)


  const allowedSendStatuses = [
    'in_progress',
    'teacher_review',
    'umkm_review',
    'mediation',
  ]

  const canSend =
    allowedSendStatuses.includes(
      projectStatus
    )


  const loadMessages = async ({
    silent = false,
  } = {}) => {
    if (!silent) {
      setLoading(true)
    }

    try {
      const response =
        await api.get(
          `/projects/${projectId}/messages`
        )

      setMessages(
        unwrapMessages(
          response.data
        )
      )

      setError('')

    } catch (err) {
      console.error(err)

      if (!silent) {
        setError(
          err.response?.data?.message ??
          'Chat belum dapat dimuat.'
        )
      }

    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }


  useEffect(() => {
    loadMessages()

    const polling =
      setInterval(() => {
        loadMessages({
          silent: true,
        })
      }, 3000)

    return () => {
      clearInterval(polling)
    }
  }, [projectId])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages.length])


  const handleSend = async (event) => {
    event.preventDefault()

    const trimmedMessage =
      message.trim()

    if (
      !trimmedMessage ||
      !canSend ||
      sending
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
              trimmedMessage,
          }
        )

      const newMessage =
        response.data?.data

      setMessage('')

      if (newMessage) {
        setMessages(
          (current) => [
            ...current,
            newMessage,
          ]
        )
      } else {
        await loadMessages({
          silent: true,
        })
      }

    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ??
        'Pesan belum berhasil dikirim.'
      )

    } finally {
      setSending(false)
    }
  }


  if (loading) {
    return (
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
            text-sm
            font-medium
            text-tumbuh-green-dark
          "
        >
          Memuat percakapan...
        </p>
      </div>
    )
  }


  return (
    <section className="mt-5">

{/* TRANSPARENCY NOTICE */}

<div
  className="
    mb-5
    flex
    items-start
    gap-3

    rounded-[20px]

    border
    border-tumbuh-green-dark

    bg-[#B8F0CE]

    px-4
    py-4
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

      text-tumbuh-green-dark
    "
  >
    <UserRound
      size={25}
      strokeWidth={2.2}
    />
  </div>

  <div>
    <h3
      className="
        text-[13px]
        font-semibold
        text-tumbuh-green-dark
      "
    >
      Transparansi Untuk Semua
    </h3>

    <p
      className="
        mt-0.5
        text-[10px]
        leading-[15px]
        text-gray-500
      "
    >
      Percakapan dapat dipantau oleh guru
      pembimbing sekolah untuk memastikan
      proyek berjalan baik.
    </p>
  </div>
</div>

      {/* CHAT AREA */}

      <div
        className="
          flex
          min-h-[390px]
          max-h-[520px]
          flex-col

          overflow-y-auto

          rounded-[28px]

          border
          border-gray-100

          bg-white

          px-4
          py-5
        "
      >

        {messages.length === 0 ? (

          <div
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <img
              src="/assets/logo-tumbuh.png"
              alt=""
              className="
                h-14
                w-14
                object-contain
                opacity-70
              "
            />

            <h3
              className="
                mt-4
                text-sm
                font-semibold
              "
            >
              Belum ada percakapan
            </h3>

            <p
              className="
                mt-1
                max-w-[240px]
                text-[10px]
                leading-4
                text-gray-400
              "
            >
              Gunakan chat untuk
              mendiskusikan kebutuhan,
              revisi, atau progres proyek.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {messages.map(
              (chat) => {

                const isMe =
                  Number(
                    chat.sender_id
                  ) ===
                  Number(user?.id)


                return (
                  <MessageBubble
                    key={chat.id}

                    message={chat}

                    isMe={isMe}
                  />
                )
              }
            )}

            <div ref={bottomRef} />

          </div>

        )}

      </div>


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-3
            rounded-2xl
            bg-red-50
            px-4
            py-3
            text-xs
            text-red-600
          "
        >
          {error}
        </div>
      )}


      {/* INPUT */}

      {canSend ? (

        <form
          onSubmit={handleSend}

          className="
            mt-4
            flex
            items-end
            gap-2
          "
        >

          <textarea
            value={message}

            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }

            rows={1}

            maxLength={2000}

            placeholder="Tulis pesan..."

            className="
              min-h-12
              max-h-32
              flex-1
              resize-none

              rounded-[22px]

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


          <button
            type="submit"

            disabled={
              !message.trim() ||
              sending
            }

            className="
              flex
              h-12
              w-12
              shrink-0

              items-center
              justify-center

              rounded-full

              bg-tumbuh-green

              text-white

              shadow-[0_6px_18px_rgba(108,216,135,0.30)]

              transition

              active:scale-95

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Send size={18} />
          </button>

        </form>

      ) : (

        <div
          className="
            mt-4

            rounded-2xl

            bg-gray-100

            px-4
            py-3

            text-center
            text-[10px]
            leading-4
            text-gray-500
          "
        >
          Percakapan proyek ini sudah
          ditutup. Riwayat pesan tetap
          dapat dilihat.
        </div>

      )}

    </section>
  )
}


function MessageBubble({
  message,
  isMe,
}) {
  const senderName =
    message.sender?.name ??
    'Pengguna TUMBUH'

  const senderRole =
    message.sender?.role


  return (
    <div
      className={`
        flex
        ${isMe
          ? 'justify-end'
          : 'justify-start'
        }
      `}
    >

      <div
        className={`
          max-w-[82%]

          ${
            isMe
              ? 'items-end'
              : 'items-start'
          }
        `}
      >

        {!isMe && (
          <div
            className="
              mb-1
              flex
              items-center
              gap-2
              px-1
            "
          >

            <span
              className="
                text-[9px]
                font-semibold
                text-gray-500
              "
            >
              {senderName}
            </span>

            {senderRole && (
              <span
                className="
                  rounded-full
                  bg-gray-100
                  px-2
                  py-0.5
                  text-[7px]
                  uppercase
                  text-gray-400
                "
              >
                {senderRole}
              </span>
            )}

          </div>
        )}


        <div
          className={`
            rounded-[20px]
            px-4
            py-3

            ${
              isMe
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

          <p
            className="
              whitespace-pre-wrap
              break-words
              text-[11px]
              leading-5
            "
          >
            {message.isi_pesan}
          </p>

        </div>


        <p
          className={`
            mt-1
            px-1
            text-[8px]
            text-gray-400

            ${
              isMe
                ? 'text-right'
                : 'text-left'
            }
          `}
        >
          {isMe && 'Anda · '}

          {formatMessageTime(
            message.created_at
          )}
        </p>

      </div>

    </div>
  )
}