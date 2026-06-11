export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ar', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatRole(role) {
  const roles = {
    customer: 'عميل',
    worker: 'كابتن',
    admin: 'أدمن',
  };

  return roles[role] ?? role ?? '—';
}

export function formatStatus(status) {
  const statuses = {
    pending: 'قيد الانتظار',
    accepted: 'تم القبول',
    in_transit: 'قيد التوصيل',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  };

  return statuses[status] ?? status ?? '—';
}

export function truncateId(value, size = 8) {
  if (!value) return '—';
  return value.slice(0, size);
}
