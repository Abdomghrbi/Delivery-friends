import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import { acceptOrder, markDelivered, markInTransit } from '../../services/orderService';
import StatusBadge from '../shared/StatusBadge';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { profile } = useAuth();
  const { order, loading, error, refresh } = useOrders({ mode: 'single', orderId });

  const handleAccept = async () => {
    await acceptOrder(order.id, profile.id);
    await refresh();
  };

  const handleMarkInTransit = async () => {
    await markInTransit(order.id);
    await refresh();
  };

  const handleMarkDelivered = async () => {
    await markDelivered(order.id);
    await refresh();
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>تفاصيل الطلب</h1>
            <p className="text-muted">تحديث حالة الطلب مباشرة من هنا.</p>
          </div>
          <button type="button" className="btn secondary" onClick={refresh}>
            تحديث
          </button>
        </div>

        {loading ? <div className="card">جاري تحميل البيانات...</div> : null}
        {error ? <div className="card text-warning">{error.message}</div> : null}

        {order ? (
          <div className="grid grid-2">
            <section className="card">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div>
                  <h2>{order.item_name}</h2>
                  <div className="small text-muted">{order.id}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="stack">
                <div><div className="small text-muted">الاستلام</div><strong>{order.pickup_address}</strong></div>
                <div><div className="small text-muted">التسليم</div><strong>{order.delivery_address}</strong></div>
                <div><div className="small text-muted">ملاحظات</div><strong>{order.notes ?? '—'}</strong></div>
              </div>
            </section>

            <section className="card">
              <h2>إجراءات الحالة</h2>
              <div className="form-actions">
                <button type="button" className="btn" onClick={handleAccept} disabled={order.status !== 'pending'}>
                  قبول الطلب
                </button>
                <button type="button" className="btn secondary" onClick={handleMarkInTransit} disabled={order.status !== 'accepted'}>
                  قيد التوصيل
                </button>
                <button type="button" className="btn secondary" onClick={handleMarkDelivered} disabled={order.status !== 'in_transit'}>
                  تم التوصيل
                </button>
              </div>

              <div className="empty-state" style={{ marginTop: 16 }}>
                بعد التسليم يمكن ربط الموقع الفعلي ونظام التتبع المباشر.
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
