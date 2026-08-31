import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Edit3,
  LogOut,
  MapPin,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import api from '../../lib/api'

import {
  useAuth,
} from '../../context/AuthContext'

import UmkmAppShell
  from '../../components/umkm/UmkmAppShell'


export default function UmkmProfilePage() {
  const navigate =
    useNavigate()

  const {
    user,
    loadUser,
    logout,
  } = useAuth()


  const profile =
    user?.umkm_profile ??
    user?.umkmProfile ??
    {}


  const [
    editing,
    setEditing,
  ] = useState(false)

  const [
    form,
    setForm,
  ] = useState({
    name:
      user?.name ?? '',

    nama_toko:
      profile.nama_toko ?? '',

    sektor_usaha:
      profile.sektor_usaha ?? '',

    alamat:
      profile.alamat ?? '',

    nib:
      profile.nib ?? '',
  })

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')


  const updateField = (
    field,
    value
  ) => {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }


  const openEdit = () => {
    setForm({
      name:
        user?.name ?? '',

      nama_toko:
        profile.nama_toko ?? '',

      sektor_usaha:
        profile.sektor_usaha ?? '',

      alamat:
        profile.alamat ?? '',

      nib:
        profile.nib ?? '',
    })

    setError('')
    setSuccess('')
    setEditing(true)
  }


  const saveProfile =
    async (event) => {

      event.preventDefault()

      setSaving(true)
      setError('')
      setSuccess('')


      try {
        await api.patch(
          '/umkm/profile',
          {
            name:
              form.name.trim(),

            nama_toko:
              form.nama_toko.trim(),

            sektor_usaha:
              form.sektor_usaha.trim(),

            alamat:
              form.alamat.trim() ||
              null,

            nib:
              form.nib.trim() ||
              null,
          }
        )


        await loadUser()


        setSuccess(
          'Profil berhasil diperbarui.'
        )

        setEditing(false)

      } catch (err) {
        console.error(err)


        const validationErrors =
          err.response
            ?.data
            ?.errors


        if (validationErrors) {
          setError(
            Object.values(
              validationErrors
            )
              .flat()
              .at(0) ??
            'Data profil tidak valid.'
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


  const handleLogout =
    async () => {

      try {
        await logout()

      } finally {
        navigate(
          '/login',
          {
            replace: true,
          }
        )
      }
    }


  const displayName =
    profile.nama_toko ??
    user?.name ??
    'UMKM TUMBUH'


  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map(
        (part) =>
          part.charAt(0)
      )
      .slice(0, 2)
      .join('')
      .toUpperCase()


  return (
    <UmkmAppShell>

      {/* HEADER */}

      <header>

        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-widest
            text-green-600
          "
        >
          Akun Bisnis
        </p>


        <h1
          className="
            mt-1

            text-[27px]
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

          bg-[#67D987]

          p-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
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

              rounded-full

              bg-white

              text-lg
              font-semibold
              text-green-700
            "
          >
            {initials}
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >

            <p
              className="
                truncate
                text-base
                font-semibold
                text-green-950
              "
            >
              {profile.nama_toko ??
                'Nama usaha belum diisi'}
            </p>


            <p
              className="
                mt-1
                truncate
                text-[9px]
                text-green-950/60
              "
            >
              {user?.name ??
                'Pemilik UMKM'}
            </p>


            {profile.sektor_usaha && (
              <span
                className="
                  mt-2
                  inline-flex

                  rounded-full

                  bg-white/70

                  px-3
                  py-1

                  text-[8px]
                  font-semibold
                  text-green-800
                "
              >
                {
                  profile.sektor_usaha
                }
              </span>
            )}

          </div>


          <button
            type="button"

            onClick={
              openEdit
            }

            className="
              flex
              h-10
              w-10
              shrink-0

              items-center
              justify-center

              rounded-full

              bg-white/70

              text-green-900
            "
          >
            <Edit3 size={16} />
          </button>

        </div>

      </section>


      {/* SUCCESS */}

      {success && (
        <div
          className="
            mt-4

            rounded-2xl

            bg-green-50

            px-4
            py-3

            text-[9px]
            text-green-700
          "
        >
          {success}
        </div>
      )}


      {/* BUSINESS INFO */}

      <section
        className="
          mt-5

          rounded-[26px]

          bg-white

          p-5
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Informasi Bisnis
        </h2>


        <div
          className="
            mt-5
            space-y-4
          "
        >

          <ProfileInfo
            icon={Store}
            label="Nama Usaha"
            value={
              profile.nama_toko
            }
          />


          <ProfileInfo
            icon={
              BriefcaseBusiness
            }
            label="Sektor Usaha"
            value={
              profile.sektor_usaha
            }
          />


          <ProfileInfo
            icon={MapPin}
            label="Alamat"
            value={
              profile.alamat
            }
          />


          <ProfileInfo
            icon={ShieldCheck}
            label="NIB"
            value={
              profile.nib
            }
          />

        </div>

      </section>


      {/* OWNER */}

      <section
        className="
          mt-4

          rounded-[26px]

          bg-white

          p-5
        "
      >

        <h2
          className="
            text-sm
            font-semibold
          "
        >
          Pemilik Akun
        </h2>


        <div
          className="
            mt-4

            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10

              items-center
              justify-center

              rounded-full

              bg-green-100

              text-green-700
            "
          >
            <UserRound
              size={17}
            />
          </div>


          <div>
            <p
              className="
                text-[10px]
                font-semibold
              "
            >
              {user?.name}
            </p>

            <p
              className="
                mt-1
                text-[8px]
                text-gray-400
              "
            >
              Akun UMKM TUMBUH
            </p>
          </div>

        </div>

      </section>


      {/* MENU */}

      <section
        className="
          mt-4

          overflow-hidden

          rounded-[26px]

          bg-white
        "
      >

        <ProfileMenu
          icon={Building2}
          title="Proyek Saya"
          description=
            "Kelola seluruh proyek bisnis."
          onClick={() =>
            navigate(
              '/umkm/projects'
            )
          }
        />


        <ProfileMenu
          icon={
            BriefcaseBusiness
          }
          title="Imagine"
          description=
            "Bangun proyek baru dengan AI."
          onClick={() =>
            navigate(
              '/umkm/project-builder'
            )
          }
        />

      </section>


      {/* LOGOUT */}

      <button
        type="button"

        onClick={
          handleLogout
        }

        className="
          mt-5

          flex
          h-12
          w-full

          items-center
          justify-center
          gap-2

          rounded-2xl

          border
          border-red-100

          bg-red-50

          text-[10px]
          font-semibold
          text-red-600
        "
      >
        <LogOut size={15} />

        Keluar dari Akun
      </button>


      {/* EDIT MODAL */}

      {editing && (
        <EditProfileModal
          form={form}

          saving={saving}

          error={error}

          onChange={
            updateField
          }

          onSubmit={
            saveProfile
          }

          onClose={() => {
            if (!saving) {
              setEditing(false)
            }
          }}
        />
      )}

    </UmkmAppShell>
  )
}


function ProfileInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0

          items-center
          justify-center

          rounded-xl

          bg-gray-50

          text-green-700
        "
      >
        <Icon size={15} />
      </div>


      <div className="min-w-0">

        <p
          className="
            text-[8px]
            text-gray-400
          "
        >
          {label}
        </p>


        <p
          className="
            mt-1
            break-words

            text-[10px]
            font-medium
            text-gray-700
          "
        >
          {value ||
            'Belum diisi'}
        </p>

      </div>

    </div>
  )
}


function ProfileMenu({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"

      onClick={
        onClick
      }

      className="
        flex
        w-full

        items-center
        gap-3

        border-b
        border-gray-100

        px-5
        py-4

        text-left

        last:border-b-0
      "
    >

      <div
        className="
          flex
          h-9
          w-9

          items-center
          justify-center

          rounded-xl

          bg-green-50

          text-green-700
        "
      >
        <Icon size={15} />
      </div>


      <div className="flex-1">

        <p
          className="
            text-[10px]
            font-semibold
          "
        >
          {title}
        </p>


        <p
          className="
            mt-1
            text-[8px]
            text-gray-400
          "
        >
          {description}
        </p>

      </div>


      <ArrowRight
        size={14}
        className="
          text-gray-300
        "
      />

    </button>
  )

  function EditProfileModal({
  form,
  saving,
  error,
  onChange,
  onSubmit,
  onClose,
}) {
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

      <form
        onSubmit={
          onSubmit
        }

        className="
          relative

          max-h-[90vh]
          w-full
          max-w-[430px]

          overflow-y-auto

          rounded-t-[32px]

          bg-white

          px-6
          pb-8
          pt-6

          sm:rounded-[32px]
        "
      >

        <button
          type="button"

          disabled={saving}

          onClick={
            onClose
          }

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


        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-widest
            text-green-600
          "
        >
          Edit Profile
        </p>


        <h2
          className="
            mt-1
            text-xl
            font-semibold
          "
        >
          Informasi UMKM
        </h2>


        <div
          className="
            mt-6
            space-y-4
          "
        >

          <ProfileInput
            label="Nama Pemilik"
            value={
              form.name
            }
            required
            disabled={
              saving
            }
            onChange={(value) =>
              onChange(
                'name',
                value
              )
            }
          />


          <ProfileInput
            label="Nama Usaha"
            value={
              form.nama_toko
            }
            required
            disabled={
              saving
            }
            onChange={(value) =>
              onChange(
                'nama_toko',
                value
              )
            }
          />


          <ProfileInput
            label="Sektor Usaha"
            value={
              form.sektor_usaha
            }
            required
            disabled={
              saving
            }
            placeholder=
              "Contoh: Kuliner"
            onChange={(value) =>
              onChange(
                'sektor_usaha',
                value
              )
            }
          />


          <div>

            <label
              htmlFor="umkm-address"

              className="
                text-[9px]
                font-semibold
              "
            >
              Alamat
            </label>


            <textarea
              id="umkm-address"

              rows={3}

              maxLength={500}

              value={
                form.alamat
              }

              disabled={
                saving
              }

              onChange={(event) =>
                onChange(
                  'alamat',
                  event.target.value
                )
              }

              className="
                mt-2
                w-full
                resize-none

                rounded-[18px]

                border
                border-gray-200

                px-4
                py-3

                text-[10px]

                outline-none

                focus:border-tumbuh-green
                focus:ring-4
                focus:ring-green-100
              "
            />

          </div>


          <ProfileInput
            label="NIB"
            value={
              form.nib
            }
            disabled={
              saving
            }
            placeholder=
              "Nomor Induk Berusaha"
            onChange={(value) =>
              onChange(
                'nib',
                value
              )
            }
          />

        </div>


        {error && (
          <div
            className="
              mt-4

              rounded-2xl

              bg-red-50

              px-4
              py-3

              text-[9px]
              text-red-600
            "
          >
            {error}
          </div>
        )}


        <button
          type="submit"

          disabled={
            saving
          }

          className="
            mt-6

            h-12
            w-full

            rounded-2xl

            bg-tumbuh-green

            text-[10px]
            font-semibold
            text-white

            disabled:opacity-50
          "
        >
          {saving
            ? 'Menyimpan...'
            : 'Simpan Perubahan'}
        </button>

      </form>

    </div>
  )
}


function ProfileInput({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
}) {
  return (
    <div>

      <label
        className="
          text-[9px]
          font-semibold
        "
      >
        {label}
      </label>


      <input
        type="text"

        required={
          required
        }

        disabled={
          disabled
        }

        value={
          value
        }

        placeholder={
          placeholder
        }

        onChange={(event) =>
          onChange(
            event.target.value
          )
        }

        className="
          mt-2

          h-12
          w-full

          rounded-[18px]

          border
          border-gray-200

          px-4

          text-[10px]

          outline-none

          focus:border-tumbuh-green
          focus:ring-4
          focus:ring-green-100

          disabled:bg-gray-50
        "
      />

    </div>
  )
}
}