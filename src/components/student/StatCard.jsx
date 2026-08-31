export default function StatCard({
  label,
  value,
  caption,
  accent = 'green',
}) {
  const accentClass = {
    green: 'text-tumbuh-green-dark',
    blue: 'text-blue-500',
    dark: 'text-gray-900',
  }

  return (
    <article
      className="
        flex
        min-h-[96px]
        flex-col
        items-center
        justify-center
        rounded-[26px]
        bg-white
        px-2
        py-4
        text-center
        shadow-[0_8px_30px_rgba(0,0,0,0.025)]
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </span>

      <strong
        className={`
          mt-2
          text-xl
          font-bold
          ${accentClass[accent]}
        `}
      >
        {value}
      </strong>

      <span
        className="
          mt-1
          text-[10px]
          font-medium
          text-tumbuh-green-dark
        "
      >
        {caption}
      </span>
    </article>
  )
}