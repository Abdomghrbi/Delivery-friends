import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { orders, loading } = useOrders({ mode: 'all' });

  const counts = orders.reduce(
    (acc, order) => {
      acc.total += 1;
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, accepted: 0, in_transit: 0, delivered: 0, cancelled: 0 },
  );

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>لوحة الأدمن</h1>
            <p className="text-muted">إدارة المستخدمين والطلبات والرقابة على النظام.</p>
          </div>
          <div className="form-actions">
            <Link className="btn secondary" to="/admin/users">المستخدمون</Link>
            <Link className="btn secondary" to="/admin/orders">الطلبات</Link>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="card"><div className="small text-muted">إجمالي الطلبات</div><div className="kpi">{loading ? '...' : counts.total}</div></div>
          <div className="card"><div className="small text-muted">قيد الانتظار</div><div className="kpi">{loading ? '...' : counts.pending}</div></div>
          <div className="card"><div className="small text-muted">تم التسليم</div><div className="kpi">{loading ? '...' : counts.delivered}</div></div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <section className="card">
            <h2>إجراءات سريعة</h2>
            <div className="stack">
              <Link className="btn" to="/admin/create-order">إنشاء طلب يدوي</Link>
              <Link className="btn secondary" to="/admin/users">توثيق/إدارة المستخدمين</Link>
            </div>
          </section>

          <section className="card">
            <h2>معلومات الحساب</h2>
            <div className="stack">
              <div><div className="small text-muted">الاسم</div><strong>{profile?.full_name ?? '—'}</strong></div>
              <div><div className="small text-muted">البريد</div><strong>{profile?.phone ?? '—'}</strong></div>
              <div><div className="small text-muted">الدور</div><strong>{profile?.role ?? 'admin'}</strong></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
