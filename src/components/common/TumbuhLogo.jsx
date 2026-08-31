export default function TumbuhLogo({
  showText = true,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: {
      image: 'h-9 w-9',
      text: 'text-lg',
    },

    md: {
      image: 'h-12 w-12',
      text: 'text-2xl',
    },

    lg: {
      image: 'h-16 w-16',
      text: 'text-3xl',
    },
  }

  const currentSize =
    sizes[size] ?? sizes.md

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
    >
      <img
        src="/assets/logo-tumbuh.png"
        alt="Logo TUMBUH"
        className={`
          ${currentSize.image}
          object-contain
        `}
      />

      {showText && (
        <span
          className={`
            ${currentSize.text}
            font-bold
            tracking-tight
            text-tumbuh-green
          `}
        >
          TUMBUH
        </span>
      )}
    </div>
  )
}