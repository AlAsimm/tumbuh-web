export default function BuilderProgress({
  currentStep,
  totalSteps = 3,
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({
        length: totalSteps,
      }).map((_, index) => {
        const step =
          index + 1

        const active =
          step <= currentStep

        return (
          <div
            key={step}
            className={`
              h-1.5
              flex-1
              rounded-full
              transition-all

              ${
                active
                  ? 'bg-tumbuh-green'
                  : 'bg-gray-200'
              }
            `}
          />
        )
      })}
    </div>
  )
}