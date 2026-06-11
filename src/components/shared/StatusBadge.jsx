const statusLabels = {
  pending: { label: 'قيد الانتظار', className: 'text-warning' },
  accepted: { label: 'تم القبول', className: 'text-success' },
  in_transit: { label: 'قيد التوصيل', className: 'text-success' },
  delivered: { label: 'تم التسليم', className: 'text-success' },
  cancelled: { label: 'ملغي', className: 'text-danger' },
};

export default function StatusBadge({ status }) {
  const meta = statusLabels[status] ?? { label: status ?? 'غير معروف', className: 'text-muted' };

  return <span className={`badge ${meta.className}`}>{meta.label}</span>;
}
