import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import { formatDateTime, formatStatus } from '../../utils/helpers';
import StatusBadge from '../shared/StatusBadge';

const statusFlow = ['pending', 'accepted', 'in_transit', 'delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { order, loading, error, refresh } = useOrders({ mode: 'single', orderId });
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    setCurrentStatus(order?.status ?? null);
  }, [order]);

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>تتبع الطلب</h1>
            <p className="text-muted">راقب حالة الطلب ومساره.</p>
          </div>
          <button type="button" className="btn secondary" onClick={refresh}>
            تحديث
          </button>
        </div>

        {loading ? <div className="card">جاري تحميل تفاصيل الطلب...</div> : null}
        {error ? <div className="card text-warning">{error.message}</div> : null}

        {order ? (
          <div className="grid grid-2">
            <section className="card">
              <div className="page-header" style={{ marginBottom: 12 }}>
                <h2>{order.item_name}</h2>
                <StatusBadge status={order.status} />
              </div>

              <div className="stack">
                <div>
                  <div className="small text-muted">الاستلام</div>
                  <strong>{order.pickup_address}</strong>
                </div>
                <div>
                  <div className="small text-muted">التسليم</div>
                  <strong>{order.delivery_address}</strong>
                </div>
                <div>
                  <div className="small text-muted">تاريخ الإنشاء</div>
                  <strong>{formatDateTime(order.created_at)}</strong>
                </div>
                <div>
                  <div className="small text-muted">الحالة الحالية</div>
                  <strong>{formatStatus(currentStatus)}</strong>
                </div>
              </div>
            </section>

            <section className="card">
              <h2>مراحل التنفيذ</h2>
              <div className="stack">
                {statusFlow.map((status) => {
                  const active = statusFlow.indexOf(status) <= statusFlow.indexOf(order.status ?? 'pending');
                  return (
                    <div key={status} className="card" style={{ background: active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(15, 23, 42, 0.65)' }}>
                      <strong>{formatStatus(status)}</strong>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
