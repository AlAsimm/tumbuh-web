export default function UmkmStatCard({
  label,
  value,
  subLabel,
  subColor = 'text-blue-500',
}) {
  return (
    <div
      className="
        flex
        min-h-[96px]
        flex-col
        items-center
        justify-center

        rounded-[26px]

        bg-white

        px-3
        py-4

        text-center

        shadow-[0_10px_30px_rgba(0,0,0,0.018)]
      "
    >

      <p
        className="
          text-[9px]
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </p>


      <strong
        className="
          mt-2
          text-xl
          font-semibold
          text-gray-900
        "
      >
        {value}
      </strong>


      <span
        className={`
          mt-1
          text-[8px]
          font-semibold
          ${subColor}
        `}
      >
        {subLabel}
      </span>

    </div>
  )
}