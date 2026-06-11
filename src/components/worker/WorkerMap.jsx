import useAuth from '../../hooks/useAuth';
import useLocation from '../../hooks/useLocation';
import useOrders from '../../hooks/useOrders';
import MapComponent from '../shared/MapComponent';

export default function WorkerMap() {
  const { profile } = useAuth();
  const { location, requestLocation, loading } = useLocation();
  const { orders, refresh } = useOrders({ mode: 'worker', workerId: profile?.id });

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>خريطة الكابتن</h1>
            <p className="text-muted">عرض الطلبات المتاحة مع موقعك الحالي.</p>
          </div>
          <button type="button" className="btn secondary" onClick={() => { requestLocation(); refresh(); }}>
            {loading ? 'جاري تحديد الموقع...' : 'تحديث الموقع والطلبات'}
          </button>
        </div>

        <MapComponent title="طلبات التوصيل" location={location} orders={orders} />
      </div>
    </div>
  );
}
