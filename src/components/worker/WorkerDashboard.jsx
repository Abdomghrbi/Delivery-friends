import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import { acceptOrder } from '../../services/orderService';
import OrderCard from './OrderCard';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { orders, loading, error, refresh } = useOrders({ mode: 'worker', workerId: profile?.id });

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const assignedOrders = orders.filter((order) => order.worker_id === profile?.id);

  const handleAccept = async (orderId) => {
    await acceptOrder(orderId, profile.id);
    await refresh();
    navigate(`/worker/order/${orderId}`);
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>لوحة الكابتن</h1>
            <p className="text-muted">استقبل الطلبات المتاحة وحدث حالتها.</p>
          </div>
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={refresh}>تحديث</button>
            <Link className="btn secondary" to="/worker/map">الخريطة</Link>
          </div>
        </div>

        {error ? <div className="card text-warning">{error.message}</div> : null}

        <div className="grid grid-3" style={{ marginBottom: 16 }}>
          <div className="card"><div className="small text-muted">الطلبات المتاحة</div><div className="kpi">{loading ? '...' : pendingOrders.length}</div></div>
          <div className="card"><div className="small text-muted">الطلبات المسندة لك</div><div className="kpi">{loading ? '...' : assignedOrders.length}</div></div>
          <div className="card"><div className="small text-muted">إجمالي الظاهر</div><div className="kpi">{loading ? '...' : orders.length}</div></div>
        </div>

        <section className="stack">
          {orders.length === 0 && !loading ? <div className="empty-state">لا توجد طلبات متاحة حالياً.</div> : null}
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <>
                  <button type="button" className="btn" onClick={() => handleAccept(order.id)} disabled={order.status !== 'pending'}>
                    قبول الطلب
                  </button>
                  <Link className="btn secondary" to={`/worker/order/${order.id}`}>
                    التفاصيل
                  </Link>
                </>
              }
            />
          ))}
        </section>
      </div>
    </div>
  );
}
