import {
  ChevronRight,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'


export default function ProfileMenuItem({
  icon: Icon,
  title,
  description,
  to,
  onClick,
  badge,
  danger = false,
}) {
  const content = (
    <>
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl

          ${
            danger
              ? 'bg-red-50 text-red-500'
              : 'bg-green-50 text-tumbuh-green-dark'
          }
        `}
      >
        <Icon size={18} />
      </div>


      <div className="min-w-0 flex-1">

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <p
            className={`
              text-xs
              font-semibold

              ${
                danger
                  ? 'text-red-500'
                  : 'text-gray-900'
              }
            `}
          >
            {title}
          </p>


          {badge && (
            <span
              className="
                rounded-full
                bg-gray-100
                px-2
                py-0.5
                text-[7px]
                font-medium
                text-gray-400
              "
            >
              {badge}
            </span>
          )}

        </div>


        {description && (
          <p
            className="
              mt-0.5
              text-[9px]
              leading-4
              text-gray-400
            "
          >
            {description}
          </p>
        )}

      </div>


      {!danger && (
        <ChevronRight
          size={17}
          className="
            shrink-0
            text-gray-300
          "
        />
      )}
    </>
  )


  const classes = `
    flex
    w-full
    items-center
    gap-3
    border-b
    border-gray-100
    px-1
    py-4
    text-left
    last:border-b-0
  `


  if (to) {
    return (
      <Link
        to={to}
        className={classes}
      >
        {content}
      </Link>
    )
  }


  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  )
}