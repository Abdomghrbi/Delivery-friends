import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import { formatDateTime } from '../../utils/helpers';
import StatusBadge from '../shared/StatusBadge';

export default function CustomerOrders() {
  const { profile } = useAuth();
  const { orders, loading, error, refresh } = useOrders({ mode: 'customer', customerId: profile?.id });

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>طلباتي</h1>
            <p className="text-muted">كل الطلبات التابعة لحسابك.</p>
          </div>
          <button type="button" className="btn secondary" onClick={refresh}>
            تحديث
          </button>
        </div>

        {error ? <div className="card text-warning">{error.message}</div> : null}

        <div className="stack">
          {loading ? <div className="card">جاري تحميل الطلبات...</div> : null}
          {!loading && orders.length === 0 ? <div className="empty-state">لا توجد طلبات حتى الآن.</div> : null}

          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="page-header" style={{ marginBottom: 10 }}>
                <div>
                  <h3>{order.item_name}</h3>
                  <div className="small text-muted">{formatDateTime(order.created_at)}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-2">
                <div>
                  <div className="small text-muted">الاستلام</div>
                  <strong>{order.pickup_address}</strong>
                </div>
                <div>
                  <div className="small text-muted">التسليم</div>
                  <strong>{order.delivery_address}</strong>
                </div>
              </div>

              <div className="form-actions">
                <Link className="btn secondary" to={`/customer/track/${order.id}`}>
                  تتبع الطلب
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
