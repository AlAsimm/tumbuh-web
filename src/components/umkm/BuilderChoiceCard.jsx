export default function BuilderChoiceCard({
  icon: Icon,
  title,
  description,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-start
        gap-3

        rounded-[20px]

        border-2

        px-4
        py-4

        text-left

        transition

        ${
          active
            ? `
              border-tumbuh-green
              bg-green-50
            `
            : `
              border-gray-100
              bg-white

              hover:border-green-200
            `
        }
      `}
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

          ${
            active
              ? `
                bg-tumbuh-green
                text-white
              `
              : `
                bg-gray-100
                text-gray-500
              `
          }
        `}
      >
        <Icon size={18} />
      </div>

      <div>
        <h3
          className="
            text-xs
            font-semibold
          "
        >
          {title}
        </h3>

        {description && (
          <p
            className="
              mt-1
              text-[9px]
              leading-4
              text-gray-400
            "
          >
            {description}
          </p>
        )}
      </div>
    </button>
  )
}