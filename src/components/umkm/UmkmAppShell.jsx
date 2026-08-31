import UmkmBottomNav
  from './UmkmBottomNav'


export default function UmkmAppShell({
  children,
}) {
  return (
    <div
      className="
        min-h-screen

        bg-gradient-to-b
        from-white
        via-[#F2FFFF]
        to-[#E4FFFF]
      "
    >

      <main
        className="
          mx-auto
          w-full

          max-w-[430px]

          px-5
          pb-32
          pt-8

          md:max-w-4xl
          md:px-8
        "
      >
        {children}
      </main>


      <UmkmBottomNav />

    </div>
  )
}