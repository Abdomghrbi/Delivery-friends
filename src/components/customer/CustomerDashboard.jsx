import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import { formatDateTime, formatStatus } from '../../utils/helpers';
import StatusBadge from '../shared/StatusBadge';

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const { orders, loading, error } = useOrders({ mode: 'customer', customerId: profile?.id });
  const latestOrders = orders.slice(0, 3);

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>لوحة العميل</h1>
            <p className="text-muted">{profile?.full_name ?? 'مرحباً'} · {profile?.is_verified ? 'حساب موثّق' : 'بانتظار التوثيق'}</p>
          </div>
          <div className="form-actions">
            <Link className="btn" to="/customer/new-order">طلب جديد</Link>
            <Link className="btn secondary" to="/customer/orders">كل الطلبات</Link>
          </div>
        </div>

        {error ? <div className="card text-warning">{error.message}</div> : null}

        <div className="grid grid-3" style={{ marginBottom: 16 }}>
          <div className="card">
            <div className="small text-muted">إجمالي الطلبات</div>
            <div className="kpi">{loading ? '...' : orders.length}</div>
          </div>
          <div className="card">
            <div className="small text-muted">آخر حالة</div>
            <div className="kpi">{loading || orders.length === 0 ? '—' : formatStatus(orders[0].status)}</div>
          </div>
          <div className="card">
            <div className="small text-muted">التوثيق</div>
            <div className="kpi">{profile?.is_verified ? '✓' : '⏳'}</div>
          </div>
        </div>

        <div className="grid grid-2">
          <section className="card">
            <h2>آخر الطلبات</h2>
            <div className="stack">
              {latestOrders.length === 0 ? (
                <div className="empty-state">لا توجد طلبات بعد.</div>
              ) : latestOrders.map((order) => (
                <div key={order.id} className="card" style={{ background: 'rgba(15, 23, 42, 0.65)' }}>
                  <div className="page-header" style={{ marginBottom: 8 }}>
                    <strong>{order.item_name}</strong>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="small text-muted">{order.pickup_address} → {order.delivery_address}</div>
                  <div className="small text-muted">{formatDateTime(order.created_at)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>معلومات الحساب</h2>
            <div className="stack">
              <div>
                <div className="small text-muted">الاسم</div>
                <strong>{profile?.full_name ?? '—'}</strong>
              </div>
              <div>
                <div className="small text-muted">الهاتف</div>
                <strong>{profile?.phone ?? '—'}</strong>
              </div>
              <div>
                <div className="small text-muted">الحالة</div>
                <strong>{profile?.is_verified ? 'مفعل' : 'غير مفعل'}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
