export function formatRupiah(value = 0) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatCompactRupiah(value = 0) {
  const number = Number(value) || 0

  if (number >= 1_000_000) {
    return `${(number / 1_000_000)
      .toFixed(1)
      .replace('.0', '')}jt`
  }

  if (number >= 1_000) {
    return `${Math.round(number / 1_000)}rb`
  }

  return `${number}`
}

export function projectProgress(status) {
  const progress = {
    draft: 0,
    open: 10,
    in_progress: 50,
    teacher_review: 75,
    umkm_review: 90,
    mediation: 90,
    completed: 100,
    cancelled: 0,
  }

  return progress[status] ?? 0
}

export function projectStatusLabel(status) {
  const labels = {
    draft: 'Draft',
    open: 'Mencari siswa',
    in_progress: 'Tahap pengerjaan',
    teacher_review: 'Menunggu approval guru',
    umkm_review: 'Menunggu approval UMKM',
    mediation: 'Tahap mediasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return labels[status] ?? status
}

export function formatDate(date) {
  if (!date) return null

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function daysUntil(date) {
  if (!date) return null

  const today = new Date()
  const deadline = new Date(date)

  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)

  const difference =
    deadline.getTime() - today.getTime()

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  )
}

export function applicationStatusLabel(status) {
  const labels = {
    diajukan: 'Pending',
    dipilih: 'Diterima',
    ditolak: 'Ditolak',
  }

  return labels[status] ?? status
}

export function projectStage(status) {
  if (
    ['in_progress'].includes(status)
  ) {
    return 'active'
  }

  if (
    [
      'teacher_review',
      'umkm_review',
      'mediation',
    ].includes(status)
  ) {
    return 'review'
  }

  if (status === 'completed') {
    return 'completed'
  }

  return 'other'
}

export function umkmProjectStage(status) {
  if (status === 'draft') {
    return 'draft'
  }

  if (status === 'open') {
    return 'open'
  }

  if (status === 'in_progress') {
    return 'active'
  }

  if (
    [
      'teacher_review',
      'umkm_review',
      'mediation',
    ].includes(status)
  ) {
    return 'review'
  }

  if (status === 'completed') {
    return 'completed'
  }

  return 'other'
}


export function umkmProjectStatusMeta(status) {
  const meta = {
    draft: {
      label: 'Draft',
      className:
        'bg-gray-100 text-gray-600',
    },

    open: {
      label: 'Mencari Siswa',
      className:
        'bg-blue-100 text-blue-600',
    },

    in_progress: {
      label: 'Berjalan',
      className:
        'bg-green-100 text-green-700',
    },

    teacher_review: {
      label: 'Validasi Guru',
      className:
        'bg-purple-100 text-purple-600',
    },

    umkm_review: {
      label: 'Review Anda',
      className:
        'bg-orange-100 text-orange-600',
    },

    mediation: {
      label: 'Mediasi',
      className:
        'bg-red-100 text-red-600',
    },

    completed: {
      label: 'Selesai',
      className:
        'bg-green-100 text-green-700',
    },

    cancelled: {
      label: 'Dibatalkan',
      className:
        'bg-gray-100 text-gray-500',
    },
  }

  return (
    meta[status] ?? {
      label: status,
      className:
        'bg-gray-100 text-gray-500',
    }
  )
}