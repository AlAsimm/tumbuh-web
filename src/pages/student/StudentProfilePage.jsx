import {
  BadgeCheck,
  Bell,
  BookOpen,
  CircleHelp,
  Edit3,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'

import {
  useState,
} from 'react'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'

import StudentAppShell
  from '../../components/student/StudentAppShell'

import ProfileMenuItem
  from '../../components/student/ProfileMenuItem'


export default function StudentProfilePage() {
  const {
    user,
    logout,
    loadUser,
  } = useAuth()


  const [
    showEdit,
    setShowEdit,
  ] = useState(false)


  const profile =
    user?.smk_profile ??
    user?.smkProfile ??
    {}


  const name =
    user?.name ??
    'Siswa TUMBUH'


  const initials =
    name
      .split(' ')
      .map((part) =>
        part.charAt(0)
      )
      .slice(0, 2)
      .join('')
      .toUpperCase()


  const handleLogout =
    async () => {

      await logout()

      /*
       * AuthContext akan mengubah
       * user menjadi null.
       *
       * ProtectedRoute kemudian
       * mengarahkan ke /login.
       */
    }


  return (
    <StudentAppShell>

      {/* TITLE */}

      <header>

        <h1
          className="
            text-[28px]
            font-semibold
            tracking-tight
          "
        >
          Profile
        </h1>

      </header>


      {/* PROFILE CARD */}

      <section
        className="
          mt-6

          rounded-[30px]

          bg-white

          px-5
          py-6

          shadow-[0_10px_35px_rgba(0,0,0,0.035)]
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >

          {/* AVATAR */}

          <div className="relative">

            <div
              className="
                flex
                h-24
                w-24

                items-center
                justify-center

                rounded-full

                bg-gradient-to-br
                from-blue-100
                to-cyan-100

                text-2xl
                font-semibold
                text-blue-600
              "
            >
              {initials}
            </div>


            <div
              className="
                absolute
                bottom-0
                right-0

                flex
                h-8
                w-8

                items-center
                justify-center

                rounded-full

                border-4
                border-white

                bg-tumbuh-green

                text-white
              "
            >
              <BadgeCheck
                size={15}
              />
            </div>

          </div>


          {/* NAME */}

          <h2
            className="
              mt-4
              text-xl
              font-semibold
            "
          >
            {name}
          </h2>


          <p
            className="
              mt-1
              text-[10px]
              text-gray-400
            "
          >
            {profile.nama_sekolah ??
              'Sekolah belum diisi'}
          </p>


          <div
            className="
              mt-3
              flex
              flex-wrap
              justify-center
              gap-2
            "
          >

            {profile.jurusan && (
              <span
                className="
                  rounded-full
                  bg-cyan-100
                  px-3
                  py-1.5

                  text-[9px]
                  font-medium
                  text-blue-500
                "
              >
                {profile.jurusan}
              </span>
            )}


            {profile.tingkat_kelas && (
              <span
                className="
                  rounded-full
                  bg-purple-100
                  px-3
                  py-1.5

                  text-[9px]
                  font-medium
                  text-purple-600
                "
              >
                Kelas {
                  profile.tingkat_kelas
                }
              </span>
            )}

          </div>


          {/* EDIT */}

          <button
            type="button"

            onClick={() =>
              setShowEdit(true)
            }

            className="
              mt-5

              flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-full

              border
              border-gray-200

              px-5

              text-[10px]
              font-semibold

              transition

              hover:bg-gray-50
            "
          >
            <Edit3 size={14} />

            Edit Profile
          </button>

        </div>

      </section>


      {/* ACCOUNT */}

      <section className="mt-8">

        <p
          className="
            mb-2
            px-1

            text-[9px]
            font-semibold
            uppercase
            tracking-widest
            text-gray-400
          "
        >
          Account
        </p>


        <div
          className="
            rounded-[24px]

            bg-white

            px-4
          "
        >

          <ProfileMenuItem
            icon={BadgeCheck}

            title="Portofolio Digital"

            description="Lihat proyek dan QR terverifikasi."

            to="/student/portfolio"
          />


          <ProfileMenuItem
            icon={UserRound}

            title="Personal Information"

            description="Nama, sekolah, jurusan, dan kelas."

            onClick={() =>
              setShowEdit(true)
            }
          />


          <ProfileMenuItem
            icon={Bell}

            title="Notifications"

            description="Atur preferensi notifikasi TUMBUH."

            badge="Segera"
          />

        </div>

      </section>


      {/* SECURITY */}

      <section className="mt-7">

        <p
          className="
            mb-2
            px-1

            text-[9px]
            font-semibold
            uppercase
            tracking-widest
            text-gray-400
          "
        >
          Security & Device
        </p>


        <div
          className="
            rounded-[24px]

            bg-white

            px-4
          "
        >

          <ProfileMenuItem
            icon={MonitorSmartphone}

            title="Connected Devices"

            description="Kelola perangkat yang terhubung."

            badge="Segera"
          />


          <ProfileMenuItem
            icon={ShieldCheck}

            title="Privacy & Security"

            description="Keamanan akun dan privasi data."

            badge="Segera"
          />

        </div>

      </section>


      {/* HELP */}

      <section className="mt-7">

        <p
          className="
            mb-2
            px-1

            text-[9px]
            font-semibold
            uppercase
            tracking-widest
            text-gray-400
          "
        >
          Support
        </p>


        <div
          className="
            rounded-[24px]

            bg-white

            px-4
          "
        >

          <ProfileMenuItem
            icon={CircleHelp}

            title="Help & FAQ"

            description="Cari bantuan menggunakan TUMBUH."

            badge="Segera"
          />


          <ProfileMenuItem
            icon={BookOpen}

            title="Tentang TUMBUH"

            description="Platform micro-internship siswa dan UMKM."

            badge="v1.0"
          />

        </div>

      </section>


      {/* LOGOUT */}

      <section
        className="
          mt-7

          rounded-[24px]

          bg-white

          px-4
        "
      >

        <ProfileMenuItem
          icon={LogOut}

          title="Keluar"

          description="Keluar dari akun TUMBUH."

          danger

          onClick={handleLogout}
        />

      </section>


      <p
        className="
          mt-8
          text-center
          text-[8px]
          text-gray-300
        "
      >
        TUMBUH · Build experience,
        grow together.
      </p>


      {/* EDIT MODAL */}

      {showEdit && (
        <EditProfileModal
          user={user}

          onClose={() =>
            setShowEdit(false)
          }

          onUpdated={async () => {
            await loadUser()

            setShowEdit(false)
          }}
        />
      )}

      

    </StudentAppShell>
  )
  function EditProfileModal({
  user,
  onClose,
  onUpdated,
}) {
  const profile =
    user?.smk_profile ??
    user?.smkProfile ??
    {}


  const [
    form,
    setForm,
  ] = useState({
    name:
      user?.name ?? '',

    nisn:
      profile.nisn ?? '',

    nama_sekolah:
      profile.nama_sekolah ?? '',

    jurusan:
      profile.jurusan ?? '',

    tingkat_kelas:
      profile.tingkat_kelas ?? '',
  })


  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  const updateField =
    (field, value) => {

      setForm((current) => ({
        ...current,
        [field]: value,
      }))
    }


  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setSaving(true)
      setError('')


      try {
        await api.patch(
          '/student/profile',
          form
        )

        await onUpdated()

      } catch (err) {
        console.error(err)


        const validationErrors =
          err.response?.data?.errors


        if (validationErrors) {
          setError(
            Object.values(
              validationErrors
            )
              .flat()
              .at(0) ??
            'Data tidak valid.'
          )

        } else {
          setError(
            err.response
              ?.data
              ?.message ??
            'Profil belum berhasil diperbarui.'
          )
        }

      } finally {
        setSaving(false)
      }
    }


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-end
        justify-center

        bg-black/40

        backdrop-blur-sm

        sm:items-center
        sm:p-6
      "
    >

      <div
        className="
          relative

          max-h-[90vh]

          w-full
          max-w-[460px]

          overflow-y-auto

          rounded-t-[32px]

          bg-white

          px-6
          pb-8
          pt-6

          sm:rounded-[32px]
        "
      >

        {/* CLOSE */}

        <button
          type="button"

          onClick={onClose}

          className="
            absolute
            right-5
            top-5

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            bg-gray-100

            text-gray-500
          "
        >
          <X size={17} />
        </button>


        <h2
          className="
            text-lg
            font-semibold
          "
        >
          Edit Profile
        </h2>


        <p
          className="
            mt-1
            text-[10px]
            text-gray-400
          "
        >
          Perbarui informasi profil
          siswa TUMBUH.
        </p>


        <form
          onSubmit={handleSubmit}

          className="
            mt-7
            space-y-5
          "
        >

          <ProfileInput
            label="Nama Lengkap"

            value={form.name}

            onChange={(value) =>
              updateField(
                'name',
                value
              )
            }

            required
          />


          <ProfileInput
            label="NISN"

            value={form.nisn}

            onChange={(value) =>
              updateField(
                'nisn',
                value
              )
            }
          />


          <ProfileInput
            label="Sekolah"

            value={
              form.nama_sekolah
            }

            onChange={(value) =>
              updateField(
                'nama_sekolah',
                value
              )
            }

            required
          />


          <ProfileInput
            label="Jurusan"

            value={form.jurusan}

            onChange={(value) =>
              updateField(
                'jurusan',
                value
              )
            }

            placeholder="Contoh: PPLG"

            required
          />


          <ProfileInput
            label="Kelas"

            value={
              form.tingkat_kelas
            }

            onChange={(value) =>
              updateField(
                'tingkat_kelas',
                value
              )
            }

            placeholder="Contoh: 12"
          />


          {error && (
            <div
              className="
                rounded-2xl

                bg-red-50

                px-4
                py-3

                text-[10px]
                leading-4
                text-red-600
              "
            >
              {error}
            </div>
          )}


          <button
            type="submit"

            disabled={saving}

            className="
              flex
              h-14
              w-full
              items-center
              justify-center

              rounded-2xl

              bg-tumbuh-green

              font-semibold
              text-white

              transition

              hover:bg-tumbuh-green-dark

              disabled:opacity-50
            "
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan Perubahan'}
          </button>

        </form>

      </div>

    </div>
  )
}
function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const id =
    label
      .toLowerCase()
      .replaceAll(' ', '-')


  return (
    <div>

      <label
        htmlFor={id}

        className="
          mb-2
          block

          text-[11px]
          font-medium
        "
      >
        {label}
      </label>


      <input
        id={id}

        type="text"

        required={required}

        value={value}

        onChange={(event) =>
          onChange(
            event.target.value
          )
        }

        placeholder={
          placeholder
        }

        className="
          h-12
          w-full

          rounded-2xl

          border
          border-gray-200

          bg-white

          px-4

          text-xs

          outline-none

          transition

          focus:border-tumbuh-green

          focus:ring-4
          focus:ring-tumbuh-green/10
        "
      />

    </div>
  )
}
  
}