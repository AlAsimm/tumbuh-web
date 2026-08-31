import StudentBottomNav from './StudentBottomNav'

export default function StudentAppShell({
  children,
}) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-tumbuh-bg
        to-cyan-50
      "
    >
      <div
        className="
          mx-auto
          min-h-screen
          w-full
          max-w-[430px]
          px-5
          pb-28
          pt-8

          md:max-w-4xl
          md:px-8
        "
      >
        {children}
      </div>

      <StudentBottomNav />
    </div>
  )
}