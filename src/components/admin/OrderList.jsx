import { Link } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import { formatDateTime } from '../../utils/helpers';
import StatusBadge from '../shared/StatusBadge';

export default function OrderList() {
  const { orders, loading, error, refresh } = useOrders({ mode: 'all' });

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>كل الطلبات</h1>
            <p className="text-muted">عرض مركزي لكل الطلبات في النظام.</p>
          </div>
          <button type="button" className="btn secondary" onClick={refresh}>
            تحديث
          </button>
        </div>

        {error ? <div className="card text-warning">{error.message}</div> : null}

        <div className="stack">
          {loading ? <div className="card">جاري تحميل الطلبات...</div> : null}
          {!loading && orders.length === 0 ? <div className="empty-state">لا توجد طلبات حالياً.</div> : null}

          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="page-header" style={{ marginBottom: 8 }}>
                <div>
                  <h3>{order.item_name}</h3>
                  <div className="small text-muted">{order.id}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-3">
                <div><div className="small text-muted">العميل</div><strong>{order.customer?.full_name ?? order.customer_id}</strong></div>
                <div><div className="small text-muted">الكابتن</div><strong>{order.worker?.full_name ?? order.worker_id ?? '—'}</strong></div>
                <div><div className="small text-muted">الإنشاء</div><strong>{formatDateTime(order.created_at)}</strong></div>
              </div>

              <div className="form-actions">
                <Link className="btn secondary" to={`/worker/order/${order.id}`}>
                  فتح التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
