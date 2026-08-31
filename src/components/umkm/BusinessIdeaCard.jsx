import {
  ArrowRight,
  BarChart3,
  Code2,
  Palette,
} from 'lucide-react'


const icons = {
  content: BarChart3,
  website: Code2,
  design: Palette,
}


export default function BusinessIdeaCard({
  type = 'content',
  title,
  description,
  onClick,
}) {
  const Icon =
    icons[type] ??
    BarChart3


  return (
    <button
      type="button"

      onClick={onClick}

      className="
        flex
        w-full

        items-center
        gap-3

        rounded-[18px]

        border-2
        border-purple-100

        bg-white

        p-2

        text-left

        transition

        hover:border-green-200
        hover:shadow-sm
      "
    >

      <div
        className="
          flex
          h-16
          w-16
          shrink-0

          items-center
          justify-center

          rounded-[18px]

          bg-tumbuh-green

          text-white
        "
      >
        <Icon size={27} />
      </div>


      <div className="min-w-0 flex-1">

        <h3
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h3>


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

      </div>


      <ArrowRight
        size={18}

        className="
          mr-3
          shrink-0
          text-tumbuh-green
        "
      />

    </button>
  )
}