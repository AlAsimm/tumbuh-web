import {
  Star,
} from 'lucide-react'


export default function ProjectRatingInput({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>

      <p
        className="
          text-[10px]
          font-semibold
        "
      >
        Rating Hasil Kerja
      </p>


      <p
        className="
          mt-1
          text-[8px]
          text-gray-400
        "
      >
        Berikan penilaian untuk hasil
        kerja siswa.
      </p>


      <div
        className="
          mt-3
          flex
          gap-2
        "
      >

        {[
          1,
          2,
          3,
          4,
          5,
        ].map((rating) => {

          const active =
            rating <= value


          return (
            <button
              key={rating}

              type="button"

              disabled={disabled}

              onClick={() =>
                onChange(rating)
              }

              className="
                transition

                active:scale-90

                disabled:cursor-not-allowed
              "
            >
              <Star
                size={28}

                className={
                  active
                    ? `
                      fill-yellow-400
                      text-yellow-400
                    `
                    : `
                      text-gray-200
                    `
                }
              />
            </button>
          )
        })}

      </div>


      {value > 0 && (
        <p
          className="
            mt-2

            text-[9px]
            font-medium
            text-gray-500
          "
        >
          {value} dari 5
        </p>
      )}

    </div>
  )
}